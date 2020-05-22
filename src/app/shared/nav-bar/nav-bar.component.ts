import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { CommonConstants } from '../../shared/constants'
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../service/data.service'


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  languagesData: any;
  headerForm: FormGroup;
  languageValue: any;
  defaultLanguage: any;
  routeUrl: any;
  languageName = 'English';
  isCollapsed = false;
  constructor(private router: Router,
    private fb: FormBuilder,
    private translateService: TranslateService, public dataService: DataService) {
    translateService.setDefaultLang('en');
  }

  ngOnInit() {
    this.routeUrl = this.router.url;
    this.languages(localStorage.getItem('language'));
    this.validationsForLanguage();
  }
  /**Validations and setting the name for formcontrol
   * 
   */
  validationsForLanguage() {
    this.dataService.currentMessage.subscribe(message => this.languageName = message)
    this.headerForm = this.fb.group({
      languageName: [this.languageName, Validators.required]
    });
    if (this.languageName == 'English') {
      this.defaultLanguage = CommonConstants.englishLanguage;
    } else if (this.languageName == 'हिन्दी') {
      this.defaultLanguage = CommonConstants.HindiLanguage;
    }
    localStorage.setItem('language', this.defaultLanguage);


  }

  languageChange(event: any) {
    this.languageValue = event.value;
    this.defaultLanguage = event.value
    this.dataService.changeMessage(event.name)
    localStorage.setItem('language', this.defaultLanguage);
    this.translateService.use(event.value);

  }
  /**Languages Data
   * 
   */
  languages(value) {
    this.languagesData = [{ id: 1, name: 'English', value: 'en' }, { id: 2, name: 'हिन्दी', value: 'hn' }]
  }

  /**
   * logout
   */
  logout() {
    this.router.navigateByUrl('/login');
    localStorage.clear();
    localStorage.setItem('language', this.defaultLanguage);
  }
}
