import { DataService } from './../../../shared/service/data.service';
import { Component, OnInit, ChangeDetectorRef, TemplateRef, ViewChild } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonHelper } from "src/app/helper/helper.component";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { MasterService } from "../../master/services/master-service";
import { CommonConstants } from 'src/app/shared/constants';
import { GrievanceDetailsPopupComponent } from '../../../shared/grievance-details-popup/grievance-details-popup.component';
import { GrievanceDetailsService } from '../../../shared/grievance-details-popup/grievance-details.service'
import { GrievanceViewService } from '../../../shared/grievance-time-line-details/grievance-time-line-details.service';

declare var $: any;

@Component({
  selector: 'app-level-dashboard',
  templateUrl: './level-dashboard.component.html',
  styleUrls: ['./level-dashboard.component.scss'],
  providers: [MasterService, CommonHelper, DatePipe]
})
export class LevelDashboardComponent implements OnInit {
  @ViewChild('uploaderInput')
  dataTable: any;
  modalRef: BsModalRef;
  allGreviancesData: any;
  registerGrievancesData: any;
  pendingGreviancesData: any;
  closedGrevianceData: any;
  districtsData: any;
  categoryData: any;
  beneficaryStatusDetails: any;
  categoriesNature: any;
  adminDashBoardForm: FormGroup;
  allGRegisteredPerMonth: Number;
  allGResolvedPerMonth: Number;
  islevelGrievanceCountExist: boolean = false;
  levelGrievanceData: any;
  grieveancelevelData: any;
  actionTakenData: Array<any> = [];
  totalIPDCount: Number;
  totalOPDCount: Number;
  isDate: boolean = false;
  isTotalIPDCountExist: boolean = false;
  isTotalOPDCountExist: boolean = false;
  gLId: any;
  modalBool: boolean = false;
  modalView: boolean = false;
  grieveanceDetailsData: any;
  grievanceHistoryData: any;
  talukasData: any = [];
  multipleDistrict: any;
  multipleTalukas: any;
  districts: any = [];
  talukas: any = [];
  talukasIds: any = [];
  districtIdsData: any = [];
  counter = 0;
  districtIds = {};

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
  forwardGrievanceActionForm: FormGroup;
  selectedLevel: any;
  forwardLevel: number;
  errorCheck: boolean = false;
  @ViewChild('uploaderInput')
  uploaderInput: any;
  displayLevelGrievanceData: any;
  statesData: any;
  levelGrievanceActionForm: FormGroup;
  levelsData: any;
  recordIdDeletePhoto: [];
  imageData = [];
  activeTab: string;
  actionLevelId: number;
  levelGrievanceActionData: any;
  isStatus: boolean = false;
  fileUploadData: Array<any> = [];
  newgrievanceData: any;
  delUndoGrievnceData: any;
  isnewGrievanceCountExists: boolean = false;
  newGrievanceCount: any;
  popUpCnfMessage: string;
  delUndoGrievnceHeading: string;
  griId: string;
  gStatus: string;
  submit: boolean = true;
  submits: boolean = true;
  redressedStatusData = [];
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public uploader: FileUploader = new FileUploader({ url: '', });


  constructor(
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: Router,
    private commonHelper: CommonHelper,
    private modalService: BsModalService,
    public datepipe: DatePipe,
    private grievanceDetailsPopupModal: GrievanceDetailsService,
    private grievanceViewService: GrievanceViewService,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.actionLevelId = parseInt(localStorage.getItem('levelId'));
    this.getDistricts(CommonConstants.stateId);
    this.getCategory();
    this.getGrievanceNature(1);
    this.getLevelList(this.data);
    this.allLevelGrievanceCount();
    this.validationsForFilters();
    this.countOfIPDFeedback();
    this.getAllNewGrievanceData(this.data);
    this.countOfOPDFeedback();
    this.getStatus()
    // this.getAllAcceptedGrievanceData(this.data);
    this.redressedStatusData = CommonConstants.statusActionGrievance;
  }
  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;

    this.uploader.onAfterAddingFile = (photoId) => {
      photoId.withCredentials = false;
    };
  }
  removePhotoId(index) {
    this.uploader.queue.splice(index, 1)
  }

  /* function for getting the status*/
  getStatus() {
    this.beneficaryStatusDetails = [
      { id: '', color: "", name: "", dpname: "All" },
      { id: 1, color: "White", name: "withInSevenDays", dpname: "Within 7 days" },
      { id: 2, color: "Yellow", name: "processing", dpname: "Processing" },
      { id: 3, color: "Red", name: "notRedressed", dpname: "Not Redressed within 7 days" },
      { id: 4, color: "Green", name: "redressed", dpname: "Redressed" }
    ];
  }

  //Resetting the input
  resetUploader(inputId) {
    if (inputId == 1) {
      this.uploaderInput.nativeElement.value = "";
    }
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

  /**GetLevel
 *
 * @param stateId
 */
  getLevel(stateId) {
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
        this.levelsData = response.data[0].levels;
        this.levelsData = this.levelsData.filter(levels => levels.levelId != this.actionLevelId);
        this.selectedLevel = this.levelsData[0];
      } else {
        this.levelsData = [];
        this.spinner.hide();
      }
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


  validationsForFilters() {
    this.adminDashBoardForm = this.fb.group({
      selectedDistrict: [],
      selectedGrievanceId: [],
      selectedGrievanceType: [],
      addUserBlockLocation: [],
      selectedStatus: [],
      startDateTime: [''],
      endDateTime: ['']
    });
  }
  /**API calling method
   *
   * @param url
   * @param greviancesType
   */
  allLevelGrievanceCount() {
    try {
      this.spinner.show();
      this.masterService.alllevelGrievanceCount('total_grievance_monthly').subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.islevelGrievanceCountExist = true;
            this.allGRegisteredPerMonth = response.data[0].totalRegistered;
            this.allGResolvedPerMonth = response.data[0].totalResolved;
          } else {
            this.spinner.hide();
            this.islevelGrievanceCountExist = false;
            this.allGRegisteredPerMonth = 0;
            this.allGResolvedPerMonth = 0;
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
  getLevelList(data: any) {
    let data1 = data;
    try {
      this.spinner.show();
      this.masterService.getLevelGrievancesList('level_user/grievance_list', data1).subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            response.data.map(data => {
              // *ngIf="levelData.status == 'pending' || levelData.status == 'accepted'"
            })
            this.spinner.hide();

            this.reploatingDataTable('dataTable1');

            this.levelGrievanceData = response.data;
            //this.levelGrievanceData = [];
            if (this.submit == true) {
              const table: any = $("table");
              this.chRef.detectChanges();
              this.dataTable = $("#dataTable1").DataTable({ "order": [] }).draw();
            }
            // console.log(this.submit)
          } else {
            this.spinner.hide();
            this.levelGrievanceData = [];
            $("#dataTable1").DataTable().destroy();
            this.chRef.detectChanges();
            $("#dataTable1").DataTable({
              language: {
                emptyTable: "No data available in table", //
                loadingRecords: "Please wait .. ", // default Loading...
                zeroRecords: "No records found"
              }
            });
            $("#dataTable1").DataTable().draw();
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }




  /*redraw the datatable*/
  reploatingDataTable(value) {
    let table;
    if (value == 'datatable1') {
      table = $("#dataTable1").DataTable();
    } else {
      table = $("#dataTable2").DataTable();
    }

    table.destroy();
  }

  /*route grievance history screen */
  userDescriptionModal(formData) {
    this.route.navigateByUrl("/grievance-history");
    localStorage.setItem("grievanceId", formData.id);
  }

  /* Showing grievance Modal Popup on click of grievamce Id*/
  grievanceDetailsModal(levelData) {
    this.modalBool = true;
    this.masterService.getGrievanceDetails('grievance_details/', levelData.id).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.grieveanceDetailsData = response.data[0];
          this.getFiles(levelData.id);
        } else {
          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  grievanceActionModal(template: TemplateRef<any>, levelData) {
    this.submitted = false;
    this.getFiles(levelData);
    this.levelGrievanceActionData = levelData;
    this.uploader.queue = [];
    this.isStatus = false;
    this.validationsLevelGrievanceAction();
    this.closeModal()
    this.closeViewModal()
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'grievance-modal-wrapper' }));

  }

  /**addLevelGrievanceDetails
  * 
  */
  validationsLevelGrievanceAction() {
    this.levelGrievanceActionForm = this.fb.group({
      grievanceId: [this.levelGrievanceActionData.id],
      actionLevelId: [this.actionLevelId, [Validators.required]],
      comment: ['', [Validators.required, Validators.maxLength(150)]],
      isGrievanceRedressed: ['0', Validators.required],
    });
    this.levelGrievanceActionForm.removeControl('redressedStatus')
  }


  /* get IPD-Feedback Count*/
  countOfOPDFeedback() {
    try {
      this.spinner.show();
      this.masterService.getOPDFeedBackCount('total_opd_feedback').subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.totalOPDCount = response.data[0].opdFeedback;
            this.isTotalOPDCountExist = true
          } else {
            this.spinner.hide();
            this.isTotalOPDCountExist = true
            this.totalOPDCount = 0;
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }

  /* get IPD-Feedback Count*/
  countOfIPDFeedback() {
    try {
      this.spinner.show();
      this.masterService.getIPDFeedBackCount('total_ipd_feedback').subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.isTotalIPDCountExist = true
            this.totalIPDCount = response.data[0].ipdFeedback;
          } else {
            this.spinner.hide();
            this.isTotalIPDCountExist = false
            this.totalIPDCount = 0;

          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }


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

  closeViewModal() {
    this.grievanceViewService.close();
  }

  checkRedressal(value) {
    if (value == '1') {
      this.isStatus = true;
      this.levelGrievanceActionForm.addControl('redressedStatus', new FormControl([], Validators.required));
      this.levelGrievanceActionForm.addControl('redressedComment', new FormControl(''));
    } else if (value == '0') {
      this.isStatus = false;
      this.levelGrievanceActionForm.removeControl('redressedStatus')
    }
  }
  //get f() { return this.addStateForm.controls; }
  get addlevelGrievanceF() {
    return this.levelGrievanceActionForm.controls;
  }
  addLevelGrievanceAction() {
    this.submitted = true;
    this.submit = false
    // console.log(this.submit)
    this.imageData = [];
    let fileLength;
    fileLength = this.uploader.queue
    let fileCount: number = fileLength.length;
    if (fileCount > 0) {
      fileLength.forEach((val, i, array) => {
        let fileReader = new FileReader();
        fileReader.onloadend = (e) => {
          this.imageData.push(fileReader.result);
        }
        fileReader.readAsDataURL(val._file);
      });
    }
    if (this.levelGrievanceActionForm.invalid) {
      this.spinner.hide();
      return;
    }
    let redrssStatus;
    let apiData = this.levelGrievanceActionForm.value, data: any;
    if (this.isStatus == false) {
      if (apiData.redressedStatus == undefined) {
        redrssStatus = apiData.redressedStatus = "";
      }
    } else if (this.isStatus == true) {
      redrssStatus = apiData.redressedStatus.dpname;
    }
    setTimeout(() => {
      data = {
        grievanceId: apiData.grievanceId ? apiData.grievanceId : '',
        levelId: apiData.actionLevelId ? apiData.actionLevelId : '',
        comment: apiData.comment ? apiData.comment : '',
        file: this.imageData,
        isGrievanceRedressed: parseInt(apiData.isGrievanceRedressed),
        redressedStatus: redrssStatus ? redrssStatus : '',
        redressedComment: apiData.redressedComment ? apiData.redressedComment : ''
      }
      this.apiCallForPostData("level/grievance_action", data);
    }, 500)
  }
  apiCallForPostData(url: string, data: any) {
    this.spinner.show();
    this.masterService.postData(url, data).subscribe((response: any) => {
      if (response.status) {
        if (url === 'level/grievance_action') {
          if (response.status) {
            this.spinner.hide();
            this.commonHelper.toasterMessage(response.message);
            this.spinner.hide();
            this.levelGrievanceActionForm.reset();
            this.uploader.queue = [];
            this.submitted = false;
            this.getLevelList(this.data);

            this.levelGrievanceActionForm.controls['grievanceId'].setValue(this.levelGrievanceActionData.id);
            this.levelGrievanceActionForm.controls['actionLevelId'].setValue(this.actionLevelId);
            this.levelGrievanceActionForm.controls['isGrievanceRedressed'].setValue('0');
            this.isStatus = false;
            this.modalRef.hide();
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        }
      } else {
        this.spinner.hide();
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage)
      }
    }, error => {
      this.spinner.hide();
    });
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
          this.grievanceDetailsPopupModal.open();
        }
      );
    } catch (exc) { }
  }

  /* Open the Grievamce Forward Popup Modal*/
  forwardGrievanceModal(template: TemplateRef<any>, grievanceId, grivanceLId) {
    this.submit = false
    if (this.forwardGrievanceActionForm) {
      this.forwardGrievanceActionForm.reset();
    }
    this.forwardLevel = grievanceId;
    this.gLId = grivanceLId;
    // this.getLevel(CommonConstants.stateId)
    this.getLevels(CommonConstants.stateId, this.forwardLevel)
    this.forwardGrievanceActionForm = this.fb.group({
      level: [this.selectedLevel, [Validators.required]],
      levelfeedback: ['', [Validators.required, Validators.maxLength(250)]]
    });
    this.modalRef = this.modalService.show(template);

  }

  forwardGrivance() {
    try {
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
            this.getLevelList(this.data);
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

  // onGrievanceTypeChange(event) {

  // }

  // onStatusChange(event) {

  // }

  submitReport() {
    let apiData = this.adminDashBoardForm.value;
    let grievanceTypeId: any;
    let districtId: any;
    let statusId: any;
    // let BlockLocation: any;
    let endDatetime: any;
    let startDatetime: any;


    grievanceTypeId = apiData.selectedGrievanceType ? apiData.selectedGrievanceType.grievanceTypeId : '';
    districtId = apiData.selectedDistrict ? apiData.selectedDistrict.districtId : '';
    statusId = apiData.selectedStatus ? apiData.selectedStatus.name : '';
    // BlockLocation = apiData.addUserBlockLocation ? apiData.BlockLocation.name : '';
    startDatetime = this.startDateTime ? this.startDateTime : '';
    endDatetime = this.endDateTime ? this.endDateTime : '';

    this.data = {
      districtId: districtId,
      grievanceId: $('#grievanceId').val(),
      grievanceTypeId: grievanceTypeId,
      status: statusId,
      startDate: startDatetime,
      endDate: endDatetime,
      blockId: this.talukasIds.length == 0 ? "" : this.talukasIds
    }


    /* Validation for Selecting the Start and End Date */
    let sDate = this.datepipe.transform(startDatetime, "yyyy-MM-dd HH:mm:ss"),
      eDate = this.datepipe.transform(endDatetime, "yyyy-MM-dd HH:mm:ss");

    if (sDate) {
      if (eDate) {
        if (sDate >= eDate) {
          this.isDate = true;
        } else {
          this.isDate = false;
        }
      } else {
        this.isDate = false;
      }
    } else {
      this.isDate = false;
    }

    if (this.isDate === false) {
      this.getLevelList(this.data);
    }

  }

  // function to append value in input 
  onValueChange(val: any, endorstart: string) {
    if (endorstart === 'startDT') {
      val = this.datepipe.transform(val, "yyyy-MM-dd HH:mm:ss")
      this.startDateTime = val;
      this.isDate = false;
    }
    if (endorstart === 'endDT') {
      val = this.datepipe.transform(val, "yyyy-MM-dd HH:mm:ss")
      this.endDateTime = val;
      this.isDate = false;
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

  closeModal() {
    this.grievanceDetailsPopupModal.close();
  }

  //change District event
  changeDistrict(event) {
    this.districts = [];
    this.districtIdsData = [];
    this.districtIds = { stateId: CommonConstants.stateId, districtId: event.districtId }
    this.districtIdsData.push(this.districtIds)
    this.districts.push(event.districtId)
    this.getBlock()
    // this.districts = [];
    // this.districtIdsData = [];
    // if (event.length == 0) {
    //   this.talukasData = [];
    //   // this.addUserForm.controls['addUserBlockLocation'].reset();
    // } else {
    //   if (event.length != this.counter) {
    //     // this.addUserForm.controls['addUserBlockLocation'].reset();
    //     this.counter = event.length
    //   }
    //   event.map(data => {
    //     this.districtIds = { stateId: CommonConstants.stateId, districtId: data.districtId }
    //     this.districtIdsData.push(this.districtIds)
    //     this.districts.push(data.districtId)
    //     this.getBlock()
    //   })
    // }
  }

  //change Talukas event
  changeTalukas(event) {
    this.districtIdsData = [];
    this.talukasIds = [];
    event.map(data => {
      this.talukasIds.push(data.talukaId)
      this.districtIdsData.push({ stateId: CommonConstants.stateId, talukaId: data.talukaId })
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

  /* Calling API based on selected Tabs*/
  onSelect(event) {
    this.activeTab = event.heading;
  }

  /* all New Greviances*/
  getAllNewGrievanceData(data: any) {
    let data1 = data
    this.spinner.show();
    this.masterService.getAllNewGrievances('supervisor/grievance_list_new', data1).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.spinner.hide();
          this.reploatingDataTable('datatable2');
          this.isnewGrievanceCountExists = true;
          this.newgrievanceData = response.data;
          this.newGrievanceCount = response.data.length;
          this.chRef.detectChanges();
          this.dataTable = $("#dataTable2").DataTable({ "order": [] }).draw();
        } else {
          this.spinner.hide();
          $("#dataTable2").DataTable().destroy();
          this.isnewGrievanceCountExists = false;
          this.newgrievanceData = [];
          this.newGrievanceCount = 0;
          this.chRef.detectChanges();
          $("#dataTable2").DataTable({
            language: {
              emptyTable: "No data available in table", //
              loadingRecords: "Please wait .. ", // default Loading...
              zeroRecords: "No records found"
            }
          });
          $("#dataTable2").DataTable().draw();
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }



  // /*redraw the datatable*/
  // reploatingDataTable(value) {
  //   let table;
  //   if (value == 'datatable1') {
  //     table = $("#dataTable1").DataTable();
  //   } else if (value == 'datatable2') {
  //     table = $("#dataTable2").DataTable();
  //   } else {
  //     table = $("#dataTable3").DataTable();
  //   }
  //   table.destroy();
  // }

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

  /*Redirect to modify-grievance Page */
  editGrievance(formData) {
    this.dataService.editGrievanceDetails = "editGrievanceDetails";
    this.dataService.getGrievanceDetails(formData)
    this.route.navigate(['/grievance-register'])

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
            // if (status == "accepted") {
            //   this.getAllAcceptedGrievanceData(this.data);
            // }
            // else if (status == "rejected") {
            //   this.getAllRejectedGrievanceData(this.data);
            // } else {
            //   this.getAllRejectedGrievanceData(this.data);
            // }
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

}
