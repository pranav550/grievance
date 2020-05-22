import { Component, OnInit, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MasterService } from "../master/services/master-service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonHelper } from "src/app/helper/helper.component";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { GrievanceDetailsPopupComponent } from '../../shared/grievance-details-popup/grievance-details-popup.component';
import { GrievanceDetailsService } from '../../shared/grievance-details-popup/grievance-details.service'
import { GrievanceViewService } from '../../shared/grievance-time-line-details/grievance-time-line-details.service';
import { CommonConstants } from "src/app/shared/constants";
declare var $: any;

@Component({
  selector: 'app-real-time-dashboard',
  templateUrl: './real-time-dashboard.component.html',
  styleUrls: ['./real-time-dashboard.component.scss'],
  providers: [MasterService, CommonHelper, DatePipe]
})
export class RealTimeDashboardComponent implements OnInit {

  dataTable: any;
  modalRef: BsModalRef;
  allGreviancesData: any;
  isAllGrievanceDataExists: boolean = false;
  isPendingExists: boolean = false;
  isClosedDataExists: boolean = false;
  registerGrievancesData: any;
  pendingGreviancesData: any;
  closedGrevianceData: any;
  districtsData: any;
  categoryData: any;
  beneficaryStatusDetails: any;
  categoriesNature: any;
  adminDashBoardForm: FormGroup;
  grieveanceDetailsData: any
  realTimeData: any;
  modalBool:boolean = false;
  modalView:boolean = false;
  grievanceHistoryData:any;
  actionTakenData: Array<any> = [];
  fileUploadData: Array<any> = [];

  data: any = {
    grievanceId: '',
    grievanceTypeId: '',
    districtId: '',
    statusId: '',
    startDate: '',
    endDate: ''
  }
  maxDate: any = new Date();
  showPickerStart = false;
  submitted: boolean = false;
  startDateTime: Date = null;
  endDateTime: Date = null;
  showPickerEnd = false;
  showDateEnd = true;
  showTimeEnd = true;
  showDateStart = true;
  showTimeStart = true;
  closeButtonStart: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };
  closeButtonEnd: any = { show: true, label: 'Close Me!', cssClass: 'btn btn-sm btn-primary' };

  constructor(
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: Router,
    private modalService: BsModalService,
    public datepipe: DatePipe,
    private grievanceDetailsPopupModal: GrievanceDetailsService,
    private grievanceViewService : GrievanceViewService
  ) { }

  ngOnInit() {
    let apiUrl = "admin/grievance_list_";
    this.getDistricts(CommonConstants.stateId);
    this.getCategory();
    this.getGrievanceNature(1);
    this.getData(apiUrl + "all", this.data , 'start');
    this.validationsForFilters();
    this.getStatus();
    //reloading the entire page on every 5-min
    setInterval(()=>{
          if(window.location.pathname === '/real-time-dashboard'){
            window.location.reload();
          }
        },300000)
  }

  getStatus() {
    this.beneficaryStatusDetails = [
      { id: '', color: "", name: "", dpname: "All"},
      { id: 1, color: "White", name: "withInSevenDays" ,dpname: "Within 7 days" },
      { id: 2, color: "Yellow", name: "processing", dpname: "Processing" },
      { id: 3, color: "Red", name: "notRedressed", dpname: "Not Redressed within 7 days" },
      { id: 4, color: "Green", name: "redressed" , dpname: "Redressed" }
    ];
  }

  /**getCategory
   *
   *
   */
  getCategory() {
    this.apiCallingNoState("active_grievanceType");
  }
  /**getGrievanceNature
   *
   * @param stateId
   */
  getGrievanceNature(stateId) {
    this.apiCalling("active_grievanceNature", stateId);
  }

  /**GetDistricts
   *
   * @param stateId
   */
  getDistricts(stateId: number) {
    this.apiCalling("active_districts", stateId);
  }

  /**
   *
   * @param url
   * @param id
   */
  apiCalling(url: string, id: number) {
    try {
      this.spinner.show();
      this.masterService.getData(url + "/", id).subscribe(
        (response: any) => {
          if (response.status) {
            this.dataBinding(url, response);
          } else {
            this.spinner.hide();
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (excp) {
      this.spinner.hide();
    }
  }

    /**
   *
   * @param url
   * @param id
   */
  apiCallingNoState(url: string) {
    try {
      this.spinner.show();
      this.masterService.getAll(url).subscribe(
        (response: any) => {
          if (response.status) {
            this.dataBinding(url, response);
          } else {
            this.spinner.hide();
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (excp) {
      this.spinner.hide();
    }
  }

  /**Databinding to UI
   *
   * @param url
   * @param response
   */
  dataBinding(url: string, response: any) {
    if (url === "active_districts") {
      if (response.data[0].districts.length > 0) {
        this.spinner.hide();
        response.data[0].districts.push({
          code:'all',
          description:"",
          displayName:"All",
          districtId:"",
          name:'all',
          status:'active'
        })
        response.data[0].districts.sort(function(a, b){return a.districtId - b.districtId});
        this.districtsData = response.data[0].districts;
      } else {
        this.districtsData = [];
        this.spinner.hide();
      }
    } else if (url === "active_grievanceType") {
      if (response.data.length > 0) {
        this.spinner.hide();
        response.data.push({
          description:"",
          grievanceTypeId:"",
          name:'all',
          status:'active'
        })
        response.data.sort(function(a, b){return a.grievanceTypeId - b.grievanceTypeId});
        this.categoryData = response.data;
      } else {
        this.spinner.hide();
        this.categoryData = [];
      }
    } else if (url === "active_grievanceNature") {
      let newData = [];
      response.data.filter((newResponse: any) => {
        newData.push({
          id: newResponse.grievanceNatureId,
          name: newResponse.grievanceNatureName
        });
      });
      if (newData.length > 0) {
        this.spinner.hide();
        this.categoriesNature = newData;
      } else {
        this.spinner.hide();
        this.categoriesNature = [];
      }
    }
  }

  validationsForFilters() {
    this.adminDashBoardForm = this.fb.group({
      selectedDistrict: [],
      selectedGrievanceId: [],
      selectedGrievanceType: [],
      selectedStatus: [],
      startDateTime: [''],
      endDateTime: ['']
    });
  }

  /*getData bind table data */
  getData(apiRoute: string, data:any, value: string) {
    try {
      this.spinner.show();
      this.masterService.postData(apiRoute, data).subscribe(
        (response: any) => {
          if (response.status) {
            if (response.data.length > 0) {
              this.spinner.hide();
              this.reploatingDataTable();
              this.realTimeData = response.data;
              const table: any = $("table");
              this.chRef.detectChanges();
              this.dataTable =  $("#dataTable1").DataTable({"order":[[1,"desc"]]}).draw();
            } else {
              this.spinner.hide();
              $("#dataTable1").DataTable().destroy();
              this.realTimeData = [];
              this.chRef.detectChanges();
              $("#dataTable1").DataTable().draw();
            }
          } else {
            this.spinner.hide();
          }
        },
        error => {
          this.spinner.show();
        }
      );
    } catch (exc) { }
  }

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $("#dataTable1").DataTable();
    table.destroy();
  }
  /*route grievance history screen */
  viewTimeLineGrievance(id) {
    this.modalView = true;
    this.masterService.getData("grievance_history/", id).subscribe(
      (response: any) => {
        if (response) {
          this.spinner.hide();
          this.grievanceHistoryData = response.data;
          this.openViewModal();
        } else {
          this.spinner.hide();
          this.grievanceHistoryData = [];
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

   /* Function for Opening the View Model*/
   openViewModal() {
    this.grievanceViewService.open();
  }

  /* Showing grievance Modal Popup on click of grievamce Id*/
  grievanceDetailsModal(grievanceId) {
    this.modalBool = true;
    this.masterService.getGrievanceDetails('grievance_details/', grievanceId).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.grieveanceDetailsData = response.data[0];
          this.getFiles(grievanceId);
        } else {
          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  /* Submit the filter*/
  submitReport() {
    let apiData = this.adminDashBoardForm.value;
    let grievanceTypeId: any;
    let districtId: any;
    let statusId: any;
    let endDatetime: any;
    let startDatetime: any;

    grievanceTypeId = apiData.selectedGrievanceType ? apiData.selectedGrievanceType.grievanceTypeId : '';
    districtId = apiData.selectedDistrict ? apiData.selectedDistrict.districtId : '';
    statusId = apiData.selectedStatus ? apiData.selectedStatus.name : '';
    startDatetime = this.startDateTime ? this.startDateTime : '';
    endDatetime = this.endDateTime ? this.endDateTime : '';

    this.data = {
      districtId: districtId,
      grievanceId: $('#grievanceId').val(),
      grievanceTypeId: grievanceTypeId,
      status: statusId,
      startDate: startDatetime,
      endDate: endDatetime
    }
    this.getData("admin/grievance_list_all", this.data, 'updating');
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

  
  /* Function for Opening the Password Popup Model*/
  openModal() {
    this.grievanceDetailsPopupModal.open();
  }

  /*getData bind table data */
  getFiles(id) {
    try {
      this.spinner.show();
      this.openModal();
      this.masterService.getAll('grievance_uploads/' + id).subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.actionTakenData = response.data;
            this.actionTakenData.map(item => {
              if (item.isGrievanceRedressed == 1) {
                item.isGrievanceRedressedVal = "Yes";
              } else {
                item.isGrievanceRedressedVal = "No"
              }
              this.fileUploadData = item.uploads
            })

          } else {
            this.spinner.hide();
            this.actionTakenData = [];
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }
}
