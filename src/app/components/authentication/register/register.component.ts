import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';
import { AuthenticationService } from '../../authentication/services/authentication.service'
import { CommonConstants } from '../../../shared/constants'
import { CommonHelper } from '../../../helper/helper.component';
import { MasterService } from '../../master/services/master-service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  styles: [`
  #captcha{
    border: 1px solid #cccccc;
    padding: 0px 15px;
    margin-bottom: 10px;
  }

  .captcha-box{
    padding-top:22px;
  }

  .pointer{
    cursor:pointer;
    margin-right:5px;
    vertical-align: bottom;
  }
  `],
  providers: [AuthenticationService, CommonHelper, MasterService, NgxSpinnerService]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  verifyOtpForm: FormGroup;
  submitted: boolean = false;
  otpSubmitted: boolean = false;
  isOTPForm: boolean = false;
  districtsData: any;
  statesData: any;
  countries: any;
  genderData: any;
  defaultStateValue: any;
  defaultDistrictValue: any;
  beneficaryId: number;
  ValidationsMessage: string;
  isUserNameExists: boolean;
  isUserNameShow: boolean;
  birthAge: any;
  isUserAvailabityShown: boolean = false;
  age: number;
  dob: any;
  relationStatusData: any;
  showPassword: string = CommonConstants.passwordDefaultValue;
  toastOptions: ToastOptions = {
    title: "",
    msg: "",
    showClose: true,
    timeout: CommonConstants.defaultTime,
    theme: 'default'
  };
  code: any;

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private toastyConfig: ToastyConfig,
    private toastyService: ToastyService,
    private fb: FormBuilder,
    private el: ElementRef,
    private commonHelper: CommonHelper,
    private masterService: MasterService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getStates();
    this.registerFormValidations();
    this.genderData = CommonConstants.gender;
    this.countries = CommonConstants.countries;
    setTimeout(() => {
      this.createCaptcha();
    }, 1000);
    this.registerForm.controls['registerFormState'].disable();
    this.relationStatusData = CommonConstants.relationStatus;

  }

  /*register Form Validations*/
  registerFormValidations() {
    this.registerForm = this.fb.group({
      registerName: ['', [Validators.required, Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters), Validators.maxLength(150)]],
      registerDateOfBirth: [''],
      registerUserName: ['', [Validators.maxLength(150)]],
      registerGender: [[], Validators.required],
      registerFormAddress: ['', Validators.required],
      registerFormCountry: [CommonConstants.defaultCountry],
      registerFormState: [[], Validators.required],
      registerFormDistrict: [[], Validators.required],
      registerFormPincode: ['', Validators.pattern(CommonConstants.regexPinCode)],
      registerFormPhoneNumber: [''],
      registerFormAge: [''],
      registerFormMobileNumber: ['', [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber)]],
      registerFormEmail: ['', [Validators.pattern(CommonConstants.emailRegex)]],
      registerFormPassword: ['', [Validators.pattern(CommonConstants.passwordRegex)]],
      registerFormConfirmPassword: [''],
      myRecaptcha: ['', Validators.required],
      rgComplainantFatherName: ['', [Validators.required, Validators.maxLength(CommonConstants.maxLength150), Validators.pattern(CommonConstants.regexNotAllowSpecialCharacters)]],
      filterRelationName: [[], Validators.required]
    });
  }
  /*convert Date To Age*/
  getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    this.age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      this.age--;
    }
    return this.age;

  }
  /*convert Age To Date*/
  getDOB(event) {
    var d = new Date();
    d.setDate(d.getDate() - (event * 365 + Math.floor(event / 4)));
    this.dob = d.toLocaleString().slice(0, 9)
  }


  /*get states*/
  getStates() {
    try {
      this.spinner.show();
      this.masterService.getAll('active_states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.statesData = response.data;
            let selectedValue: any;
            response.data.forEach(element => {
              if (element.id == CommonConstants.stateId) {
                selectedValue = element;
              }
            });
            this.defaultStateValue = selectedValue;
            this.getDistricts(CommonConstants.stateId);
            this.spinner.hide();
          } else {
            this.statesData = [];
            this.defaultDistrictValue = [];
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /*get Districts*/
  getDistricts(stateId: number) {
    try {
      this.spinner.show();
      this.masterService.getData('active_districts/', stateId).subscribe((response: any) => {
        if (response) {
          if (response.data[0].districts.length > 0) {
            this.spinner.hide();
            this.registerForm.get('registerFormDistrict').setValue([]);
            this.districtsData = response.data[0].districts;
          } else {
            this.districtsData = [];
            this.registerForm.get('registerFormDistrict').setValue([]);
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /** on state change
   * 
   * @param event 
   */
  onStateChange(event) {
    if (event) {
      this.getDistricts(event.id);
    }
  }

  //get f() { return this.registerForm.controls; }
  get registerF() {
    return this.registerForm.controls;
  }

  /* registerUserName validations*/
  get registerUserName() {
    return this.registerForm.get('registerUserName');
  }

  /* mobile Number validations*/
  get registerFormMobileNumber() {
    return this.registerForm.get('registerFormMobileNumber');
  }

  /* registerFormPincode validations*/
  get registerFormPincode() {
    return this.registerForm.get('registerFormPincode');
  }

  /* registerFormPincode validations*/
  get registerGender() {
    return this.registerForm.get('registerGender');
  }

  /* rgComplainantFatherName validations*/
  get rgComplainantFatherName() {
    return this.registerForm.get('rgComplainantFatherName');
  }

  /* filterRelationName validations*/
  get filterRelationName() {
    return this.registerForm.get('filterRelationName');
  }

  /* registerFormDateofBirth validations*/
  get registerDateOfBirth() {
    return this.registerForm.get('registerDateOfBirth');
  }

  /**registerName
   * 
   */
  get registerName() {
    return this.registerForm.get('registerName');
  }

  /**registerFormPassword
   * 
   */
  get registerFormPassword() {
    return this.registerForm.get('registerFormPassword');
  }

  /**registerFormConfirmPassword
   * 
   */
  get registerFormConfirmPassword() {
    return this.registerForm.get('registerFormConfirmPassword');
  }

  /**OTPNewF
   * 
   */
  get OTPNewF() {
    return this.verifyOtpForm.controls;
  }

  /**
  * Password show 
  * @param value 
  */
  passwordShow(value: string) {
    this.showPassword = value === 'show' ? 'text' : 'password';
  }



  /*register Function*/

  registerFunction() {
    try {
      this.submitted = true;
      if (this.registerForm.invalid) {
        let target = this.el.nativeElement.querySelector('.ng-invalid');
        if (target) {
          $('html,body').animate({ scrollTop: $(target).offset().top - 20 }, 'slow');
          target.focus();
        }
        return;
      }
      if (this.registerForm.value.registerFormPassword !== this.registerForm.value.registerFormConfirmPassword) {
        return;
      }

      if (this.registerForm.value.myRecaptcha != this.code) {
        this.commonHelper.toasterMessageError(
          CommonConstants.invalidCaptcha
        );
        this.createCaptcha();
        this.registerForm.get('myRecaptcha').setValue([]);
        return;
      }

      let genderMap = { 'male': 1, 'female': 2, 'transgender': 3 }
      let apiData = this.registerForm.value;

      let data = {
        "name": apiData.registerName,
        "username": apiData.registerUserName,
        "dob": apiData.registerDateOfBirth == "" ? this.dateFormat(this.dob) : this.dateFormat(apiData.registerDateOfBirth),
        "gender": genderMap[apiData.registerGender.name.toLowerCase()],
        "address": apiData.registerFormAddress,
        "country": CommonConstants.defaultCountryCode,
        "stateId": CommonConstants.stateId,
        "districtId": apiData.registerFormDistrict.districtId,
        "mobileNumber": apiData.registerFormMobileNumber,
        "email": apiData.registerFormEmail,
        "password": apiData.registerFormPassword,
        "confirmPassword": apiData.registerFormConfirmPassword,
        "pinCode": apiData.registerFormPincode,
        "fatherOrHusbandName": apiData.rgComplainantFatherName,
        "relation": apiData.filterRelationName.name.toLowerCase()
      }

      this.apiCallingForPostData('register', data, 'userRegister');
    } catch (ex) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  dateFormat(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  otpValidations() {
    this.verifyOtpForm = this.fb.group({
      otpPageForMobileNumber: [this.registerForm.value.registerFormMobileNumber],
      mobileOTP: ['', [Validators.required, Validators.pattern(CommonConstants.MobileOTP)]]
    });
  }

  /**resend OTP function
   * 
   */
  resendOTP() {
    try {
      let data = {
        beneficiaryId: this.beneficaryId
      };
      this.apiCallingForPostData('resend_otp', data, 'beneficiaryresendotp');
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**OTP submit
   * 
   */
  otpSubmit() {
    this.otpSubmitted = true;
    if (this.verifyOtpForm.invalid) {
      return;
    }
    let data = {
      otp: this.verifyOtpForm.value.mobileOTP,
      beneficiaryId: this.beneficaryId
    };
    this.spinner.show();
    this.apiCallingForPostData('verify_otp', data, 'beneficiaryotp');
  }

  /**
   * checkUserNameAvailabilty
   */
  checkUserNameAvailabilty() {
    if (this.registerForm.value.registerUserName) {
      this.apiCallingForGetData("check_username/" + this.registerForm.value.registerUserName);
    }
  }

  /**
   * 
   */
  userNameEnter(event: any) {
    this.isUserAvailabityShown = event ? true : false
    this.isUserNameShow = false;
  }


  /**apiCallingForData
   * 
   * @param url 
   */
  apiCallingForGetData(url) {
    try {
      this.spinner.show();
      this.masterService.getAll('beneficiary/' + url).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          this.isUserNameExists = true;
          this.isUserNameShow = true;
          this.ValidationsMessage = response.message;
        } else {
          this.spinner.hide();
        }
      }, error => {
        if (error.error.status === 400) {
          this.isUserNameShow = true;
          this.isUserNameExists = false;
          this.ValidationsMessage = error.error.message
        }
        this.spinner.hide();
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**apiCalling for post data
   * 
   * @param url 
   * @param data 
   */
  apiCallingForPostData(url: any, data: any, formName: string) {
    this.spinner.show();
    this.masterService.postData("beneficiary/" + url, data).subscribe((response: any) => {
      if (response.status) {
        this.spinner.hide();
        this.commonHelper.toasterMessage(response.message);
        if (formName === 'userRegister') {
          this.beneficaryId = response.data.beneficiaryId;
          this.isOTPForm = true;
          this.otpValidations();
        } else if (formName === 'beneficiaryotp') {
          this.router.navigateByUrl('/login');
        } else {
        }
      } else {
        this.spinner.hide();

      }
    }, error => {
      /* Handling 422 Error Status Manually in this case  
      ** As we are not getting the token before login in
      to our platform 
      */
      this.spinner.hide();
      if (error.status === 422) {
        if (error.error.errors.mobileNumber) {
          this.toastOptions.msg = error.error.errors.mobileNumber[0];
        }
        if (error.error.errors.username) {
          this.toastOptions.msg = error.error.errors.username[0];
        }
        if (error.error.errors.userName) {
          this.toastOptions.msg = error.error.errors.userName[0];
        }
        if (error.error.errors.name) {
          this.toastOptions.msg = error.error.errors.name[0];
        }
        if (error.error.errors.otp) {
          this.toastOptions.msg = error.error.errors.otp[0];
        }
        this.toastyService.error(this.toastOptions);
      }

    });
  }

  /**
 * Create Captcha
 */
  createCaptcha() {
    //clear the contents of captcha div first
    if (document.getElementById("captcha")) {
      document.getElementById("captcha").innerHTML = "";

      let charsArray =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let lengthOtp = 6;
      let captcha = [];
      for (let i = 0; i < lengthOtp; i++) {
        //below code will not allow Repetition of Characters
        var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
        if (captcha.indexOf(charsArray[index]) == -1)
          captcha.push(charsArray[index]);
        else i--;
      }
      let canv = document.createElement("canvas");
      canv.id = "captcha";
      canv.width = 100;
      canv.height = 50;
      let ctx = canv.getContext("2d");
      ctx.font = "25px Georgia";
      ctx.strokeText(captcha.join(""), 0, 30);
      //storing captcha so that can validate you can save it somewhere else according to your specific requirements
      this.code = captcha.join("");
      document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
    }


  }

  /**
   * 
   * @param event 
   */
  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }
}
