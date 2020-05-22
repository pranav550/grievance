import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import * as CryptoJS from "crypto-js";

import { AuthenticationService } from "../../authentication/services/authentication.service";
import { CommonConstants } from "../../../shared/constants";
import { CommonHelper } from "../../../helper/helper.component";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginOTPForm: FormGroup;
  submitted = false;
  submittedL = false;
  defaultLanguage: any;
  receipts: any;
  disposals: any;
  getMobileOTP: boolean = false;
  currentTime: any;
  timer: any = {
    min: undefined,
    sec: undefined
  }
  code: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private commonHelper: CommonHelper,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    /* Navigating to dashboard Page if the user is already login*/
    if (localStorage.getItem("token") !== null) {
      if (localStorage.getItem("name") == 'user') {
        this.router.navigate(["/dashboard"])
      } else if (localStorage.getItem('roleId') == '1') {
        this.router.navigate(['/admin-dashboard'])
      } else if (localStorage.getItem('roleId') == '2') {
        this.router.navigate(['/supervisor-dashboard']);
      } else if (localStorage.getItem('roleId') == '4') {
        this.router.navigate(['/level-dashboard']);
      } else if (localStorage.getItem('roleId') == '3') {
        this.router.navigate(['/helpdesk-dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    }
    this.loginValidations();
    this.loginViaOTPValidations();
    this.grievanceStatistics();
    this.createCaptcha();
  }

  //get f() { return this.registerForm.controls; }
  get loginF() {
    return this.loginForm.controls;
  }

  get loginVOTPF() {
    return this.loginOTPForm.controls;
  }

  /**loginValidations
   *
   */
  loginValidations() {
    this.loginForm = this.fb.group({
      userName: ["", Validators.required],
      password: ["", Validators.required],
      myRecaptcha: ["", Validators.required]
    });
  }

  /**loginValidations using OTP
  *
  */
  loginViaOTPValidations() {
    this.loginOTPForm = this.fb.group({
      mobileNo: ['', [Validators.required, Validators.pattern(CommonConstants.regexMobileNumber)]],
      mobileOTP: ['', Validators.required],
      myRecaptcha1: ["", Validators.required]
    });
  }

  /**login Function to call API
   *
   */
  login() {
    try {

      this.submitted = true;
      if (this.loginForm.invalid) {
        return;
      }

      if (this.loginForm.value.myRecaptcha != this.code) {
        this.commonHelper.toasterMessageError(
          CommonConstants.invalidCaptcha
        );
        this.createCaptcha();
        this.loginForm.get('myRecaptcha').setValue([]);
        return;
      }


      let apiData = this.loginForm.value,
        data = {
          username: apiData.userName,
          password: apiData.password
        };

      this.spinner.show();
      this.authenticationService.postData("beneficiary/login", data).subscribe(
        (response: any) => {
          if (response.status) {
            this.spinner.hide();
            this.storingValuesInLs(response);
            this.router.navigate(["/dashboard"]);
          } else {
            this.commonHelper.toasterMessageError(
              CommonConstants.validationMessage
            );
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (ex) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
   *
   * @param response
   */
  storingValuesInLs(response: any) {
    let newArrayDataOfOjbect = Object.values(response.data.menu);
    if (newArrayDataOfOjbect.length > 0) {
      localStorage.setItem("menuData", JSON.stringify(newArrayDataOfOjbect));
    }
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("mobileNo", response.data.beneficiary.mobile_number);
    localStorage.setItem("name", response.data.beneficiary.name);
    localStorage.getItem("language");
  }

  grievanceStatistics() {
    try {
      this.spinner.show();
      this.authenticationService.getGrievanceStatitics("total_grievance_yearly").subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.disposals = response.data[0].totalDisposal;
            this.receipts = response.data[0].totalReceipt;
          } else {
            this.disposals = [];
            this.receipts = [];
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (ex) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  //get OTP Function
  getOTP(mobileNo) {
    if (mobileNo.length == 10) {
      var data = {
        "phoneNo": mobileNo
      }
      this.spinner.show()
      this.getMobileOTP = true;
      localStorage.setItem("benMobile", mobileNo);
      this.authenticationService.postData('beneficiary/generateLoginOtp', data).subscribe((response: any) => {
        this.spinner.hide();
        this.currentTime = new Date().getTime() + 3 * 60000
        this.setTKXTime(this.currentTime, this.timer);
      }, error => {
        this.spinner.hide();
        this.commonHelper.toasterMessageError(
          error.error.message
        );
        this.getMobileOTP = false;
      })
    } else {
      this.getMobileOTP = false;
    }
  }

  /* Login via OTP*/
  loginViaOTP(form) {
    var mobileotp = form.value.mobileOTP;
    var data = {
      "otp": mobileotp,
      "mobileNo": localStorage.getItem("benMobile")
    }
    this.spinner.show()
    try {
      this.authenticationService.postData('beneficiary/loginWithOtp', data).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.message == "Your otp has expired.") {
            this.commonHelper.toasterMessageError(
              response.message
            );
          } else {
            this.storingValuesInLs(response);
            this.router.navigate(["/dashboard"]);
          }
        } else {
          this.commonHelper.toasterMessageError(
            CommonConstants.validationMessage
          );
        }
      },
        error => {
          this.spinner.hide();
        }
      );
    } catch (ex) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /*Resend OTP*/
  resendOTP(e) {
    this.currentTime = new Date().getTime() + 3 * 60000
    this.setTKXTime(this.currentTime, this.timer);
  }

  /* Setting TKX Timer */
  setTKXTime(currentTime, timer) {
    let x = setInterval(function () {
      let countDownDate: any = new Date(currentTime)
      // Get todays date and time
      let now: any = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      if (timer.min < 10) {
        timer.min = '0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      } else {
        timer.min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      }

      if (timer.sec < 10) {
        timer.sec = '0' + Math.floor((distance % (1000 * 60)) / 1000);
      } else {
        timer.sec = Math.floor((distance % (1000 * 60)) / 1000);
      }

      // When Time Ended showing as 00:00:00:00
      if (distance < 0) {
        clearInterval(x);
        timer.min = 0 + '0';
        timer.sec = 0 + '0';
      }
    }, 0)
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
