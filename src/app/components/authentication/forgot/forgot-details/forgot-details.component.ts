import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { CommonConstants } from '../../../../../app/shared/constants'
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonHelper } from '../../../../helper/helper.component';
import { Router } from '@angular/router';
// import { setTimeout } from 'timers';

@Component({
  selector: 'app-forgot-details',
  templateUrl: './forgot-details.component.html',
  styleUrls: ['./forgot-details.component.scss'],
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
  providers: [AuthenticationService, CommonHelper]
})
export class ForgotDetailsComponent implements OnInit {
  @Input() mobileNumber: boolean;
  @Input() emailAddress: boolean;
  @Input() userName: boolean;
  @Input() newPassword: boolean;
  @Input() confirmPassword: boolean
  @Input() OTP: boolean;
  @Input() isCaptchaRequired: boolean;
  @Input() heading: string

  @Input() code: any;
  // @Input() props: { mobileNumber: number; emailAddress: any; userName: any; OTP: number; newPassword: any; confirmPassword: any };

  forgotPasswordForm: FormGroup;
  confirmForgotPasswordForm: FormGroup;
  showPassword: string = CommonConstants.passwordDefaultValue;
  submitted = false;
  confirmPwdSubmitted = false;
  isConfirmPasswordExists = false;
  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private commonHelper: CommonHelper,
    private router: Router) { }
  ngOnInit() {
    this.formValidators();
    setTimeout(() => {
      this.createCaptcha();
    }, 1000);
  }

  formValidators() {
    if (this.router.url === '/forgot-username') {
      this.forgotPasswordForm = this.fb.group({
        forgotEmail: ['', [Validators.pattern(CommonConstants.emailRegex)]],
        mobileNumber: ['', [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber)]],
        myRecaptcha: ["", Validators.required]
      });
    } else {
      this.forgotPasswordForm = this.fb.group({
        forgotEmail: ['', [Validators.pattern(CommonConstants.emailRegex)]],
        username: ['', []],
        mobileNumber: ['', [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber)]],
        myRecaptcha: ["", Validators.required]
      });
    }
  }

  get forgotPasswordF() {
    return this.forgotPasswordForm.controls;
  }

  get forgotPasswordNewF() {
    return this.confirmForgotPasswordForm.controls;
  }

  forgotPassword() {
    this.submitted = true;
    try {
      if (this.forgotPasswordForm.invalid) {
        return;
      }

      if (this.forgotPasswordForm.value.myRecaptcha != this.code) {
        this.commonHelper.toasterMessageError(
          CommonConstants.invalidCaptcha
        );
        this.createCaptcha();
        this.forgotPasswordForm.get('myRecaptcha').setValue([]);
        return;
      }

      let apiData = this.forgotPasswordForm.value;
      let data, url;
      if (this.router.url === '/forgot-username') {
        data = {
          mobile: apiData.mobileNumber,
          email: apiData.forgotEmail
        }
        url = "forgot_username"
      } else {
        data = {
          email: apiData.forgotEmail,
          mobile: apiData.mobileNumber,
          username: apiData.username
        }
        url = "forgot_password_otp"
      }


      this.spinner.show();

      this.authenticationService.postData('beneficiary/' + url, data).subscribe((response: any) => {
        if (response.status) {
          localStorage.setItem("mobileNo", apiData.mobileNumber);
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          if (this.router.url === '/forgot-password') {
            this.isConfirmPasswordExists = true;
            this.confirmPasswordValidations(apiData.username);
          } else {
            this.router.navigateByUrl('/login');
          }
        }
      }, error => {
        this.spinner.hide();
        if (error.status === 422) {
          // Error Message for Wrong UserName
          if (error.error.errors.username) {
            this.commonHelper.toasterMessageError(error.error.errors.username[0]);
          }
          // Error Messsage for Wrong Mobile
          if (error.error.errors.mobile) {
            this.commonHelper.toasterMessageError(error.error.errors.mobile[0]);
          }
          // Err
          if (error.error.errors.email) {
            this.commonHelper.toasterMessageError(error.error.errors.email[0]);
          }
        }
      });
    } catch (exc) {

    }
  }
  /** validations for confirm password modal
   * 
   */
  confirmPasswordValidations(username) {
    this.confirmForgotPasswordForm = this.fb.group({
      confirmPasswordusername: username,
      newPassword: ['', [Validators.required, Validators.pattern(CommonConstants.passwordRegex)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(CommonConstants.passwordRegex)]],
      forgotPasswordOTP: ['', [Validators.required, Validators.pattern(CommonConstants.regexPinCode)]]
    });
  }

  /**
 * Password show 
 * @param value 
 */
  passwordShow(value: string) {
    this.showPassword = value === 'show' ? 'text' : 'password';
  }


  /** password confirm function
   *
   */
  passwordConfirmation() {
    try {
      this.confirmPwdSubmitted = true;
      if (this.confirmForgotPasswordForm.invalid) {
        return;
      }
      if (this.confirmForgotPasswordForm.value.newPassword !== this.confirmForgotPasswordForm.value.confirmPassword) {
        return;
      }

      let apiData = this.confirmForgotPasswordForm.value,
        data = {
          mobileNo: localStorage.getItem("mobileNo"),
          password: apiData.newPassword,
          confirmPassword: apiData.confirmPassword,
          mobileOtp: apiData.forgotPasswordOTP
        }
      this.spinner.show();
      this.authenticationService.postData('beneficiary/forgot_password', data).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          this.router.navigateByUrl('/login');
        }
      }, error => {
        this.spinner.hide();
        if (error.status === 422) {
          // Error Message for passing wrong OTP
          if (error.error.errors.mobileOtp) {
            this.commonHelper.toasterMessageError(error.error.errors.mobileOtp[0]);
          }
        }
      });
    } catch (exc) {
      this.spinner.hide();
    }
  }

  /**
 * Create Captcha
 */
  createCaptcha() {
    //clear the contents of captcha div first 
    document.getElementById('captcha').innerHTML = "";

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
