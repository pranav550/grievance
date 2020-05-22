import { Component, OnInit, ElementRef } from '@angular/core';
import { FeedbackModalService } from './../../../shared/feedback-modal/feedback-modal.service';
import { FeedbackModalComponent } from './../../../shared/feedback-modal/feedback-modal.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { MasterService } from '../../master/services/master-service';
import { DataService } from '../../../shared/service/data.service'
import { CommonConstants } from '../../../shared/constants';
import { CommonHelper } from '../../../helper/helper.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-grievance-add',
  templateUrl: './grievance-add.component.html',
  styleUrls: ['./grievance-add.component.scss'],
  providers: [MasterService, DatePipe, CommonHelper]
})
export class GrievanceAddComponent implements OnInit {
  placeData: any;
  severityData: any;
  feedBackData: any;
  statesData: any;
  registerGrievancesData: any;
  registerGrevianceForm: FormGroup;
  submitted: boolean = false;
  newData: any;
  designationsData: any;
  categories: any;
  categoriesNature: any;
  institutionData: any;
  talukasData: any;
  villagesData: any;
  districtsData: any;
  submitName: String;
  editGrievanceData: any;
  addGrievance: boolean;
  selectboxdisabled: boolean = false;
  dashboard: any
  maxDate: any = new Date();
  selectedState: any;
  modalView: boolean = false;
  showPassword: string = CommonConstants.passwordDefaultValue;

  constructor(private spinner: NgxSpinnerService,
    private masterService: MasterService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private commonHelper: CommonHelper,
    private router: Router,
    private el: ElementRef,
    private feedbackModalService: FeedbackModalService,
    public dataService: DataService) { }

  ngOnInit() {
    if (this.dataService.editGrievanceDetails == "editGrievanceDetails") {
      if (this.dataService.editGrievanceDetails != undefined) {
        this.submitName = "Update Grievance"
        this.dashboard = '/supervisor-dashboard'
        this.dataService.getCurrentGrievanceDetails.subscribe(message => this.editGrievanceData = message);
        this.addGrievance = false;
        this.selectboxdisabled = true
      }
    }
    else if (this.dataService.editGrievanceDetails == "addGrievanceDetails") {
      this.submitName = "New Grievance"
      this.dashboard = '/dashboard'
      this.addGrievance = true;
      this.selectboxdisabled = false
    }
    this.placesData();
    this.severityValues();
    this.getStates();
    this.getDesignations();
    this.getCategory();
    let mobileNo = localStorage.getItem('mobileNo');
    // name = localStorage.getItem('name')
    this.grievanceRegisterValidations(mobileNo, name);
    this.registerGrevianceForm.controls['filterStateName'].disable();
  }


  placesData() {
    this.placeData = [
      { id: 1, name: "Rural" },
      { id: 2, name: "Urban" }
    ]
  }


  severityValues() {
    this.severityData = [
      { id: 1, name: "Emergency" },
      { id: 2, name: "Non-Emergency" },
      { id: 3, name: "Suggestion" }
    ]
  }


  /** getStates
  * 
  * @param isStates 
  */
  getStates() {
    try {
      this.spinner.show();
      this.masterService.getAll('active_states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.statesData = response.data;
            let selectedValue: any;
            response.data.forEach(element => {
              if (element.id == CommonConstants.stateId) {
                selectedValue = element;
              }
            });
            this.selectedState = selectedValue;
            this.getDistricts(selectedValue.id);
            this.getInstitution(selectedValue.id);
          } else {
            this.spinner.hide();
          }
        }
      }, error => {
        this.spinner.hide();
        //this.modalRef.hide();
      });
    } catch (excp) {
      this.spinner.hide();
    }
  }


  feedBackValues() {
    this.feedBackData = [
      { id: 1, name: "Satisfied" },
      { id: 2, name: "Dissatisfied" }
    ]
  }
  /**GetDistricts
   * 
   * @param stateId 
   */
  getDistricts(stateId: number) {
    this.apiCalling('active_districts', stateId);
  }

  passwordShow(value: string) {
    this.showPassword = value === 'show' ? 'text' : 'password';
  }

  /**GetTalukas
   * 
   * @param districtId 
   */
  getTalukas(districtId: number) {
    this.apiCalling('active_talukas', districtId);
  }

  /**getVillages
   * 
   * @param talukaId 
   */
  getVillages(talukaId: number) {
    this.apiCalling('active_villages', talukaId);
  }

  /**getDesignations
   * 
   * 
   */
  getDesignations() {
    this.apiCallingOnload('active_designations')
  }

  /**getCategory
   * 
   * 
   */
  getCategory() {
    this.apiCallingOnload('active_grievanceType')
  }

  /**getGrievanceNature
   * 
   * @param stateId 
   */
  getGrievanceNature(id) {
    this.apiCalling('active_grievanceNature', id)

    // try {
    //   this.spinner.show();
    //   this.masterService.getData('active_grievanceNature/', id).subscribe((response: any) => {
    //     if (response.status) {
    //       let newData = [];
    //       this.spinner.hide();
    //       response.data.filter(newResponse => {
    //         newData.push({ id: newResponse.grievanceNatureId, name: newResponse.grievanceNatureName });
    //       });
    //       if (newData.length > 0) {
    //         this.spinner.hide();
    //         this.categoriesNature = newData;
    //       } else {
    //         this.categoriesNature = [];
    //       }
    //       this.spinner.hide();
    //     } else {
    //       this.spinner.hide();
    //     }
    //   }, error => {
    //     this.spinner.hide();
    //   });
    // } catch (excp) {
    //   this.spinner.hide();
    // }
  }

  onChangeOfCategory(event) {
    this.getGrievanceNature(event.grievanceTypeId);
  }
  /**getInstitution
   * 
   * @param stateId 
   */
  getInstitution(stateId) {
    this.apiCalling('active_institutions', stateId)
  }


  apiCalling(url: string, id: number) {
    try {
      this.spinner.show();
      this.masterService.getData(url + '/', id).subscribe((response: any) => {
        if (response.status) {
          this.dataBinding(url, response);
        } else {
          this.spinner.hide();
        }
      }, error => {
        //this.modalRef.hide();
        this.spinner.hide();
      });
    } catch (excp) {
      //this.modalRef.hide();
      this.spinner.hide();
    }
  }

  apiCallingOnload(url: string) {
    try {
      this.spinner.show();
      this.masterService.getAll(url).subscribe((response: any) => {
        if (response.status) {
          this.dataBinding(url, response);
        } else {
          this.spinner.hide();
        }
      }, error => {
        //this.modalRef.hide();
        this.spinner.hide();
      });
    } catch (excp) {
      //this.modalRef.hide();
      this.spinner.hide();
    }
  }

  /**Databinding to UI
 * 
 * @param url 
 * @param response 
 */
  dataBinding(url: string, response: any) {
    if (url === 'active_districts') {
      if (response.data[0].districts.length > 0) {
        this.spinner.hide();
        this.districtsData = response.data[0].districts;
      } else {
        this.districtsData = [];
        this.spinner.hide();
      }
    } else if (url === 'active_talukas') {
      this.registerGrevianceForm.get('filterTalukaName').setValue([]);
      this.registerGrevianceForm.get('filterVillageName').setValue([]);
      this.villagesData = [];
      if (response.data[0].talukas.length > 0) {
        this.spinner.hide();
        this.talukasData = response.data[0].talukas;
      } else {
        this.talukasData = [];
        this.spinner.hide();
      }
    } else if (url === 'active_villages') {
      if (response.data[0].villages.length > 0) {
        this.spinner.hide();
        this.villagesData = response.data[0].villages;
      } else {
        this.villagesData = [];
        this.spinner.hide();
      }
    } else if (url === 'active_designations') {
      if (response.data.length > 0) {
        this.spinner.hide();
        this.designationsData = response.data;
      } else {
        this.designationsData = [];
        this.spinner.hide();
      }
    } else if (url === 'active_grievanceType') {
      if (response.data.length > 0) {
        this.spinner.hide();
        this.categories = response.data;
      } else {
        this.spinner.hide();
        this.categories = [];
      }
    } else if (url === 'active_grievanceNature') {
      let newData = [];
      response.data.filter(newResponse => {
        newData.push({ id: newResponse.grievanceNatureId, name: newResponse.grievanceNatureName });
      });

      if (newData.length > 0) {
        this.spinner.hide();
        this.categoriesNature = newData;
      } else {
        this.spinner.hide();
        this.categoriesNature = [];
      }

    } else if (url === 'active_institutions') {
      if (response.data[0].institutionList.length > 0) {
        this.spinner.hide();
        this.institutionData = response.data[0].institutionList;
      } else {
        this.spinner.hide();
        this.institutionData = [];
      }
    } else {
      this.spinner.hide();
    }
  }
  /**empty by default
  * 
  */
  emptyByDefault() {
    this.districtsData = [];
    this.talukasData = [];
    this.villagesData = [];
    this.registerGrevianceForm.get('filterDistrictName').setValue([]);
    this.registerGrevianceForm.get('filterTalukaName').setValue([]);
    this.registerGrevianceForm.get('filterVillageName').setValue([]);
    this.registerGrevianceForm.get('filterDesignationName').setValue([]);
    this.registerGrevianceForm.get('filterGrievanceInstitution').setValue([]);
    this.registerGrevianceForm.get('filterGrievanceCategory').setValue([]);
    this.registerGrevianceForm.get('filterGrievanceNature').setValue([]);
  }

  /**
 * Add form control function
 */
  get rgComplainantNamenF() { return this.registerGrevianceForm.controls; }



  /**grievanceRegisterValidations making rg as registerGrievance in starting 
   * 
   */
  grievanceRegisterValidations(mobileNo: any, name: string) {
    this.submitted = false;
    if (this.addGrievance == true) {
      this.registerGrevianceForm = this.fb.group({
        rgComplainantName: [name, [Validators.required, Validators.maxLength(CommonConstants.maxLength150), Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters)]],
        rgComplainantFatherName: [name, [Validators.required, Validators.maxLength(CommonConstants.maxLength150), Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters)]],
        rgComplainantMobileNum: [mobileNo, [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber)]],
        rgBriefOfGrievance: ['', [Validators.required, Validators.maxLength(CommonConstants.maxLength2500)]],
        //  rgDetailsOfGrievance: ['', [Validators.required, Validators.maxLength(CommonConstants.maxLength2500)]],
        rgSeverity: [],
        rgComplainantAgainst: ['', Validators.required],
        rgreferenceNumber: [''],
        rgMedicalStatus: [true],
        rgFeedBack: ['Deactivated'],
        filterDesignationName: [[], Validators.required],
        filterGrievanceCategory: [[], Validators.required],
        filterGrievanceNature: [[], Validators.required],
        filterGrievanceInstitution: [[], Validators.required],
        rgSelectDate: ['', Validators.required],
        filterStateName: [[], Validators.required],
        filterDistrictName: [[], Validators.required],
        filterTalukaName: [[], Validators.required],
        filterVillageName: [],
        filterPlaceName: [],
        pincode: [],
        address: [[], Validators.required],
        dob: ['', Validators.required],
        rfDefendantDesignation: [[], Validators.required],


      });
    } else if (this.addGrievance == false) {
      this.registerGrevianceForm = this.fb.group({
        rgComplainantName: [this.editGrievanceData.complainant_name, [Validators.required, Validators.maxLength(CommonConstants.maxLength150)]],
        rgComplainantFatherName: [this.editGrievanceData.father_or_husband_name, [Validators.required, Validators.maxLength(CommonConstants.maxLength150)]],
        rgComplainantMobileNum: [this.editGrievanceData.complainant_mobile_number, [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber)]],
        rgBriefOfGrievance: [this.editGrievanceData.description, [Validators.required, Validators.maxLength(CommonConstants.maxLength2500)]],
        //  rgDetailsOfGrievance: [this.editGrievanceData.details, [Validators.required, Validators.maxLength(CommonConstants.maxLength2500)]],
        rgSeverity: [this.editGrievanceData.severity],
        rgComplainantAgainst: [this.editGrievanceData.against, Validators.required],
        rgreferenceNumber: [this.editGrievanceData.reference_number],
        rgMedicalStatus: [this.editGrievanceData.status],
        rgFeedBack: [this.editGrievanceData.feedback],
        filterDesignationName: [this.editGrievanceData.complainantDesignations, Validators.required],
        filterGrievanceCategory: [this.editGrievanceData.grievanceTypes, Validators.required],
        filterGrievanceNature: [this.editGrievanceData.grievanceNatures, Validators.required],
        filterGrievanceInstitution: [this.editGrievanceData.institutions, Validators.required],
        rgSelectDate: [this.editGrievanceData.created_at.date, Validators.required],
        filterStateName: [this.editGrievanceData.states, Validators.required],
        filterDistrictName: [this.editGrievanceData.districts, Validators.required],
        filterTalukaName: [this.editGrievanceData.talukas, Validators.required],
        filterVillageName: [this.editGrievanceData.villages],
        filterPlaceName: [this.editGrievanceData.area_type],
        rfDefendantDesignation: [this.editGrievanceData.defendantDesignation, Validators.required]
      });
      this.registerGrevianceForm.disable();
      this.registerGrevianceForm.controls['rgBriefOfGrievance'].enable();
      //  this.registerGrevianceForm.controls['rgDetailsOfGrievance'].enable();
    }
  }


  /**
   * 
   */
  createGrievance() {
    try {
      this.submitted = true;
      if (this.registerGrevianceForm.invalid) {
        let target = this.el.nativeElement.querySelector('.ng-invalid');
        if (target) {
          $('html,body').animate({ scrollTop: $(target).offset().top - 20 }, 'slow');
          target.focus();
        }
        return;
      }
      let apiData = this.registerGrevianceForm.value;
      let data;
      if (this.addGrievance == true) {
        data = {
          complainantName: apiData.rgComplainantName,
          fatherOrHusbandName: apiData.rgComplainantFatherName,
          complainantMobileNum: apiData.rgComplainantMobileNum,
          complainantDesignationId: apiData.filterDesignationName.designationsId,
          grievanceTypeId: apiData.filterGrievanceCategory.grievanceTypeId,
          grievanceNatureId: apiData.filterGrievanceNature.id,
          description: apiData.rgBriefOfGrievance,
          //  details: apiData.rgDetailsOfGrievance,
          grievanceInstitutionId: apiData.filterGrievanceInstitution.institutionId,
          grievanceStateId: CommonConstants.stateId,
          grievanceDistrictId: apiData.filterDistrictName.districtId,
          areaType: apiData.filterPlaceName == null ? null : apiData.filterPlaceName.name.toLowerCase(),
          against: apiData.rgComplainantAgainst,
          defendantDesignationId: apiData.rfDefendantDesignation.designationsId,
          grievanceTalukaId: apiData.filterTalukaName.talukaId,
          grievanceVillageId: apiData.filterVillageName.villageId,
          referenceDate: this.datepipe.transform(apiData.rgSelectDate, "yyyy-MM-dd HH:mm"),
          severity: apiData.rgSeverity == null ? null : apiData.rgSeverity.name.toLowerCase(),
          pincode: apiData.pincode,
          address: apiData.address,
          dob: apiData.dob
        }
        this.apiCallingForPostData('create_ben_grievance', data)

      } else {
        data = {
          description: apiData.rgBriefOfGrievance,
          //  details: apiData.rgDetailsOfGrievance,
        }
        this.apiCallingForPutData('update_grievance_details/', this.editGrievanceData.id, data)
      }
    } catch (excp) {

    }
  }

  /* For Creating the Grievance*/
  apiCallingForPostData(url: string, data: any) {
    try {
      this.spinner.show();
      this.masterService.postData(url, data).subscribe((response: any) => {
        this.spinner.hide();
        localStorage.setItem('grievanceId', response.data.grievanceId);
        if (response.status) {
          if (url === 'create_ben_grievance') {
            this.commonHelper.toasterMessage(response.message);
            // this.openViewModal()
            this.router.navigate(['/helpdesk-dashboard']);
          } else {
            this.spinner.hide();
          }
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

  openViewModal() {
    this.feedbackModalService.open();
  }


  /* for updating the grievances */
  apiCallingForPutData(url: string, id: number, data: any) {
    try {
      this.spinner.show();
      this.masterService.putData(url, id, data).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          this.router.navigate(['/supervisor-dashboard']);
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (excp) {

    }
  }
  /**StateChange
  * 
  * @param event 
  */
  onStateChange(event: any) {
    this.getDistricts(event.id);
    // this.getDesignations(event.id);
    this.getInstitution(event.id);
    // this.getCategory(event.id);
    // this.getGrievanceNature(event.id);
    this.emptyByDefault();
  }

  /**DistrictChange
 * 
 * @param event 
 */
  onDistrictChange(event: any) {
    this.getTalukas(event.districtId);
  }

  /**onTalukaChange
   * 
   * @param event 
   */
  onTalukaChange(event: any) {
    this.getVillages(event.talukaId);
  }



}
