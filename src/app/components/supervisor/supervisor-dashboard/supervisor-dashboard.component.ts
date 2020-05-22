import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { MasterService } from "../../master/services/master-service";
import { CommonHelper } from "../../../helper/helper.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from "@angular/router";
import { DataService } from '../../../shared/service/data.service'
import { DatePipe } from '@angular/common';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { GrievanceDetailsPopupComponent } from '../../../shared/grievance-details-popup/grievance-details-popup.component';
import { GrievanceDetailsService } from '../../../shared/grievance-details-popup/grievance-details.service'
import { GrievanceViewService } from '../../../shared/grievance-time-line-details/grievance-time-line-details.service';
import { CommonConstants } from 'src/app/shared/constants';
declare var $: any;

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.scss'],
  providers: [MasterService, CommonHelper, DatePipe]
})
export class SupervisorDashboardComponent implements OnInit {
  newGrievanceCount: any;
  newgrievanceData: any = [];
  isnewGrievanceCountExists: boolean = false;
  acceptedGrievanceCount: any;
  acceptedGrievanceData: any;
  isacceptedGrievanceCountExists: boolean = false;
  rejectedGrievanceCount: any;
  rejectedGrievanceData: any;
  isrejectedGrievanceCountExists: boolean = false;
  grieveanceDetailsData: any;
  dataTable: any;
  modalRef: BsModalRef;
  districtsData: any;
  categoryData: any;
  delUndoGrievnceData: any;
  delUndoGrievnceHeading: string;
  popUpCnfMessage: string;
  gStatus: string;
  id: any;
  beneficaryStatusDetails: any;
  grievanceHistoryData: any;
  categoriesNature: any;
  supervisorDashBoardForm: FormGroup;
  activeTab: string;
  griId: string;
  forwardGrievanceActionForm: FormGroup;
  levelsData: any;
  selectedLevel: any;
  errorCheck: boolean = false;
  forwardLevel: number;
  forwardData: any;
  gLId: any
  modalBool: boolean = false;
  modalView: boolean = false;
  actionTakenData: Array<any> = [];
  fileUploadData: Array<any> = [];
  selectedNature: any;
  natureId: number;
  categoriesNature1: any = [];
  gId: Number;

  data: any = {
    grievanceId: '',
    grievanceTypeId: '',
    districtId: '',
    statusId: '',
    startDate: '',
    endDate: '',
    levelType: ''
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

  constructor(private masterService: MasterService,
    private spinner: NgxSpinnerService, private chRef: ChangeDetectorRef, public datepipe: DatePipe,
    private modalService: BsModalService, private route: Router, private commonHelper: CommonHelper,
    public dataService: DataService, private fb: FormBuilder, private grievanceDetailsPopupModal: GrievanceDetailsService,
    private grievanceViewService: GrievanceViewService) { }

  ngOnInit() {
    this.getDistricts(CommonConstants.stateId);
    this.getCategory();
    this.getGrievanceNature(1);
    this.getAllNewGrievanceData(this.data);
    this.getAllAcceptedGrievanceData(this.data);
    this.getAllRejectedGrievanceData(this.data);
    this.validationsForFilters();
    this.getStatus()
    this.getLevels(CommonConstants.stateId)
  }

  /* Calling API based on selected Tabs*/
  onSelect(event) {
    this.activeTab = event.heading;
  }

  getStatus() {
    this.beneficaryStatusDetails = [
      { id: '', color: "", name: "", dpname: "All" },
      { id: 1, color: "White", name: "withInSevenDays", dpname: "Within 7 days" },
      { id: 2, color: "Yellow", name: "processing", dpname: "Processing" },
      { id: 3, color: "Red", name: "notRedressed", dpname: "Not Redressed within 7 days" },
      { id: 4, color: "Green", name: "redressed", dpname: "Redressed" }
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
  * @param 
 */
  getLevels(stateId) {
    this.apiCalling("active_levels", stateId);
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
          code: 'all',
          description: "",
          displayName: "All",
          districtId: "",
          name: 'all',
          status: 'active'
        })
        response.data[0].districts.sort(function (a, b) { return a.districtId - b.districtId });
        this.districtsData = response.data[0].districts;
      } else {
        this.districtsData = [];
        this.spinner.hide();
      }
    } else if (url === "active_grievanceType") {
      if (response.data.length > 0) {
        this.spinner.hide();
        response.data.push({
          description: "",
          grievanceTypeId: "",
          name: 'all',
          status: 'active'
        })
        response.data.sort(function (a, b) { return a.grievanceTypeId - b.grievanceTypeId });
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
    if (url === 'active_levels') {
      if (response.data[0].levels.length > 0) {
        if (response.data[0].levels.length > 0) {
          this.spinner.hide();
          this.levelsData = response.data[0].levels
          this.selectedLevel = response.data[0].levels[0];
        } else {
          this.levelsData = [];
          this.spinner.hide();
        }
      }
    }
  }

  validationsForFilters() {
    this.supervisorDashBoardForm = this.fb.group({
      selectedDistrict: [],
      selectedGrievanceId: [],
      selectedGrievanceType: [],
      selectedStatus: [],
      startDateTime: [''],
      endDateTime: [''],
      levelType: [],
      filterGrievanceNature: []
    });
  }


  /* all New Greviances*/
  getAllNewGrievanceData(data: any) {
    let data1 = data
    this.spinner.show();
    this.masterService.getAllNewGrievances('supervisor/grievance_list_new', data1).subscribe(
      (response: any) => {

        if (response.data.length > 0) {
          this.spinner.hide();
          this.reploatingDataTable('datatable1');
          this.isnewGrievanceCountExists = true;
          this.newgrievanceData = response.data;
          this.newGrievanceCount = response.data.length;
          this.chRef.detectChanges();
          this.dataTable = $("#dataTable1").DataTable({ "order": [] }).draw();
        } else {
          this.spinner.hide();
          $("#dataTable1").DataTable().destroy();
          this.isnewGrievanceCountExists = false;
          this.newgrievanceData = [];
          this.newGrievanceCount = 0;
          this.chRef.detectChanges();
          $("#dataTable1").DataTable().draw();
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  // get levels
  getLevel(stateId: number, gId: number) {
    try {
      this.spinner.show();
      this.masterService.getLevels("levels/", CommonConstants.stateId, this.forwardLevel).subscribe(
        (response: any) => {
          if (response.data.levels.length > 0) {
            this.spinner.hide();
            this.levelsData = response.data.levels
            this.selectedLevel = response.data.levels[0];
          } else {
            this.levelsData = [];
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

  /* all New Greviances*/
  getAllAcceptedGrievanceData(data: any) {
    let data1 = data;
    this.spinner.show();
    this.masterService.getAllNewGrievances('supervisor/grievance_list_accepted', data1).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.data.length > 0) {
          this.spinner.hide();
          this.reploatingDataTable('datatable2');
          this.isacceptedGrievanceCountExists = true
          this.acceptedGrievanceData = response.data;
          this.acceptedGrievanceCount = response.data.length;
          const table: any = $("table");
          this.chRef.detectChanges();
          this.dataTable = $("#dataTable2").DataTable({ "order": [] }).draw();
        } else {
          this.spinner.hide();
          $("#dataTable2").DataTable().destroy();
          this.isacceptedGrievanceCountExists = false;
          this.acceptedGrievanceData = [];
          this.acceptedGrievanceCount = 0
          this.chRef.detectChanges();
          $("#dataTable2").DataTable().draw();
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  /* all New Greviances*/
  getAllRejectedGrievanceData(data: any) {
    let data1 = data;
    this.spinner.show();
    this.masterService.getAllRejectedGrievances('supervisor/grievance_list_rejected', data1).subscribe(
      (response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.reploatingDataTable('datatable3');
            this.isrejectedGrievanceCountExists = true
            this.rejectedGrievanceData = response.data
            this.rejectedGrievanceCount = response.data.length;
            const table: any = $("table");
            this.chRef.detectChanges();
            this.dataTable = $("#dataTable3").DataTable({ "order": [] }).draw();
          } else {
            this.spinner.hide();
            $("#dataTable3").DataTable().destroy();
            this.isrejectedGrievanceCountExists = false;
            this.rejectedGrievanceData = [];
            this.rejectedGrievanceCount = 0;
            this.chRef.detectChanges();
            $("#dataTable3").DataTable().draw();
          }
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  /* Function for Accepting the Grievance*/
  grievanceStatus(id, status, value, gSValue) {
    let data: any = {
      "status": status
    }
    this.spinner.show();
    if (gSValue == 'hidePopup') {
      this.modalRef.hide();
    }
    if (value) {
      this.masterService.putGrievanceStatus('supervisor/grievance_update_status/', id, data).subscribe(
        (response: any) => {
          if (response.data.status) {
            this.spinner.hide();
            if (status == "accepted") {
              this.getAllAcceptedGrievanceData(this.data);
            } else if (status == "rejected") {
              this.getAllRejectedGrievanceData(this.data);
            } else {
              this.getAllRejectedGrievanceData(this.data);
            }
            this.getAllNewGrievanceData(this.data);
            this.commonHelper.toasterMessage(response.message);
          } else {
            this.spinner.hide();
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.hide();
      this.modalRef.hide();
    }
  }

  /*redraw the datatable*/
  reploatingDataTable(value) {
    let table;
    if (value == 'datatable1') {
      table = $("#dataTable1").DataTable();
    } else if (value == 'datatable2') {
      table = $("#dataTable2").DataTable();
    } else {
      table = $("#dataTable3").DataTable();
    }
    table.destroy();
  }

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

  /* Open the Grievamce Forward Popup Modal*/
  forwardGrievanceModal(template: TemplateRef<any>, grievanceId, grivanceLId) {
    if (this.forwardGrievanceActionForm) {
      this.forwardGrievanceActionForm.reset();
    }
    this.gLId = grivanceLId;
    this.forwardLevel = grievanceId;
    // this.getLevels(CommonConstants.stateId)
    this.getLevel(CommonConstants.stateId, this.forwardLevel)
    this.forwardGrievanceActionForm = this.fb.group({
      level: [this.selectedLevel, [Validators.required]],
      levelfeedback: ['', [Validators.required, Validators.maxLength(250)]]
    });
    this.modalRef = this.modalService.show(template);

  }

  forwardGrivance() {
    try {
      this.spinner.show();
      let apiData = this.forwardGrievanceActionForm.value;
      this.forwardData = {
        grievanceId: this.forwardLevel,
        levelId: apiData.level.levelId,
        comment: apiData.levelfeedback
      }
      this.modalRef.hide();
      this.masterService.postData('forward_grievance', this.forwardData).subscribe((response: any) => {
        if (response) {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.commonHelper.toasterMessage(response.message);
            this.getAllAcceptedGrievanceData(this.data);
          } else {
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
        }
      });
    } catch (exc) {
      this.spinner.hide();
    }
  }

  /* Opening forward grievance confirmation Popup Model*/
  forwardCnfGrievanceModal(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }

  /*route grievance history screen */
  viewTimeLineGrievance(id) {
    this.modalBool = false;
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

  /*Redirect to modify-grievance Page */
  editGrievance(formData) {
    this.dataService.editGrievanceDetails = "editGrievanceDetails";
    this.dataService.getGrievanceDetails(formData)
    this.route.navigate(['/grievance-register'])

  }

  /**
   * deleteGrievance(Grievance)
   * @param template 
   * @param delUndoGdata 
   */
  deletGrievanceModal(template: TemplateRef<any>, delUndoGdata: any, value: string, grievanceId: string) {
    this.delUndoGrievnceData = delUndoGdata
    this.griId = grievanceId;
    if (value == 'undo') {
      this.delUndoGrievnceHeading = 'Move Grievance'
      this.popUpCnfMessage = 'Are you sure you want to move the grievance to list of new grievances ?'
      this.gStatus = 'pending'
    } else if (value == 'reject') {
      this.delUndoGrievnceHeading = 'Reject Grievance'
      this.popUpCnfMessage = 'Are you sure you want to reject the grievance ?'
      this.gStatus = 'rejected'
    } else {
      this.delUndoGrievnceHeading = 'Accept Grievance'
      this.popUpCnfMessage = 'Are you sure you want to accept the grievance ?'
      this.gStatus = 'accepted'
    }
    this.modalRef = this.modalService.show(template);
  }

  submitReport() {
    let apiData = this.supervisorDashBoardForm.value;
    let grievanceTypeId: any;
    let districtId: any;
    let statusId: any;
    let endDatetime: any;
    let startDatetime: any;
    let levelType: any;

    grievanceTypeId = apiData.selectedGrievanceType ? apiData.selectedGrievanceType.grievanceTypeId : '';
    districtId = apiData.selectedDistrict ? apiData.selectedDistrict.districtId : '';
    statusId = apiData.selectedStatus ? apiData.selectedStatus.name : '';
    startDatetime = this.startDateTime ? this.startDateTime : '';
    endDatetime = this.endDateTime ? this.endDateTime : '';
    levelType = apiData.levelType ? apiData.levelType.levelId : '';

    this.data = {
      districtId: districtId,
      grievanceId: $('#grievanceId').val(),
      grievanceTypeId: grievanceTypeId,
      status: statusId,
      startDate: startDatetime,
      endDate: endDatetime,
      levelType: levelType
    }

    /* Validation for Selecting the Start and End Date */
    let sDate = this.datepipe.transform(startDatetime, "yyyy-MM-dd HH:mm:ss"),
      eDate = this.datepipe.transform(endDatetime, "yyyy-MM-dd HH:mm:ss");

    if (sDate) {
      if (eDate) {
        if (sDate >= eDate) {
          this.submitted = true;
        } else {
          this.submitted = false;
        }
      } else {
        this.submitted = false;
      }
    } else {
      this.submitted = false;
    }

    /* Calling API Only when the Start Date is not greater than than the End Date */
    if (this.submitted === false) {
      // if(this.activeTab === 'New Grievances' || this.activeTab == undefined){
      this.getAllNewGrievanceData(this.data);
      // }else if(this.activeTab === 'Accepted Grievances'){
      this.getAllAcceptedGrievanceData(this.data);
      // }else if(this.activeTab === 'Rejected Grievances'){
      this.getAllRejectedGrievanceData(this.data);
      // } 
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

  //function to diaable or enable the submit button
  emptyDisable(event) {
    if (event.target.value.length <= 250) {
      this.errorCheck = false;
    } else if (event.target.value.length > 250) {
      this.errorCheck = true;
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

  // get grievance nature id 
  getGrievanceNature1(id) {
    //this.apiCalling('active_grievanceNature', id)
    try {
      this.spinner.show();
      this.masterService.getData('active_grievanceNature/', id).subscribe((response: any) => {
        if (response.status) {
          let newData = [];
          this.spinner.hide();
          response.data.filter(newResponse => {
            newData.push({ id: newResponse.grievanceNatureId, name: newResponse.grievanceNatureName });
          });
          if (newData.length > 0) {
            this.spinner.hide();
            this.categoriesNature1 = newData;
          } else {
            this.categoriesNature1 = [];
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }, error => {
        this.spinner.hide();
      })

    } catch (excp) {
      this.spinner.hide();
    }
  }

  onNatureChange(value) {
    this.selectedNature = value
    this.natureId = value.id;
    //  this.getLevels(this.gId, this.natureId, CommonConstants.stateId);
    // this.getMatrixData(this.gId, this.natureId, this.stateId);
  }

  /**
 * categorychange
 * @param event
 */
  onAddCategoryChange(event: any, value) {
    if (event) {
      this.supervisorDashBoardForm.controls['filterGrievanceNature'].reset();
      this.gId = event.grievanceTypeId;
      if (typeof (event.grievanceTypeId) == 'string') {
        this.gId = 0
      }
      // this.getMatrixData(event.grievanceTypeId, this.natureId, this.stateId);
      this.getGrievanceNature1(this.gId);
    } else {
      this.gId = 1;
    }
  }
}
