import { DataService } from './../../../shared/service/data.service';
import { CommonHelper } from 'src/app/helper/helper.component';
import { AuthenticationService } from './../services/authentication.service';
import { CommonConstants } from 'src/app/shared/constants';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [AuthenticationService, CommonHelper]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  showPassword: string = CommonConstants.passwordDefaultValue;
  submitted = false;
  defaultLanguage = CommonConstants.englishLanguage;

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private commonHelper: CommonHelper,
    public dataService: DataService,
    private router: Router) { }

  ngOnInit() {
    this.formValidators();
  }

  //passworsd Validators
  formValidators() {
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(CommonConstants.passwordRegex)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(CommonConstants.passwordRegex)]],

    });
  }



  // validatinon Check
  get resetPasswordF() {
    return this.resetPasswordForm.controls;
  }

  // password Check
  passwordShow(value: string) {
    this.showPassword = value === 'show' ? 'text' : 'password';
  }


  /** password confirm function
   *
   */
  resetPassword() {
    try {
      this.submitted = true;
      if (this.resetPasswordForm.invalid) {
        return;
      }
      if (this.resetPasswordForm.value.newPassword !== this.resetPasswordForm.value.confirmPassword) {
        return;
      }

      let apiData = this.resetPasswordForm.value,
        data = {
          currentPassword: apiData.currentPassword,
          newPassword: apiData.newPassword,
          confirmPassword: apiData.confirmPassword
        }
      this.spinner.show();
      this.authenticationService.postData('user/reset_password', data).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          this.router.navigateByUrl('/login');
          localStorage.clear();
          localStorage.setItem('language', JSON.stringify(this.defaultLanguage));
        }
      }, error => {
        this.spinner.hide();
        if (error.status === 422) {

          // Error Message for passing wrong OTP
          // if (error.error.errors.error_message) {

          //   this.commonHelper.toasterMessageError(error.error.errors.error_message);
          // }
        }
      });
    } catch (exc) {
      this.spinner.hide();
    }
  }

}
