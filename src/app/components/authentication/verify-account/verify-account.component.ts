import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from "@angular/router";
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { CommonHelper } from '../../../helper/helper.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonConstants } from '../../../shared/constants'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
  providers: [AuthenticationService, CommonHelper, NgxSpinnerService]
})
export class VerifyAccountComponent implements OnInit {
  apiCode: any;
  responseMessage: boolean = false;
  responseNewMessage: boolean = false;
  defaultValue: boolean = true;
  submitted = false;
  accountExists: boolean = false;
  registeringUserForm: FormGroup;
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.apiCode = this.router.url.split('/')[2];
    this.verifyAccount(this.apiCode);
  }

  registerValidators() {
    this.registeringUserForm = this.fb.group({
      createUserName: ['', Validators.required],
      createPassword: ['', [Validators.required, Validators.pattern(CommonConstants.passwordRegex)]],
      myRecaptcha: ['', Validators.required]
    });
  }



  /**
   * check user name exists
   * @param event 
   * 
   */
  checkUserNameExists(event: any) {
    try {
      this.functionCalling(event);
    } catch (exc) {
      this.spinner.hide();
    }
  }

  functionCalling(event) {
    setTimeout(() => {
      if (event) {
        this.authenticationService.getData('beneficiary/check_username/', event).subscribe((response: any) => {
          if (response.status) {
            this.responseMessage = true;
            this.defaultValue = false;
            this.responseNewMessage = false;
          }
        }, error => {
          if (error) {
            this.responseNewMessage = true;
            this.responseMessage = false;
            this.defaultValue = false;
          }
        });
      } else {
        this.spinner.hide();
      }
    }, 3000)
  }

  verifyAccount(code) {
    try {
      this.spinner.show();
      this.authenticationService.getData('beneficiary/verify_account/', code).subscribe((response: any) => {
        if (response.status) {
          this.accountExists = true;
          this.commonHelper.toasterMessage(response.message);
          this.spinner.hide();
          this.registerValidators();
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
  //get f() { return this.registerForm.controls; }
  get userRegisterF() {
    return this.registeringUserForm.controls;
  }

  registerDetails() {
    try {
      this.submitted = true;
      if (this.registeringUserForm.invalid) {
        return;
      }
      if (!this.responseMessage) {
        return;
      }
      let apiData = this.registeringUserForm.value;
      let data = {
        username: apiData.createUserName,
        password: apiData.createPassword,
        code: this.apiCode
      }
      this.spinner.show();
      this.authenticationService.postData('beneficiary/register_user', data).subscribe((response: any) => {

        if (response.status) {
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          this.router.navigate(['/dashboard']);
        } else if (response.status === 422) {
          this.spinner.hide();
        }
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
}
