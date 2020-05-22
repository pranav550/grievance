import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from '../../master/services/master-service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable';
import { CommonConstants } from 'src/app/shared/constants';
import { CommonHelper } from 'src/app/helper/helper.component';


@Component({
  selector: 'app-block-wise-report',
  templateUrl: './block-wise-report.component.html',
  styleUrls: ['./block-wise-report.component.scss'],
  providers: [MasterService, DatePipe, CommonHelper]
})
export class BlockWiseReportComponent implements OnInit {

  filterForm: FormGroup;
  statesData: any;
  districtsData: any;
  emptyDataCheck : boolean = false;
  reportsBlockData: any;
  dataTable: any;
  submitted: boolean = false;
  showPickerStart = false;
  errorOrResponse = false;
  startDateTime: any;
  maxDate = new Date();
  showDateStart = true;
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
    private chRef: ChangeDetectorRef,
    private commonHelper: CommonHelper) { 
      this.endDateTime = this.datepipe.transform(new Date(),"yyyy-MM-dd HH:mm:ss");
      this.startDateTime = this.datepipe.transform(new Date(),"yyyy-MM-dd 00:00:00");
    }

  ngOnInit() {
    this.getStates();
    this.filterDefaultValues();
    this.reportsBlockData = [];
    this.emptyDataCheck = false;
    // this.reploatingDataTable(true);
  }

  filterDefaultValues() {
    this.filterForm = this.fb.group({
      selectedState: [],
      selectedDistrict: [],
      startDateTime: [''],
      endDateTime: [''],
    });
  }
  // toggle function to show datetime picker modal
  onTogglePicker(value) {
    if (value == 'startDT') {
      if (this.showPickerStart === false) {
        this.showPickerStart = true;

      }
    }
    if (value == 'endDT') {
      if (this.showPickerEnd === false) {
        this.showPickerEnd = true;
      }
    }
  }
  // function to append value in input 
  onValueChange(val, endorstart) {
    if (endorstart == 'startDT') {
      val = this.datepipe.transform(val, "yyyy-MM-dd HH:mm:ss")
      this.startDateTime = val;
      this.submitted = false;
    }
    if (endorstart == 'endDT') {
      val = this.datepipe.transform(val, "yyyy-MM-dd HH:mm:ss")
      this.endDateTime = val;
      this.submitted = false;
    }
  }

  /** getStates
   * 
   * @param isStates 
   */
  getStates() {
    try {
      this.spinner.show();
      this.errorOrResponse = false
      this.masterService.getAll('active_states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.statesData = response.data;
            this.errorOrResponse = true;
          } else {
            this.spinner.hide();
            this.errorOrResponse = true;
          }
        }
      }, error => {
        this.spinner.hide();
        this.errorOrResponse = true;
      });
    } catch (excp) {
      this.spinner.hide();
    }
    setTimeout(() => {
      this.spinner.hide();
      if (this.errorOrResponse == false) {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, 40000)
  }


  /**GetDistricts
     * 
     * @param stateId 
     */
  getDistricts(stateId: number) {
    this.apiCalling('active_districts', stateId);
  }

  apiCalling(url: string, id: number) {
    try {
      this.spinner.show();
      this.masterService.getData(url + '/', id).subscribe((response: any) => {
        if (response.status) {
          this.getDataBinding(url, response);
        } else {
          this.spinner.hide();
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (excp) {
      this.spinner.hide();
    }
  }

  getDataBinding(url: string, response: any) {
    if (url === 'active_districts') {
      this.filterForm.get('selectedDistrict').setValue([]);
      if (response.data[0].districts.length > 0) {
        this.spinner.hide();
        this.districtsData = response.data[0].districts;
      } else {
        this.districtsData = [];
        this.spinner.hide();
      }
    }
  }

  /**getReports
   * 
   */
  getReports(param: string) {
    let apiData = this.filterForm.value, data: any,
      districtId: any, endDatetime: any, startDatetime: any;
    districtId = apiData.selectedDistrict ? apiData.selectedDistrict.districtId : '';
    startDatetime = this.startDateTime ? this.startDateTime : '';
    endDatetime = this.endDateTime ? this.endDateTime : '';
    districtId = !districtId ? '' : districtId

    data = {
      districtId: districtId,
      startDate: startDatetime,
      endDate: endDatetime
    }
    this.apiCallForPostData("reports/block", data, param);
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
        if (url === 'reports/block') {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.postDataBinding(response, param);
            this.errorOrResponse = true;
          } else {
            this.spinner.hide();
            this.errorOrResponse = true;
            this.reportsBlockData = [];
            this.spinner.hide();
            this.commonHelper.toasterMessageError(CommonConstants.noResultFound);
            this.emptyDataCheck = false;
          }
        }
      } else {
        this.spinner.hide();
        this.errorOrResponse = true;
        this.emptyDataCheck = false;
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage)
      }
    }, error => {
      this.spinner.hide();
      this.reportsBlockData = [];
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
    newResponse = response.data;
    this.emptyDataCheck = true;
    this.errorOrResponse = true;
    if (param === 'isExcel' || param === 'isPdf') {
      this.reportData(newResponse, param);
    } else {
      this.reportsBlockData = newResponse;
    }
  }

  onStateChange(event: any) {
    this.getDistricts(event.id)
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
        name: newResponse.name,
        complaintRaised: newResponse.complainRaised,
        complaintPending: newResponse.totalPending,
        complaintResolved: newResponse.totalResolved,
        resolvedPercent: newResponse.totalPercent
      });
    });
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      headers: ['Taluka Name', 'Grievance Raised', 'Grievance Pending', 'Grievance Resolved', 'Resolved Percent(%)']
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
    new Angular5Csv(data, CommonConstants.blockWiseReport, options);
  }

  /**
   * 
   * @param data 
   */
  exportToPdf(data: any) {
    let doc = new jsPDF('p', 'pt'),
      col = ["Sr. No.", "Taluka Name", "Grievance Raised", "Grievance Pending", "Grievance Resolved", "Grievance Percent(%)"],
      rows = [];
      // header fuction is used for giving the title of table
      var header = function(data) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.text("Block Report", 220, 20);
      };

    data.filter((element: any, index: number) => {
      let temp = [index + 1, element.name, element.complaintRaised, element.complaintPending, element.complaintResolved, element.resolvedPercent];
      rows.push(temp);
    });
    doc.autoTable(col, rows, {
      theme: 'grid',
      startY: 32,
      addPageContent: header,
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
    doc.save(CommonConstants.blockWiseReport + '.pdf');
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
