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
import { DATE } from 'ngx-bootstrap/chronos/units/constants';

@Component({
  selector: 'app-district-wise-reports',
  templateUrl: './district-wise-reports.component.html',
  styleUrls: ['./district-wise-reports.component.scss'],
  providers: [MasterService, DatePipe, CommonHelper]
})
export class DistrictWiseReportsComponent implements OnInit {
  filterForm: FormGroup;
  emptyDataCheck : boolean = false;
  statesData: any;
  errorOrResponse = false;
  districtsData: any;
  reportsDistrictData: any;
  submitted: boolean = false;
  dataTable: any;
  showPickerStart = false;
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
    this.reportsDistrictData = [];
    this.emptyDataCheck = false;

  }
  // validation for forms
  filterDefaultValues() {
    this.filterForm = this.fb.group({
      selectedState: [],
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
      this.errorOrResponse = false;
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

  getReports(param: string) {
    let apiData = this.filterForm.value, data: any,
      stateId: any, startTime: any, endDatetime: any, startDatetime: any;
    stateId = apiData.selectedState ? apiData.selectedState.id : '';
    startDatetime =  this.startDateTime ?  this.startDateTime : '';
    endDatetime =  this.endDateTime ?  this.endDateTime : '';
    data = {
      stateId: stateId,
      startDate: startDatetime,
      endDate: endDatetime,
    }
    this.apiCallForPostData("reports/district", data, param);
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
        if (url === 'reports/district') {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.postDataBinding(response, param);
            this.errorOrResponse = true;
          } else {
            this.reportsDistrictData = [];
            this.errorOrResponse = true;
            this.commonHelper.toasterMessageError(CommonConstants.noResultFound);
            this.emptyDataCheck = false;
          }
        }
      } else {
        this.errorOrResponse = true;
        this.emptyDataCheck = false;
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage)
      }
    }, error => {
      this.reportsDistrictData = [];
      this.errorOrResponse = true;
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
    this.emptyDataCheck = true;
    if (response.data.length > 0) {
      newResponse = response.data;
      if (param === 'isExcel') {
        this.reportData(newResponse, param);
      } else if (param === 'isPdf') {
        this.reportData(newResponse, param);
      } else {
        this.reportsDistrictData = newResponse;
      }
    } else {
      this.reportsDistrictData = [];
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
      headers: ['Name', 'Grievance Raised', 'Grievance Pending', 'Grievance Resolved', 'Resolved Percent(%)']
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
    new Angular5Csv(data, CommonConstants.districtWiseReport, options);
  }

  /**
   * 
   * @param data 
   */
  exportToPdf(data: any) {
    let doc = new jsPDF('p', 'pt'),
      col = ["Sr. No.", "District Name", "Grievance Raised", "Grievance Pending", "Grievance Resolved", "Resolved Percent(%)"],
      rows = [];
      var header = function(data) {
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.text("District Wise Report", 220, 20);
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
    doc.save(CommonConstants.districtWiseReport + '.pdf');
  }

  /**onStateChange
   * 
   * @param event 
   */
  // onStateChange(event: any) {
  //   this.getDistricts(event.id)
  // }

 
  /**
   * 
   */
  downloadExcel() {
    this.getReports('isExcel');
  }

  downloadPdf() {
    this.getReports('isPdf')
  }

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
