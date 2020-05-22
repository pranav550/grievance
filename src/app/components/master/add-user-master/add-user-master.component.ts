import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MasterService } from '../../master/services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../../shared/service/data.service'

@Component({
  selector: 'app-add-user-master',
  templateUrl: './add-user-master.component.html',
  styleUrls: ['./add-user-master.component.scss'],
  providers: [MasterService, CommonHelper, DatePipe]

})
export class AddUserMasterComponent implements OnInit {
  submitted = false;
  addUserForm: FormGroup;
  userTitleData: any;
  errorOrResponse = false;
  userData: any;
  dateFormateValueDob: string = "";
  dateFormateValueDoj: string = "";
  editUserForm: any;
  dateConversion: boolean;
  statesData: any;
  districtsDataPermanent: any;
  districtsDataCurrent: any;
  talukas: any = [];
  districts: any = []
  multipleDistrict: any;
  designationsData: any;
  levelData: any;
  stateIdPermanent: number;
  stateIdCurrent: number;
  selectedStateEvent: any;
  selectedDesignationsEvent: any;
  dateValid: boolean = false;
  dateValidDoj: boolean = false;
  selectedDistrictEvent: any;
  selectedLevelEvent: any;
  selectedRoleEvent: any;
  maritalStatusData: any;
  dataTable: any;
  religionData: any;
  communityData: any;
  rolesData: any;
  checkAddressType: number;
  selectedgender: any;
  selectedLevel: any;
  sameAddress: boolean;
  bsValue = new Date();
  addUser: boolean = true;
  editDataUser: any;
  bsRangeValue: Date[];
  userId: number;
  maxDate = new Date();
  maxDateJoin = new Date();
  maxDateEdit = new Date();
  maxDateEditJoin = new Date();
  districtIds = {};
  districtIdsData: any = [];
  submitName = "";
  stateId: number;
  isDislayDistrict: boolean = false;
  isDislayBlock: boolean = false;
  isDislayState: boolean = false;
  showPassword: string = CommonConstants.passwordDefaultValue;
  defaultStateValue: number;
  multipleTalukas: any;
  events: any = [];
  userType: any;
  talukasIds: any;
  talukasData: any = [];
  checkTalukas: any;
  counter = 0;
  categories: any = []
  categoriesNature: any = [];
  selectedNature: any;
  natureId: any = [];
  gId: any = [];
  roleId: number;
  grievanceObj: any = {}
  grievanceNatureObj: any = {};
  grievanceArray: any = []
  grievanceNatureArray: any = [];
  grievanceArrayId: any = []
  grievanceNatureArrayId: any = [];
  userLocation: string;
  userState: string;
  userDistrict: any = [];
  newUserDistrict: any = [];
  userBlock: any = []
  addGrievance: any = [];
  addNature: any = [];
  multpleEmail: any = [];
  multipleContact: any = [];
  selectedCategory: any;
  emailValue: any = [];
  contactValue: any = [];

  constructor(public datepipe: DatePipe, private el: ElementRef, public dataService: DataService, public router: Router, private masterService: MasterService, private chRef: ChangeDetectorRef, private commonHelper: CommonHelper, private spinner: NgxSpinnerService, private fb: FormBuilder
  ) {
    this.sameAddress = true;
  }

  ngOnInit() {
    if (this.dataService.editUser == "editUserDetails") {
      if (this.dataService.editUser != undefined) {
        this.submitName = "Update User"
        this.dataService.getCurrentUserDetails.subscribe(message => this.editDataUser = message);
        this.addUser = false;
      }
    }
    else if (this.dataService.editUser == "addUserDetails") {
      this.submitName = "Create User"
      this.addUser = true;
    }
    this.getStates();
    this.getDesignations();
    this.getCategories();
    // this.getLevels(this.gId, this.natureId, CommonConstants.stateId);
    this.getRoles(CommonConstants.stateId);
    this.userTitleData = CommonConstants.title;
    this.selectedgender = CommonConstants.gender;
    this.selectedLevel = CommonConstants.level;
    this.maritalStatusData = CommonConstants.maritalStatus;
    this.communityData = CommonConstants.community;
    this.religionData = CommonConstants.religion;
    this.checkAddressType = CommonConstants.checkBeforeAddressType;
    this.getUsers();
    this.submitted = false;
    this.validatorRule();
    this.maxDate.setDate(this.maxDate.getDate());
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.maxDateJoin.setDate(this.maxDate.getDate());
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.checkAddressType = CommonConstants.checkBeforeAddressType;
    this.sameAddress = true;
    this.rolesData = [];
    this.levelData = [];
    this.designationsData = [];
    this.stateIdCurrent = null;
    this.stateIdPermanent = null;
    this.addUserForm.controls['addUserAddressState'].disable();
    this.addUserForm.controls['addUserCurrentState'].disable();
    this.addUserForm.controls['addUserLocationState'].disable();

  }

  /*validation rules*/
  validatorRule() {
    if (this.addUser == true) {
      this.addUserForm = this.fb.group({
        addUserTitle: [[], Validators.required],
        addUserFirstName: ['', [Validators.required, Validators.maxLength(CommonConstants.maxLength150), Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters)]],
        addUserMiddleName: ['', [Validators.maxLength(CommonConstants.maxLength150), Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters)]],
        addUserLastName: ['', [Validators.required, Validators.maxLength(CommonConstants.maxLength150), Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters)]],
        addUserGender: [[], Validators.required],
        addUserLocation: [[]],
        addUserLocationState: [[]],
        addUserDistrictLocation: [[]],
        addUserBlockLocation: [[]],
        addContactNo: ['', [Validators.required]],
        addEmergencyContactNo: ['', [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber)]],
        addUserDOB: ['', [Validators.required]],
        addUserEmail: ['', [Validators.required]],
        addUserMaritalStatus: [[]],
        addUserAdharNo: ['', Validators.pattern(CommonConstants.regexAadharNumber)],
        addUserPanNo: ['', Validators.pattern(CommonConstants.regexPanNo)],
        addUserName: ['', [Validators.required]],
        addUserPassword: ['', [Validators.required, Validators.pattern(CommonConstants.passwordRegex)]],
        addUserDOJ: ['', [Validators.required]],
        addUserFather: ['', [Validators.maxLength(CommonConstants.maxLength150), Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters)]],
        addUserMother: ['', [Validators.maxLength(CommonConstants.maxLength150), Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters)]],
        addUserCommunity: [[]],
        addUserReligion: [[]],

        addUserAddressLine1: [''],
        addUserAddressLine2: [''],
        addUserAddressState: [[]],
        // addUserAddressStateAll: [[]],
        addUserAddressDistrict: [[]],
        addUserAddressPincode: ['', Validators.pattern(CommonConstants.regexPinCode)],
        addUserCurrentAddressLine1: ['', [Validators.required]],
        addUserCurrentAddressLine2: [''],
        addUserCurrentState: [[], [Validators.required]],
        addUserCurrentDistrict: [[], [Validators.required]],
        addUserCurrentPinCode: ['', [Validators.required, Validators.pattern(CommonConstants.regexPinCode)]],
        addUserDesignations: [[], [Validators.required]],
        addSelectCategory: [[], [Validators.required]],
        filterGrievanceNature: [[]],
        addUserRoles: [[], [Validators.required]],
        addUserLevels: [[], [Validators.required]],
        addUserStatus: [true, Validators.required],
        addUserSameAsCurrent: [this.checkAddressType]
      });

    } else if (this.addUser == false) {
      this.userId = this.editDataUser.id;
      this.sameAddress = true;
      if (this.editDataUser.community != "") {
        if (!this.editDataUser.community['name']) {
          this.editDataUser.community = { name: this.editDataUser.community };
        }
      }
      if (this.editDataUser.title != "") {
        if (!this.editDataUser.title['name']) {
          this.editDataUser.title = { name: this.editDataUser.title };
        }
      }
      if (this.editDataUser.gender != "") {
        if (!this.editDataUser.gender['name']) {
          this.editDataUser.gender = { name: this.editDataUser.gender };
        }
      }
      if (this.editDataUser.religion != "") {
        if (!this.editDataUser.religion['name']) {
          this.editDataUser.religion = { name: this.editDataUser.religion };
        }
      }
      if (this.editDataUser.maritalStatus != "") {
        if (!this.editDataUser.maritalStatus['name']) {
          this.editDataUser.maritalStatus = { name: this.editDataUser.maritalStatus };
        }
      }
      if (this.editDataUser.roles != "") {
        if (this.editDataUser.roles['name']) {
          this.editDataUser.roles = { id: this.editDataUser.roles.id, name: this.editDataUser.roles.name };
        }
      }

      // if (this.editDataUser.grievanceType != "") {

      //   this.editUserForm.value.addSelectCategory = this.addUserForm.value.addSelectCategory.grievanceTypeId;
      // }

      // if (this.editDataUser.grievanceType != "") {
      //   if (this.editDataUser.grievanceType) {
      //     this.editDataUser.roles = { roleName: this.editDataUser.roles.name, id: this.editDataUser.roles.id };
      //   }
      // }
      let addressLine1, addressLine2, addressPinCode, addressDistricts, addressStates, currentStates, currentDistricts, currentAddressLine1, currentAddressLine2, currentPinCode;
      this.editDataUser.addresses.forEach(element => {
        if (element.type == "permanent") {
          addressLine1 = element.addressLine1;
          addressLine2 = element.addressLine2;
          addressPinCode = element.pinCode;
          addressDistricts = element.districts;
          addressStates = element.states;
          this.stateIdPermanent = CommonConstants.stateId;
          this.getDistricts(this.stateIdPermanent, "addChange", "permanentAddress");
        } else if (element.type != "permanent") {
          addressLine1 = "";
          addressLine2 = "";
          addressPinCode = "";
          addressDistricts = [];
          addressStates = [];
        }
        if (element.type == "current" || element.type == "both") {
          currentAddressLine1 = element.addressLine1;
          currentAddressLine2 = element.addressLine2;
          currentPinCode = element.pinCode;
          currentDistricts = element.districts;
          currentStates = element.states;
          this.stateIdCurrent = CommonConstants.stateId;
          this.getDistricts(this.stateIdCurrent, "addChange", "currentAddress");
        }
      });

      // no pincode and materialStatus
      this.userDistrict = [];
      this.userBlock = [];
      this.editUserForm = this.editDataUser;
      let status = this.editDataUser.status === 'active' ? true : false;
      this.editDataUser.userType.map(data => {
        this.districts.push(data.districtId)
        this.getBlock()
        this.userLocation = data.type
        this.userState = data.stateName;

        if (data.districtName.length > 0) {
          this.userDistrict.push(data.districtName)
        }
        this.userDistrict.filter(data => {
          if (this.newUserDistrict.includes(data) == false) {
            this.newUserDistrict.push(data)
          }
        })
        if (data.talukaName.length > 0) {
          this.userBlock.push(data.talukaName)
        }

        if (this.userLocation == "State") {
          this.isDislayDistrict = false
          this.isDislayBlock = false
          this.isDislayState = true
        }
        if (this.userLocation == "Division") {
          this.isDislayDistrict = true
          this.isDislayBlock = false
          this.isDislayState = true
        }
        if (this.userLocation == "District") {
          this.isDislayDistrict = true
          this.isDislayBlock = false
          this.isDislayState = true
        }
        if (this.userLocation == "Block") {
          this.isDislayDistrict = true
          this.isDislayBlock = true
          this.isDislayState = true
        }
      })

      this.addUserForm = this.fb.group({
        addUserTitle: [this.editDataUser.title.name, Validators.required],
        addUserFirstName: [this.editDataUser.firstName, [Validators.required]],
        addUserMiddleName: [this.editDataUser.middleName],
        addUserLastName: [this.editDataUser.lastName, [Validators.required]],
        addUserGender: [this.editDataUser.gender.name, [Validators.required]],
        addUserLocation: [this.userLocation],
        addUserLocationState: [this.userState],
        addUserDistrictLocation: [this.newUserDistrict],
        addUserBlockLocation: [this.userBlock],
        addContactNo: [this.editDataUser.contactNumber, [Validators.required]],
        addEmergencyContactNo: [this.editDataUser.emergencyContactNumber, [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber)]],
        addUserDOB: [this.editDataUser.dateOfBirth, [Validators.required]],
        addUserEmail: [this.editDataUser.email, [Validators.required]],
        addUserMaritalStatus: [this.editDataUser.maritalStatus],
        addUserAdharNo: [this.editDataUser.aadharNumber, Validators.pattern(CommonConstants.regexAadharNumber)],
        addUserPanNo: [this.editDataUser.panNumber, Validators.pattern(CommonConstants.regexPanNo)],
        addUserName: [this.editDataUser.userName, [Validators.required]],
        addUserDOJ: [this.editDataUser.dateOfJoining, [Validators.required]],
        addUserFather: [this.editDataUser.fathersName],
        addUserMother: [this.editDataUser.mothersName],
        addUserCommunity: [this.editDataUser.community],
        addUserReligion: [this.editDataUser.religion],
        addUserAddressLine1: [addressLine1],
        addUserAddressLine2: [addressLine2],
        addUserAddressState: [this.editDataUser.designations.name],
        addUserAddressDistrict: [addressDistricts],
        addUserAddressPincode: [addressPinCode, Validators.pattern(CommonConstants.regexPinCode)],
        addUserCurrentAddressLine1: [currentAddressLine1, [Validators.required]],
        addUserCurrentAddressLine2: [currentAddressLine2],
        addUserCurrentState: [currentStates, [Validators.required]],
        addUserCurrentDistrict: [currentDistricts, [Validators.required]],
        addUserCurrentPinCode: [currentPinCode, [Validators.required, Validators.pattern(CommonConstants.regexPinCode)]],
        addUserDesignations: [this.editDataUser.designations, [Validators.required]],
        addSelectCategory: [this.addGrievance, [Validators.required]],
        filterGrievanceNature: [this.addNature],
        addUserRoles: [this.editDataUser.roles.name, [Validators.required]],
        addUserLevels: [this.editDataUser.levels, [Validators.required]],
        addUserStatus: status,
        addUserSameAsCurrent: [this.checkAddressType],

      });

      this.grievanceArray = [];
      this.grievanceArrayId = [];
      this.grievanceNatureArrayId = []
      this.grievanceNatureArray = []
      //const editData = this.editDataUser.grievanceType
      this.editDataUser.grievanceType.map((data) => {
        this.grievanceArrayId.push(data.grievanceTypeId)
        this.grievanceArray.push({ id: data.grievanceTypeId, name: data.grievanceTypeName })
      })
      // console.log(editData)
      this.editDataUser.grievanceNature.map((data) => {
        this.grievanceNatureArrayId.push(data.grievanceNatureId)
        this.grievanceNatureArray.push({ id: data.grievanceNatureId, name: data.grievanceNatureName })
      })

      this.addNature = this.grievanceNatureArray
      this.addGrievance = this.grievanceArray

      // remove password
      this.addUserForm.removeControl('addUserPassword');

    }
  }
  /**
  * Password show 
  * @param value 
  */
  passwordShow(value: string) {
    this.showPassword = value === 'show' ? 'text' : 'password';
  }
  /*get states*/
  getStates() {
    try {
      this.masterService.getAll('active_states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length != 0) {
            this.statesData = response.data;
            this.districtIdsData.push({ stateId: CommonConstants.stateId })
            let selectedValue: any;
            response.data.forEach(element => {
              if (element.id == CommonConstants.stateId) {
                selectedValue = element;
              }
            });
            this.defaultStateValue = selectedValue;
            this.getDistricts(selectedValue.id, 'addChange', 'currentAddress');
            this.getDistricts(selectedValue.id, 'addChange', 'permanentAddress');
            this.validatorRule();
          }
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          this.statesData = [];
          this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  // function for copying same address as permanent address
  copyAddressCurrent() {
    this.addUserForm.controls['addUserAddressState'].setValue(this.addUserForm.value.addUserCurrentState);
    this.addUserForm.controls['addUserAddressDistrict'].setValue(this.addUserForm.value.addUserCurrentDistrict);
    this.addUserForm.controls['addUserAddressLine1'].setValue(this.addUserForm.value.addUserCurrentAddressLine1);
    this.addUserForm.controls['addUserAddressLine2'].setValue(this.addUserForm.value.addUserCurrentAddressLine2);
    this.addUserForm.controls['addUserAddressPincode'].setValue(this.addUserForm.value.addUserCurrentPinCode);
  }
  // Change function for address type
  checkSameAddress(event, value) {
    if (value == 'addChange') {
      if (event.target.checked == true) {
        this.sameAddress = false;
        this.districtsDataCurrent = [];
        this.districtsDataPermanent = [];
        this.getDistricts(CommonConstants.stateId, value, "currentAddress");
        this.checkAddressType = CommonConstants.checkAfterAddressType;
        this.copyAddressCurrent();
      } else {
        this.sameAddress = true;
        this.checkAddressType = CommonConstants.checkBeforeAddressType;
        let apiValues = this.addUserForm.value;
        this.districtsDataPermanent = [];
        this.copyAddressCurrent();
        this.getDistricts(CommonConstants.stateId, value, "permanentAddress");
      }
    }
  }


  /*state change event*/
  onStateChange(event, value, addressType) {
    if (value == 'addChange') {
      if (event) {
        if (addressType == "currentAddress") {
          this.addUserForm.controls['addUserCurrentDistrict'].setValue([])
          this.getDistricts(CommonConstants.stateId, value, addressType);
          this.stateIdCurrent = event.id;
        } else if (addressType == "permanentAddress") {
          this.addUserForm.controls['addUserAddressDistrict'].setValue([])
          this.getDistricts(CommonConstants.stateId, value, addressType);
          this.stateIdPermanent = event.id
        }
      }
    }
    if (value == 'roleDesgLvl') {
      this.addUserForm.controls['addUserDesignations'].setValue([]);
      this.addUserForm.controls['addUserLevels'].setValue([]);
      this.addUserForm.controls['addUserRoles'].setValue([])
    }
  }

  /**
   * 
   * @param stateId 
   * @param value 
   */
  getDistricts(stateId, value, addressType) {
    try {
      this.masterService.getData('active_districts/', stateId).subscribe((response: any) => {
        if (response.data) {
          if (value === 'addChange') {
            if (addressType == 'currentAddress') {
              this.districtsDataCurrent = response.data[0].districts;
            }
            if (addressType == 'permanentAddress') {
              this.districtsDataPermanent = response.data[0].districts;
            }
          }
        }
        else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          if (value === 'addChange') {
            this.addUserForm.get('addUserDistrict').setValue([]);
            this.districtsDataPermanent = [];
            this.districtsDataCurrent = [];
          }
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  //change District event
  changeDistrict(event) {
    this.districts = [];
    this.districtIdsData = [];
    if (event.length == 0) {
      this.talukasData = [];
      this.addUserForm.controls['addUserBlockLocation'].reset();
    } else {
      if (event.length != this.counter) {
        this.addUserForm.controls['addUserBlockLocation'].reset();
        this.counter = event.length
      }
      event.map(data => {
        this.districtIds = { stateId: CommonConstants.stateId, districtId: data.districtId }
        this.districtIdsData.push(this.districtIds)
        this.districts.push(data.districtId)
        this.getBlock()
      })
    }
  }

  //change Talukas event
  changeTalukas(event) {
    this.districtIdsData = [];
    event.map(data => {
      this.talukasIds = { stateId: CommonConstants.stateId, talukaId: data.talukaId }
      this.districtIdsData.push(this.talukasIds)
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
      this.addUserForm.controls['addUserBlockLocation'].reset();
    }
    else {
      this.counter = this.counter + 1;
    }
  }

  // get the user type enable 
  changeLocation(event) {
    this.userType = event.name
    if (event.name == "State") {
      this.isDislayDistrict = false
      this.isDislayBlock = false
      this.isDislayState = true
      this.addUserForm.controls['addUserLocationState'].disable();
    }
    else if (event.name == "Division") {
      this.isDislayDistrict = true
      this.isDislayBlock = false
      this.isDislayState = true
      this.addUserForm.controls['addUserLocationState'].disable();
    }
    else if (event.name == "District") {
      this.isDislayDistrict = true
      this.isDislayBlock = false
      this.isDislayState = true
      this.addUserForm.controls['addUserLocationState'].disable();
    }
    else if (event.name == "Block") {
      this.isDislayDistrict = true
      this.isDislayBlock = true
      this.isDislayState = true
      this.addUserForm.controls['addUserLocationState'].disable();
    }
  }

  /** get designations
    * 
    * @param stateId 
    */
  getDesignations() {
    try {
      this.masterService.getAll('active_designations').subscribe((response: any) => {
        if (response.data) {
          if (response.data.length > 0) {
            this.designationsData = response.data;
          } else {
            this.designationsData = [];
          }
        }
        else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          this.addUserForm.get('addUserDesignations').setValue([]);
          this.selectedDesignationsEvent = [];
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /*get Levels*/
  getLevels(categoryId: number, stateId: number, natureId: number) {
    try {
      let data = {
        natureId: this.natureId,
        stateId: CommonConstants.stateId,
        gId: this.gId
      }
      if (this.gId.length > 0) {
        this.masterService.getLev("get_levels/", data.gId, data.stateId, data.natureId).subscribe((response: any) => {
          if (response.data) {
            if (response.data.levels.length > 0) {
              this.levelData = response.data.levels;
            } else {
              this.levelData = [];
            }
          }
          else {
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
            this.addUserForm.get('addUserLevels').setValue([]);
            this.levelData = [];
            this.selectedLevelEvent = [];
          }
        });
      }
      else {
        this.levelData = []
      }
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /*get states*/
  getRoles(stateId) {
    try {
      this.masterService.getData('active_role/', stateId).subscribe((response: any) => {
        if (response.data) {
          if (response.data.length > 0) {
            this.rolesData = response.data[0].roles;
          } else {
            this.rolesData = [];
          }
        }
        else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          this.addUserForm.get('addUserLevels').setValue([]);
          this.rolesData = [];
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  //get f() { return this.addUserForm.controls; }
  get addUserF() {
    return this.addUserForm.controls
  }
  //get f() { return this.editUserForm.controls; }
  get editUserF() {
    return this.editUserForm;
  }

  //function to check date is valid or not
  dateValidFun(event) {
    this.dateFormateValueDob = event.target.value;
    if (event.target.value == "Invalid date") {
      this.dateValid = true;
    } else if (event.target.value == "") {
      this.dateValid = false;
    }
  }
  dateValidFunDoj(event) {
    this.dateFormateValueDoj = event.target.value;
    if (event.target.value == "Invalid date") {
      this.dateValidDoj = true;
    } else if (event.target.value == "") {
      this.dateValidDoj = false;
    }
  }

  /* Adding users */
  createUser() {
    try {
      this.submitted = true;
      this.errorOrResponse = false;
      this.spinner.show();
      let addressType = "";
      if (this.dateFormateValueDob == "") {
        this.dateValid = false;
      } else if (this.dateFormateValueDob == "Invalid date") {
        this.dateValid = true;
      }
      if (this.dateFormateValueDoj == "") {
        this.dateValidDoj = false;
      } else if (this.dateFormateValueDoj == "Invalid date") {
        this.dateValidDoj = true;
      }
      addressType = CommonConstants.checkAfterAddressTypeName;
      // when chechbox is checked before adding values in permenant address
      if (this.sameAddress == false) {
        this.copyAddressCurrent();
      }
      if (this.addUserForm.value.addUserAddressDistrict == null) {
        this.addUserForm.value.addUserAddressDistrict = ""
        this.addUserForm.value.addUserAddressDistrict.id
      }
      if (this.addUserForm.value.addUserAddressState == null) {
        this.addUserForm.value.addUserAddressState = ""
      }
      if (this.addUser == false) {
        if (!this.addUserForm.value.addUserLevels['levelId']) {
          this.addUserForm.value.addUserLevels.levelId = this.addUserForm.value.addUserLevels.id;
        }
        // if (!this.addUserForm.value.addUserRoles['roleId']) {
        //   this.addUserForm.value.addUserRoles = this.editDataUser.roles.id
        // }
        if (!this.addUserForm.value.addUserDesignations['designationsId']) {
          this.addUserForm.value.addUserDesignations.designationsId = this.addUserForm.value.addUserDesignations.id;
        }
        // if (!this.addUserForm.value.addSelectCategory['grievanceTypeId']) {
        //   this.addUserForm.value.addSelectCategory['grievanceTypeId'] = this.gId;
        // }

        // if (!this.addUserForm.value.filterGrievanceNature['grievanceNatureId']) {
        //   this.addUserForm.value.filterGrievanceNature['grievanceNatureId'] = this.natureId
        // }

        if (!this.addUserForm.value.addUserCurrentDistrict['districtId']) {
          this.addUserForm.value.addUserCurrentDistrict.districtId = this.addUserForm.value.addUserCurrentDistrict.id;
        }

        if (!this.addUserForm.value.addUserCurrentDistrict['districtId']) {
          this.addUserForm.value.addUserCurrentDistrict.districtId = this.addUserForm.value.addUserCurrentDistrict.id;
        }

        this.addUserForm.value.addUserLocation = this.addUserForm.value.addUserLocation.name;
        if (this.addUserForm.value.addUserLocation == undefined) {
          this.editDataUser.userType.map(data => {
            this.addUserForm.value.addUserLocation = data.type
          })
        }

        if (this.addUserForm.value.addUserAddressDistrict != "") {
          if (!this.addUserForm.value.addUserAddressDistrict['districtId']) {
            this.addUserForm.value.addUserAddressDistrict.districtId = this.addUserForm.value.addUserAddressDistrict.id;
          }
        }
      }



      if (this.addUserForm.value.community == []) {
        this.addUserForm.value.community = ""
      }

      if (this.addUserForm.value.religion == []) {
        this.addUserForm.value.religion = ""
      }

      if (this.addUserForm.value.maritalStatus == []) {
        this.addUserForm.value.maritalStatus = ""
      }

      if (this.addUserForm.invalid) {
        this.spinner.hide();
        let target = this.el.nativeElement.querySelector('.ng-invalid');
        if (target) {
          $('html,body').animate({ scrollTop: $(target).offset().top - 20 }, 'slow');
          target.focus();
        }
        return;
      }


      if (this.sameAddress == true) {
        if (this.addUserForm.value.addUserAddressLine1 == "" && this.addUserForm.value.addUserAddressPincode == "" && this.addUserForm.value.addUserAddressState.length == 0 && this.addUserForm.value.addUserAddressDistrict.length == 0) {
          this.addUserForm.value.addUserSameAsCurrent = CommonConstants.checkAfterAddressType;
          addressType = "";
        } else {
          this.addUserForm.value.addUserSameAsCurrent = CommonConstants.checkBeforeAddressType;
          addressType = CommonConstants.checkAfterAddressTypeName;
        }
      }

      // pass the field to be add
      if (this.submitName == "Create User") {
        this.addUserForm.value.addUserTitle = this.addUserForm.value.addUserTitle.name;
        // this.addUserForm.value.addUserRoles = this.addUserForm.value.addUserRoles;
        // console.log(this.addUserForm.value.addUserRoles.roleId)
        this.addUserForm.value.addUserGender = this.addUserForm.value.addUserGender.name;
        this.addUserForm.value.addUserLocation = this.addUserForm.value.addUserLocation.name;
      }



      // if (this.editUserForm.invalid) {
      //   console.log("v6777777777")
      //   if (!this.editUserForm.value.addUserTitle['title']) {
      //     console.log("xxxx")
      //     this.editUserForm.value.addUserTitle = this.addUserForm.value.addUserTitle.name;
      //     // this.addUserForm.value.addUserTitle = this.addUserForm.value.addUserTitle.name;
      //     // this.addUserForm.value.addUserRoles = this.addUserForm.value.addUserRoles.roleId;
      //     // this.addUserForm.value.addUserGender = this.addUserForm.value.addUserGender.name;
      //     // this.addUserForm.value.addUserLocation = this.addUserForm.value.addUserLocation.name;
      //     console.log(this.editUserForm.value.addSelectCategory)
      //   }
      // }

      let apiValues = this.addUserForm.value,
        status = apiValues.addUserStatus ? 'active' : 'inactive',
        sameAsCurrentValue = apiValues.addUserSameAsCurrent ? '1' : '0',
        DOB = apiValues.addUserDOB,
        DOJ = apiValues.addUserDOJ;
      //  console.log(this.addUserForm.value)

      let gender = apiValues.addUserGender.charAt(0).toUpperCase() + apiValues.addUserGender.slice(1);
      if (apiValues.addUserPassword == undefined) {
        apiValues.addUserPassword = ""
      }

      // this.districtIdsData = []
      // if (apiValues.addUserBlockLocation == null) {
      //   apiValues.addUserDistrictLocation.map(data => {
      //     this.districtIdsData.push({ stateId: CommonConstants.stateId, districtId: data.districtId })
      //   })

      // }

      // if (apiValues.addUserDistrictLocation == null && apiValues.addUserBlockLocation == null) {
      //   this.districtIdsData.push({ stateId: CommonConstants.stateId })

      // }

      // if (apiValues.addUserDistrictLocation != null && apiValues.addUserBlockLocation != null) {
      //   apiValues.addUserBlockLocation.map(data => {
      //     this.districtIdsData.push({ stateId: CommonConstants.stateId, talukaId: data.talukaId })
      //   })

      // }


      if (apiValues.addUserEmail.includes(",") == true) {
        this.emailValue = apiValues.addUserEmail.split(",")
      }
      else {

        if (typeof apiValues.addUserEmail === 'string') {
          this.emailValue = apiValues.addUserEmail.split()
        } else {
          this.emailValue = apiValues.addUserEmail
        }
      }

      if (apiValues.addContactNo.includes(",") == true) {
        this.contactValue = apiValues.addContactNo.split(",")
      }
      else {
        if (typeof apiValues.addContactNo === 'string') {
          this.contactValue = apiValues.addContactNo.split()
        }
        else {
          this.contactValue = apiValues.addContactNo
        }

      }
      //  console.log(this.addUserForm.value)
      let data = {
        userName: apiValues.addUserName,
        password: apiValues.addUserPassword,
        title: apiValues.addUserTitle,
        firstName: apiValues.addUserFirstName,
        middleName: apiValues.addUserMiddleName,
        lastName: apiValues.addUserLastName,
        gender: gender,
        contactNumber: this.contactValue,
        designationId: apiValues.addUserDesignations.designationsId,
        emergencyContactNumber: apiValues.addEmergencyContactNo,
        email: this.emailValue,
        dateOfBirth: DOB,
        maritalStatus: apiValues.addUserMaritalStatus.name,
        levelId: apiValues.addUserLevels.levelId,
        roleId: apiValues.addUserRoles.roleId == null ? this.editDataUser.roles.id : apiValues.addUserRoles.roleId,
        aadharNumber: apiValues.addUserAdharNo,
        panNumber: apiValues.addUserPanNo,
        fathersName: apiValues.addUserFather,
        mothersName: apiValues.addUserMother,
        community: apiValues.addUserCommunity.name,
        religion: apiValues.addUserReligion.name,
        status: status,
        dateOfJoining: DOJ,
        currentAddressLine1: apiValues.addUserCurrentAddressLine1,
        currentAddressLine2: apiValues.addUserCurrentAddressLine2,
        currentStateId: apiValues.addUserCurrentState.id,
        currentDistrictId: apiValues.addUserCurrentDistrict.districtId,
        currentPinCode: apiValues.addUserCurrentPinCode,
        currentType: CommonConstants.checkBeforeAddressTypeName,
        permanentAddressLine1: apiValues.addUserAddressLine1,
        permanentAddressLine2: apiValues.addUserAddressLine2,
        permanentStateId: apiValues.addUserAddressState.id,
        permanentDistrictId: apiValues.addUserAddressDistrict.districtId,
        permanentPinCode: apiValues.addUserAddressPincode,
        permanentType: addressType,
        sameAsCurrent: sameAsCurrentValue,
        type: apiValues.addUserLocation,
        meta: this.districtIdsData,
        grievanceTypeId: this.gId.length == 0 ? this.grievanceArrayId : this.gId,
        grievanceNatureId: this.natureId.length == 0 ? this.grievanceNatureArrayId : this.natureId

      }
      //  console.log(data)

      if (this.addUser == true) {
        this.masterService.postData('user', data).subscribe((response: any) => {
          //  console.log(response)
          if (response.data) {
            this.commonHelper.toasterMessage(response.message);
            this.spinner.hide();
            this.getUsers();
            this.router.navigate(['/users'])
            this.errorOrResponse = true;
          } else {
            this.spinner.hide();
            this.errorOrResponse = true;
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        }, err => {
          this.spinner.hide();
          this.errorOrResponse = true;
        });
      } else if (this.addUser == false) {
        delete data.password;
        if (data.permanentDistrictId == undefined) {
          data.permanentDistrictId = ""
        }
        if (data.permanentStateId == undefined) {
          data.permanentStateId = ""
        }
        if (data.community == undefined) {
          data.community = ""
        }
        this.masterService.putData('user/', this.userId, data).subscribe((response: any) => {
          if (response.status) {
            this.commonHelper.toasterMessage(response.message);
            this.getUsers();
            this.spinner.hide();
            this.router.navigate(['/users'])
            this.errorOrResponse = true;
          } else {
            this.spinner.hide();
            this.errorOrResponse = true;
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        }, err => {
          this.spinner.hide();
          this.errorOrResponse = true;
        });
      }
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
    setTimeout(() => {
      this.spinner.hide();
      if (this.errorOrResponse == false) {
        //  this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, 40000)
  }



  /*get user list*/
  getUsers() {
    try {
      this.spinner.show();
      this.masterService.getAll('user').subscribe((response: any) => {
        if (response) {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.userData = response.data;
          } else {
            this.userData = [];
            this.spinner.hide();
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        } else {
          this.spinner.hide();

        }
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**get categories
  *
  * @param stateId
  */
  getCategories() {
    try {
      this.spinner.show();
      this.masterService.getAll("active_grievanceType").subscribe(
        (response: any) => {
          if (response.status) {
            this.spinner.hide();
            if (response.data.length > 0) {
              this.categories = response.data;


            } else {
              this.spinner.hide();
              this.categories = [];
            }
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError(
              CommonConstants.validationMessage
            );
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  getGrievanceNature(id) {
    //this.apiCalling('active_grievanceNature', id)
    try {
      this.spinner.show();
      this.masterService.getData('active_grievanceNature/', id).subscribe((response: any) => {
        if (response.status) {
          let newData = [];
          this.spinner.hide();
          response.data.filter(newResponse => {
            // console.log(newResponse)
            newData.push({ id: newResponse.grievanceNatureId, name: newResponse.grievanceNatureName });

          });
          if (newData.length > 0) {
            this.spinner.hide();
            this.categoriesNature = newData;
            //  console.log(this.categoriesNature)
          } else {
            this.categoriesNature = [];
          }
          this.spinner.hide();
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

  //  function for nature select
  onNatureChange(value) {
    if (value.length == 0) {
      this.addUserForm.controls['addSelectCategory'].reset();
      this.addUserForm.controls['addUserLevels'].reset();
    }
    if (value.length > 0) {
      this.addUserForm.controls['addUserLevels'].reset();
    }
    this.natureId = [];
    value.map((data) => {
      this.selectedNature = data
      this.natureId.push(data.id);
    })

    this.getLevels(this.gId, CommonConstants.stateId, this.natureId);

  }

  /**
 * categorychange
 * @param event
 */
  onAddCategoryChange(event) {
    this.gId = [];
    if (event.length > 0) {
      this.addUserForm.controls['filterGrievanceNature'].reset();
      this.addUserForm.controls['addUserLevels'].reset();
      event.map((data) => {
        this.selectedCategory = data
        this.gId.push(data.grievanceTypeId);
        this.getGrievanceNature(this.gId);
      })
      if (this.gId == 4) {
        this.getLevels(this.gId, CommonConstants.stateId, this.natureId);
        //  this.getLevels
      }


    }
    // else {
    //   this.gId = 1;
    // }
  }
}

