import {
  Component,
  OnInit,
  TemplateRef,
  ChangeDetectorRef
} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MasterService } from "../../master/services/master-service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonHelper } from "src/app/helper/helper.component";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { Router } from "@angular/router";
import { BsModalService } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { GrievanceDetailsPopupComponent } from '../../../shared/grievance-details-popup/grievance-details-popup.component';
import { GrievanceDetailsService } from '../../../shared/grievance-details-popup/grievance-details.service'
import { GrievanceViewService } from '../../../shared/grievance-time-line-details/grievance-time-line-details.service';
import { filter } from "rxjs/operators";
import { CommonConstants } from "src/app/shared/constants";
declare var $: any;


@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
  providers: [MasterService, CommonHelper, DatePipe, GrievanceDetailsPopupComponent]
})
export class AdminDashboardComponent implements OnInit {
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
  grieveanceDetailsData: any;
  grievanceHistoryData: any;
  forwardGrievanceActionForm: FormGroup;
  levelsData: any;
  selectedLevel: any;
  errorCheck: boolean = false;
  forwardLevel: number;
  gLId: any;
  modalBool: boolean = false;
  modalView: boolean = false;
  grievanceDetails: any;
  actionTakenData: Array<any> = [];
  fileUploadData: Array<any> = [];
  tabActive: string;
  gId: Number;
  talukasData: any = [];
  multipleDistrict: any;
  multipleTalukas: any;
  districts: any = [];
  talukas: any = [];
  talukasIds: any = [];
  districtIdsData: any = [];
  counter = 0;
  districtIds = {};
  selectedNature: any;
  natureId: number;
  categoriesNature1: any = [];

  data: any = {
    grievanceId: '',
    grievanceTypeId: '',
    grievanceNatureId: '',
    districtId: '',
    statusId: '',
    startDate: '',
    endDate: '',
    selectedLevelType: ''
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
    private commonHelper: CommonHelper,
    private grievanceDetailsPopupModal: GrievanceDetailsService,
    private grievanceViewService: GrievanceViewService
  ) { }

  ngOnInit() {

    let apiUrl = "admin/grievance_list_";
    this.getDistricts(CommonConstants.stateId);
    this.getCategory();
    this.getGrievanceNature(1);
    this.getAllGrievancesCount();
    this.getData(apiUrl + "all", this.data);
    this.validationsForFilters();
    this.getStatus();
    this.getLevel(CommonConstants.stateId);
    // this.getLevels(CommonConstants.stateId, this.forwardLevel)
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
   * @param stateId
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

  /**GetLevel
*
* @param stateId
*/
  getLevel(stateId) {
    this.apiCalling("active_levels", stateId);
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
        this.spinner.hide();
        this.levelsData = response.data[0].levels
        this.selectedLevel = response.data[0].levels[0];
      } else {
        this.levelsData = [];
        this.spinner.hide();
      }
    }
  }

  reset() {
    this.adminDashBoardForm.reset()
    console.log("check")
    this.gId = undefined;
    this.natureId = undefined
    this.talukasIds = []
  }

  validationsForFilters() {
    this.adminDashBoardForm = this.fb.group({
      selectedDistrict: [],
      selectedGrievanceId: [],
      selectedGrievanceType: [],
      selectedStatus: [],
      addUserBlockLocation: [],
      startDateTime: [''],
      endDateTime: [''],
      selectedLevelType: [],
      filterGrievanceNature: []
    });
  }

  /*submit FeedBack*/
  submitUserFeedback() {
    try {
      let apiValues = this.forwardGrievanceActionForm.value,
        status = apiValues.feedbackStatus ? 'satisfied' : 'unsatisfied',
        data = {
          "grievanceId": this.gId,
          "feedback": status,
          "comment": apiValues.feedbackComment,
        }
      this.modalRef.hide();
      this.masterService.postData('grievance_feedback_by_admin', data).subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.commonHelper.toasterMessage(response.message);
            // this.getData("beneficiary/grievance_list_all");
            this.getData("admin/grievance_list_all", this.data);
          } else {
            this.spinner.hide();
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }

  /**API calling method
   *
   * @param url
   * @param greviancesType
   */
  getAllGrievancesCount() {
    try {
      this.spinner.show();
      this.masterService.getAll('admin/total/count').subscribe(
        (response: any) => {
          if (response.status) {
            if (response.data.length > 0) {
              this.spinner.hide();
              this.isAllGrievanceDataExists = true;
              this.allGreviancesData = response.data[0].totalRegistered;
              this.pendingGreviancesData = response.data[0].totalPending;
              this.closedGrevianceData = response.data[0].totalClosed;
            } else {
              this.spinner.hide();
              this.isAllGrievanceDataExists = false;
              this.allGreviancesData = 0;
              this.pendingGreviancesData = 0;
              this.closedGrevianceData = 0;
            }
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

  // get levels
  getLevels(stateId: number, gId: number) {
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

  /*getData bind table data */
  getData(apiRoute: string, data: any) {
    try {
      this.spinner.show();
      this.masterService.postData(apiRoute, data).subscribe(
        (response: any) => {
          if (response.status) {
            if (response.data.length > 0) {
              this.spinner.hide();
              this.reploatingDataTable();
              this.registerGrievancesData = response.data;
              const table: any = $("table");
              this.chRef.detectChanges();
              this.dataTable = $("#dataTable1").DataTable({ "order": [] }).draw();
            } else {
              this.spinner.hide();
              $("#dataTable1").DataTable().destroy();
              this.registerGrievancesData = [];
              this.chRef.detectChanges();
              $("#dataTable1").DataTable().draw();
            }
          } else {
            this.spinner.hide();
          }
        },
        error => {
          this.spinner.hide();
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
  /*routing grievance history screen */
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

  /* Submit the filter*/
  submitReport() {
    let apiData = this.adminDashBoardForm.value;
    console.log(apiData)
    let grievanceTypeId: any;
    let grievanceNatureId: any;
    let districtId: any;
    let statusId: any;
    let blockTalukaId: any;
    // let BlockLocation: any;
    let endDatetime: any;
    let startDatetime: any;
    let selectedLevelType: any;

    grievanceTypeId = apiData.selectedGrievanceType ? apiData.selectedGrievanceType.grievanceTypeId : '';
    grievanceNatureId = apiData.filterGrievanceNature ? apiData.filterGrievanceNature.id : '';
    districtId = apiData.selectedDistrict ? apiData.selectedDistrict.districtId : '';
    statusId = apiData.selectedStatus ? apiData.selectedStatus.name : '';

    // BlockLocation = apiData.addUserBlockLocation ? apiData.BlockLocation.name : '';
    startDatetime = this.startDateTime ? this.startDateTime : '';
    endDatetime = this.endDateTime ? this.endDateTime : '';
    selectedLevelType = apiData.selectedLevelType ? apiData.selectedLevelType.levelId : '';
    this.data = {
      districtId: districtId,
      grievanceId: $('#grievanceId').val(),
      grievanceTypeId: grievanceTypeId,
      status: statusId,
      startDate: startDatetime,
      endDate: endDatetime,
      levelType: selectedLevelType,
      blockId: this.talukasIds.length == 0 ? "" : this.talukasIds,
      grievanceNatureId: grievanceNatureId
    }


    /* Validation for Selecting the Start and End Date */
    let sDate = this.datepipe.transform(startDatetime, "yyyy-MM-dd HH:mm:ss");
    let eDate = this.datepipe.transform(endDatetime, "yyyy-MM-dd HH:mm:ss");
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

    if (this.submitted === false) {
      this.getData("admin/grievance_list_all", this.data);
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

  /* Showing grievance Modal Popup on click of grievamce Id*/
  grievanceDetailsModal(grievanceId) {
    this.modalBool = true;
    this.masterService.getGrievanceDetails('grievance_details/', grievanceId).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.spinner.hide();
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
    this.forwardLevel = grievanceId
    this.getLevels(CommonConstants.stateId, this.forwardLevel)
    this.forwardGrievanceActionForm = this.fb.group({
      level: [this.selectedLevel, [Validators.required]],
      levelfeedback: ['', [Validators.required, Validators.maxLength(250)]]
    });
    this.modalRef = this.modalService.show(template);

  }

  /* Showing the User Grievance FeedBack Modal Popup*/
  grievanceUserFeedBackModal(template: TemplateRef<any>, grievanceId) {
    if (this.forwardGrievanceActionForm) {
      this.forwardGrievanceActionForm.reset();
    }
    this.forwardGrievanceActionForm = this.fb.group({
      feedbackComment: ['', Validators.maxLength(250)],
      feedbackStatus: [true, Validators.required]
    });
    this.gId = grievanceId;
    this.modalRef = this.modalService.show(template);
  }

  /* Function for forwarding the grievance to next Level*/
  forwardGrivance() {
    try {
      this.spinner.show();
      let apiData = this.forwardGrievanceActionForm.value,
        data = {
          grievanceId: this.forwardLevel,
          levelId: apiData.level.levelId,
          comment: apiData.levelfeedback
        }
      this.modalRef.hide();
      this.masterService.postData('forward_grievance', data).subscribe((response: any) => {
        if (response) {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.commonHelper.toasterMessage(response.message);
            this.getData("admin/grievance_list_all", this.data);
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

  /* Function for getting the data based on the coor filters */
  getColorFilterData(filterValue) {
    this.tabActive = filterValue;
    this.data = {
      districtId: '',
      grievanceId: '',
      grievanceTypeId: '',
      status: filterValue,
      startDate: '',
      endDate: ''
    }
    this.getData("admin/grievance_list_all", this.data);
  }

  //change District event
  changeDistrict(event) {
    this.districts = [];
    this.districtIdsData = [];
    this.adminDashBoardForm.controls['addUserBlockLocation'].reset();
    this.districtIds = { stateId: CommonConstants.stateId, districtId: event.districtId }
    this.districtIdsData.push(this.districtIds)
    this.districts.push(event.districtId)
    this.getBlock()
  }

  //change Talukas event
  changeTalukas(event) {
    this.districtIdsData = [];
    this.talukasIds = [];
    event.map(data => {
      this.districtIdsData.push({ stateId: CommonConstants.stateId, talukaId: data.talukaId })
      this.talukasIds.push(data.talukaId)
    })
  }

  // get Block 
  getBlock() {
    try {
      let data = {
        "district_id": this.districts
      }
      this.masterService.postData('talukas', data).subscribe((response: any) => {
        this.talukas = [];
        this.talukasData = [];
        if (response.status) {
          response.data.map(data => {
            this.talukasData.push(data)
            this.talukas.push(data.name)

          })
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  // clear the search
  clearFilter(value1) {
    if (value1 == false) {
      this.counter = this.counter - 1;
      //  this.addUserForm.controls['addUserBlockLocation'].reset();
    }
    else {
      this.counter = this.counter + 1;
    }
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
    this.natureId = undefined
    if (event) {
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
