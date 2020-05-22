import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from '../../master/services/master-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable';
import { CommonConstants } from 'src/app/shared/constants';
import { CommonHelper } from 'src/app/helper/helper.component';


@Component({
  selector: 'app-month-wise-reports',
  templateUrl: './month-wise-reports.component.html',
  styleUrls: ['./month-wise-reports.component.scss'],
  providers: [DatePipe, MasterService, CommonHelper],
})

export class MonthWiseReportsComponent implements OnInit {
  emptyDataCheck: boolean = false;
  filterForm: FormGroup;
  statesData: any;
  districtsData: any;
  reportsMonthData: any;
  dataTable: any;
  submitted: boolean = false;
  errorOrResponse = false;
  showPickerStart = false;
  startDateTime: any;
  maxDate = new Date();
  showDateStart = true;
  reportsMonth = [];
  showTimeStart = true;
  closeButtonStart: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };
  showPickerEnd = false;
  endDateTime: any;
  showDateEnd = true;
  showTimeEnd = true;
  closeButtonEnd: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };


  constructor(private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private commonHelper: CommonHelper) {
      this.endDateTime = this.datepipe.transform(new Date(),"yyyy-MM-dd HH:mm:ss");
      this.startDateTime = this.datepipe.transform(new Date(),"yyyy-MM-dd 00:00:00");
     }

  ngOnInit() {
    this.filterDefaultValues();
    this.reportsMonthData = [];
    this.emptyDataCheck = false;
  }

  filterDefaultValues() {
    this.filterForm = this.fb.group({
      startDateTime: ['',Validators.required],
      endDateTime: ['',Validators.required],
    });
  }
  // toggle function to show datetime picker modal
  onTogglePicker(value: string) {
    if (value == 'startDT') {
      if (!this.showPickerStart) {
        this.showPickerStart = true;

      }
    }
    if (value == 'endDT') {
      if (!this.showPickerEnd) {
        this.showPickerEnd = true;
      }
    }
  }
  // function to append value in input 
  onValueChange(val: any, endorstart: string) {
    if (endorstart === 'startDT') {
      val = this.datepipe.transform(val, "yyyy-MM-dd HH:mm:ss")
      this.startDateTime = val;
      this.submitted = false;
    }
    if (endorstart === 'endDT') {
      val = this.datepipe.transform(val, "yyyy-MM-dd HH:mm:ss")
      this.endDateTime = val;
      this.submitted = false;
    }
  }

  /**getReports
   * 
   */
  getReports(param: string) {
    let apiData = this.filterForm.value, data: any,
    endDatetime: any, startDatetime: any;
    startDatetime = this.startDateTime ? this.startDateTime : '';
    endDatetime = this.endDateTime ? this.endDateTime : '';
    data = {
      startDate: startDatetime,
      endDate: endDatetime
    }
    this.apiCallForPostData("reports/monthly", data, param);
  }

  /**
   * 
   * @param url 
   * @param data 
   */
  apiCallForPostData(url: string, data: any, param: string) {
    this.spinner.show();
    this.errorOrResponse = false;
    this.masterService.postData(url, data).subscribe((response: any) => {
      if (response.status) {
        if (url === 'reports/monthly') {
          if (response.data) {
            const data = response
            this.spinner.hide();
            this.postDataBinding(response, param);
            this.errorOrResponse = true;
          } else {
            this.spinner.hide();
            this.reportsMonthData = [];
            this.commonHelper.toasterMessageError(CommonConstants.noResultFound);
            this.emptyDataCheck = false;
            this.errorOrResponse = true;
          }
        }
      } else {
        this.errorOrResponse = true;
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage)
      }
    }, error => {
      this.spinner.hide();
      this.errorOrResponse = true;
      this.reportsMonthData = [];
      this.emptyDataCheck = false;
    });
    setTimeout(() => {
      this.spinner.hide();
      if (this.errorOrResponse == false) {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, 40000)
  }


  postDataBinding(response: any, param: string) {
    let newResponse = [];
    this.errorOrResponse = true;
    if (response) {
      const response1 = {
        data: Object.entries(response.data).reduce((res, [year, val]) => ([
          ...res, 
          ...Object.entries(val).reduce((res2, [month, val2]) => ([
            ...res2,
            {
              key: year,
              ...val2,
              year: `${year}-${month}`
            }
          ]), []),
        ]), [])
      };
      newResponse = response1.data;
      this.emptyDataCheck = true;
      if (param === 'isExcel' || param === 'isPdf') {
        this.reportData(newResponse, param);
      } else {
        this.reportsMonthData = newResponse;
      }
    } else {
      this.reportsMonthData = [];
      this.emptyDataCheck = false;
      this.errorOrResponse = true;
      this.commonHelper.toasterMessageError(CommonConstants.noResultFound);
    }
  }

  /**
   * 
   * @param rData 
   * @param param 
   */
  reportData(rData: any, param: any) {
    let data = [];
    rData.filter((newResponse: any) => {
      data.push({
        month: newResponse.year,
        complaintRaised: newResponse.complaintRaised,
        complaintResolved: newResponse.totalClosed,
        complaintPending: newResponse.totalPending,
        resolvedPercent: newResponse.resolvedPercent
      });
    });
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      headers: ['Month', 'Grievance Raised', 'Grievance Resolved', 'Grievance Pending', 'Resolved Percent(%)']
    };
    if (param === 'isExcel') {
      this.exportToExcel(data, options);
    } else {
      this.exportToPdf(data);
    }
  }

  /**export to excel
   * 
   * @param data 
   * @param options 
   */
  exportToExcel(data: any, options: any) {
    new Angular5Csv(data, CommonConstants.monthlyWiseReport, options);
  }

  /**
   * 
   * @param data 
   */
  exportToPdf(data: any) {
    let doc = new jsPDF('p', 'pt'),
      col = ["Sr. No.", "Month", "Grievance Raised", "Grievance Resolved", "Grievance Pending", "Resolved Percent(%)"],
      rows = [];
      var header = function(data) {
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.text("Month Wise Report", 220, 20);
      };
    data.filter((element: any, index: number) => {
      let temp = [index + 1, element.month, element.complaintRaised, element.complaintResolved, element.complaintPending, element.resolvedPercent];
      rows.push(temp);
    });
    doc.autoTable(col, rows, {
      theme: 'grid',
      startY: 32,
      addPageContent:header,
      styles: {
        cellPadding: 0.5,
        fontSize: 8
      },
      drawCell: function (cell: any, data: any) {
        if (data.column.dataKey === 'price' || data.column.dataKey === 'qty' || data.column.dataKey === 'price') {
          cell.styles.halign = 'right';
        }
      }
    });
    doc.save(CommonConstants.monthlyWiseReport + '.pdf');
  }


  /**downloadExcel
   * 
   */
  downloadExcel() {
    this.getReports('isExcel');
  }

  /**downloadPdf
   * 
   */
  downloadPdf() {
    this.getReports('isPdf')
  }

  /**submitReport
   * 
   */
  submitReport() {
    let sDate = this.datepipe.transform(this.startDateTime, "yyyy-MM-dd HH:mm:ss"),
      eDate = this.datepipe.transform(this.endDateTime, "yyyy-MM-dd HH:mm:ss");
    if (sDate) {
      if (eDate) {
        if (sDate >= eDate) {
          this.submitted = true;
          this.emptyDataCheck = false;
        } else {
          this.submitted = false;
          this.getReports('');
        }
      } else {
        this.submitted = false;
        this.getReports('')
      }
    } else {
      this.submitted = false;
      this.getReports('')
    }
  }
}

