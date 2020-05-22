import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit {
  isDisplay: boolean = false;
  isValid: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  selectForm1() {
    console.log("ipd")
    if (this.isValid = true) {
      document.getElementById('close').click();
      this.router.navigate(['/ipd-feedback']);
    }
  }
  selectForm2() {
    console.log("opd")
    if (this.isValid = true) {
      document.getElementById('close').click();
      this.router.navigate(['/opd-feedback']);
    }
  }

  redirect() {
    if (this.isValid == false) {
      this.router.navigate(['/dashboard']);
    }

  }


}
