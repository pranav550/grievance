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
  selector: 'app-complaints-summary-reports',
  templateUrl: './complaints-summary-reports.component.html',
  styleUrls: ['./complaints-summary-reports.component.scss'],
  providers: [MasterService, NgxSpinnerService, CommonHelper, DatePipe]

})
export class ComplaintsSummaryReportsComponent implements OnInit {
  selectedState: any;
  statesData: any;
  categories: any;
  errorOrResponse = false;
  emptyDataCheck: boolean = false;
  reportsComplainSummaryData: any = [];
  filterForm: FormGroup;
  submitted: boolean = false;
  showPickerStart = false;
  startDateTime: any;
  dataTable: any;
  maxDate = new Date();
  showDateStart = true;
  showTimeStart = true;
  closeButtonStart: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };
  showPickerEnd = false;
  endDateTime: any;
  showDateEnd = true;
  showTimeEnd = true;
  inc: number = 0;
  closeButtonEnd: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };

  constructor(
    private masterService: MasterService,
    private spinner: NgxSpinnerService,
    private commonHelper: CommonHelper,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private chRef: ChangeDetectorRef
  ) {
    this.endDateTime = this.datepipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
    this.startDateTime = this.datepipe.transform(new Date(), "yyyy-MM-dd 00:00:00");
  }


  ngOnInit() {
    this.getStates();
    this.filterDefaultValues();
    this.emptyDataCheck = false;
  }

  filterDefaultValues() {
    this.filterForm = this.fb.group({
      selectedState: [],
      selectedGrievaceType: [],
      startDateTime: [''],
      endDateTime: [''],
    });
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
            this.errorOrResponse = true;
            this.statesData = response.data;
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
  getCategories(stateId: number) {
    this.apiCalling('grievance_type', stateId);
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
    if (url === 'grievance_type') {
      this.filterForm.get('selectedGrievaceType').setValue([]);
      if (response.data[0].grievanceType.length > 0) {
        this.spinner.hide();
        this.chRef.detectChanges();
        this.categories = response.data[0].grievanceType;
      } else {
        this.categories = [];
        this.spinner.hide();
      }
    }
  }

  /**
  * state change
  * @param event 
  */
  onStateChange(event: any) {
    if (event) {
      this.getCategories(event.id);
    }
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
    grievanceTypeId = apiData.selectedGrievaceType ? apiData.selectedGrievaceType.grievanceTypeId : '';
    startDatetime = this.startDateTime ? this.startDateTime : '';
    endDatetime = this.endDateTime ? this.endDateTime : '';
    grievanceTypeId = !grievanceTypeId ? '' : grievanceTypeId

    data = {
      grievanceTypeId: grievanceTypeId,
      startDate: startDatetime,
      endDate: endDatetime
    }
    this.apiCallForPostData("reports/complaints/summary", data, param);
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
        if (url === 'reports/complaints/summary') {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.postDataBinding(response, param);
            this.errorOrResponse = true;
          } else {
            this.spinner.hide();
            this.emptyDataCheck = false;
            this.reportsComplainSummaryData = [];
            this.commonHelper.toasterMessageError(CommonConstants.noResultFound);
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
      this.emptyDataCheck = false;
      this.reportsComplainSummaryData = [];
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
    this.emptyDataCheck = true;
    this.errorOrResponse = true;
    if (response.data.length > 0) {
      newResponse = response.data;
      if (param === 'isExcel' || param === 'isPdf') {
        this.reportData(newResponse, param);
      } else {
        this.reportsComplainSummaryData = newResponse;
      }
    } else {
      this.reportsComplainSummaryData = [];
      this.spinner.hide();
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
        complaintDate: newResponse.complaintDate,
        complaintId: newResponse.complaintId,
        phoneNumber: newResponse.phoneNumber,
        briefComplaint: newResponse.briefComplaint,
        detailsOfComplaint: newResponse.detailsOfComplaint,
        natureOfComplaint: newResponse.natureOfComplaint,
        districtName: newResponse.districtName,
        talukaName: newResponse.talukaName,
        villageName: newResponse.villageName,
        complaintAgainstInstitution: newResponse.complaintAgainstInstitution,
        complaintAgainstWhom: newResponse.complaintAgainstWhom,
        designationName: newResponse.designationName,
        status: newResponse.status,
      });
    });
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      headers: ['Grievance Date', 'Grievance ID', 'Phone Number', 'Brief Grievance', 'Details of Grievance', 'Nature of Grievance', 'District', 'Tehsil', 'Village', 'Grievance Against Institution', 'Grievance Against Whom', 'Designation', 'Status']
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
    new Angular5Csv(data, CommonConstants.complaintSummaryWiseReport, options);
  }

  /**
   * 
   * @param data 
   */
  exportToPdf(data: any) {
    let doc = new jsPDF('p', 'pt'),
      col = ["Sr. No.", "Grievance Date", "Grievance ID", "Phone Number", "Brief Grievance", "Details of Grievance", "Nature of Grievance", "District", "Tehsil", "Village", "Grievance Against Institution", "Grievance Against Whom", "Designation", "Status"],
      rows = [];
    var header = function (data) {
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.text("Grievance Summary Report", 220, 20);
    };
    data.filter((element: any, index: number) => {
      let temp = [index + 1, element.complaintDate, element.complaintId, element.phoneNumber, element.briefComplaint, element.detailsOfComplaint, element.natureOfComplaint, element.districtName, element.talukaName, element.villageName, element.complaintAgainstInstitution, element.complaintAgainstWhom, element.designationName, element.status];
      rows.push(temp);
    });

    doc.autoTable(col, rows, {
      theme: 'grid',
      startY: 32,
      addPageContent: header,
      styles: {
        cellPadding: 0.5,
        fontSize: 8,
        overflow: 'linebreak',
        valign: 'middle',
        halign: 'center'
      },
      html: document.getElementById('dataTable1'),
      columnStyles: {
        0: { columnWidth: 10},
        1: { columnWidth: 50 },
        2: { columnWidth: 10},
        3: { columnWidth: 35},
        4: { columnWidth: 60},
        5: { columnWidth: 100},
        6: { columnWidth: 30},
        7: { columnWidth: 30},
        8: { columnWidth: 30},
        9: { columnWidth: 30},
        10: { columnWidth: 35},
        11: { columnWidth: 35},
        12: { columnWidth: 35},
        13: { columnWidth: 35}
      },
      drawCell: function (cell: any, data: any) {
        if (data.column.dataKey === 'price' || data.column.dataKey === 'qty' || data.column.dataKey === 'price') {
          cell.styles.halign = 'right';
        }
      }
    });
    doc.save(CommonConstants.complaintSummaryWiseReport + '.pdf');
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
