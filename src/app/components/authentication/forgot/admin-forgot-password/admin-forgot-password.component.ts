import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-forgot-password',
  templateUrl: './admin-forgot-password.component.html',
  styleUrls: ['./admin-forgot-password.component.scss']
})
export class AdminForgotPasswordComponent implements OnInit {
  isConfirmPasswordExists: boolean;
  constructor() { }

  ngOnInit() {
  }

}
