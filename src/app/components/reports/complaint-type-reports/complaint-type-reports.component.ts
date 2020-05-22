import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MasterService } from '../../master/services/master-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-complaint-type-reports',
  templateUrl: './complaint-type-reports.component.html',
  styleUrls: ['./complaint-type-reports.component.scss'],
  providers: [MasterService, NgxSpinnerService, CommonHelper, DatePipe]

})
export class ComplaintTypeReportsComponent implements OnInit {
  reportsComplainTypeData: any;
  filterForm: FormGroup;
  submitted: boolean = false;
  emptyDataCheck: boolean = false;
  showPickerStart = false;
  columns: string[];
  rowValues: Array<any> = [];
  vals: Array<any> = [];
  data: any[];
  startDateTime: any;
  maxDate = new Date();
  errorOrResponse = false;
  showDateStart = true;
  showTimeStart = true;
  closeButtonStart: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };
  showPickerEnd = false;
  endDateTime: any;
  showDateEnd = true;
  showTimeEnd = true;
  dataTable: any;
  closeButtonEnd: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };

  constructor(
    private masterService: MasterService,
    private spinner: NgxSpinnerService,
    private commonHelper: CommonHelper,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private chRef: ChangeDetectorRef,
  ) {
    this.endDateTime = this.datepipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
    this.startDateTime = this.datepipe.transform(new Date(), "yyyy-MM-dd 00:00:00");
  }

  ngOnInit() {
    this.filterDefaultValues();
    this.reportsComplainTypeData = [];
    this.emptyDataCheck = false;
    // this.getReports('');
    // this.reploatingDataTable();
    // this.chRef.detectChanges();
    // const table: any = $('table');
    // this.dataTable = table.DataTable().draw();
  }

  filterDefaultValues() {
    this.filterForm = this.fb.group({
      startDateTime: [''],
      endDateTime: [''],
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
      grievanceTypeId: any, endDatetime: any, startDatetime: any;
    startDatetime = this.startDateTime ? this.startDateTime : '';
    endDatetime = this.endDateTime ? this.endDateTime : '';
    data = {
      grievanceTypeId: grievanceTypeId,
      startDate: startDatetime,
      endDate: endDatetime
    }
    this.apiCallForPostData("complaints/type/reports", data, param);
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
        if (url === 'complaints/type/reports') {
          if (Object.keys(response.data).length > 0) {
            this.spinner.hide();
            const entries: any[] = Object['entries'](response.data);
            const result = entries.map(yearData => {
              let key = yearData[0];
              let month = [];
              let month1 = [];
              month.push(Object.keys(yearData[1]));
              month1.push(Object.values(yearData[1]));
              return {
                key1: `district,${month}`,
                value: `${key},${month1}`
              }
              return result;
            })

            this.postDataBinding(result, param);
            this.errorOrResponse = true;
          } else {
            this.spinner.hide();
            this.reportsComplainTypeData = [];
            this.emptyDataCheck = false;
            this.errorOrResponse = true;
            this.commonHelper.toasterMessageError(CommonConstants.noResultFound);
          }
        }
      } else {
        this.errorOrResponse = true;
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage)
      }
    }, error => {
      this.spinner.hide();
      this.reportsComplainTypeData = [];
      this.emptyDataCheck = false;
      this.errorOrResponse = true;
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
    this.vals = [];
    this.errorOrResponse = true;
    if (response.length > 0) {
      this.emptyDataCheck = true;
      newResponse = response;
      for (let i = 0; i < newResponse.length; i++) {
        this.columns = newResponse[0].key1.split(',')
        this.rowValues = newResponse[i].value.split(',')
        this.vals.push(this.rowValues);
      }
      if (param === 'isExcel' || param === 'isPdf') {
        this.reportData(this.vals, param);
      } else {
        this.reportsComplainTypeData = this.vals;
      }
    } else {
      this.reportsComplainTypeData = [];
      this.spinner.hide();
      this.errorOrResponse = true;
      this.emptyDataCheck = false;
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
      let temp = newResponse;
      data.push(temp);
    });
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      headers: this.columns
    };
    if (param === 'isExcel') {
      this.exportToExcel(data, options);
    } else {
      this.exportToPdf(rData);
    }
  }

  /**export to excel
   * 
   * @param data 
   * @param options 
   */
  exportToExcel(data: any, options: any) {
    new Angular5Csv(data, CommonConstants.complaintTypeWiseReport, options);
  }

  /**
   * 
   * @param data 
   */
  exportToPdf(data: any) {
    /* Making the district field */
    let ioF = this.columns.indexOf('district');
    this.columns[ioF] = "Districts";

    let doc = new jsPDF('p', 'pt'),
      col = this.columns,
      rows = [];
    var header = function (data) {
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.text("Grievance Type Report", 220, 20);
    };
    data.filter((element: any, index: number) => {
      let temp = element;
      rows.push(temp);
    });

    doc.autoTable(col, rows, {
      theme: 'grid',
      addPageContent: header,
      startY: 32,
      styles: {
        cellPadding: 0.5,
        fontSize: 8,
      },
      drawCell: function (cell: any, data: any) {
        if (data.column.dataKey === 'price' || data.column.dataKey === 'qty' || data.column.dataKey === 'price') {
          cell.styles.halign = 'right';
        }
      }
    });
    doc.save(CommonConstants.complaintTypeWiseReport + '.pdf');
  }

  // /*redraw the datatable*/
  // reploatingDataTable() {
  //   let table = $('#dataTable1').DataTable();
  //   table.destroy();
  // }

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
