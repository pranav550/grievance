import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  urlNameExists: Boolean;
  constructor() { }

  ngOnInit() {
    // let paths = ['login', 'register', 'forgot-password'];
    // if (paths.includes(window.location.href.split('/')[3])) {
    //   this.urlNameExists = true;
    // } else {
    //   this.urlNameExists = false;
    // }
  }

}
