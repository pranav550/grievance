import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
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

export class AdminLoginComponent implements OnInit {
  userLoginForm: FormGroup;
  submitted = false;
  defaultLanguage: any;
  code: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private commonHelper: CommonHelper,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loginValidations();
    this.createCaptcha();
  }

  //get f() { return this.registerForm.controls; }
  get loginF() {
    return this.userLoginForm.controls;
  }

  /**loginValidations
   * 
   */
  loginValidations() {
    this.userLoginForm = this.fb.group({
      emailAddress: ['', Validators.required],
      password: ['', Validators.required],
      myRecaptcha: ['', Validators.required]
    });
  }

  /**login Function to call API
   * 
   */
  login() {
    try {
      this.submitted = true;
      if (this.userLoginForm.invalid) {
        return;
      }
      if (this.userLoginForm.value.myRecaptcha != this.code) {
        this.commonHelper.toasterMessageError(
          CommonConstants.invalidCaptcha
        );
        this.createCaptcha();
        this.userLoginForm.get('myRecaptcha').setValue([]);
        return;
      }
      let apiData = this.userLoginForm.value,
        data = {
          username: apiData.emailAddress,
          password: apiData.password
        }
      this.spinner.show();
      this.authenticationService.postData('login', data).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          //Redirecting to dashboard based on Dashboard-Role
          if (response.data.user.roleId == 1) {
            this.router.navigate(['/admin-dashboard']);
          } else if (response.data.user.roleId == 2) {
            this.router.navigate(['/supervisor-dashboard']);
          } else if (response.data.user.roleId == 3) {
            this.router.navigate(['/helpdesk-dashboard'])
          } else {
            this.router.navigate(['/level-dashboard']);
          }

          this.storingValuesInLS(response);
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (ex) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**storing values in localstorage 
   * 
   * @param response 
   */
  storingValuesInLS(response: any) {
    let newArrayDataOfOjbect = Object.values(response.data.menu);
    localStorage.setItem('levelId', response.data.user.levelId);
    if (newArrayDataOfOjbect.length > 0) {
      localStorage.setItem('menuData', JSON.stringify(newArrayDataOfOjbect));
    }
    localStorage.setItem("name", response.data.user.name);
    localStorage.setItem("roleId", response.data.user.roleId);
    localStorage.setItem('token', response.data.access_token);
    localStorage.getItem('language');
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

