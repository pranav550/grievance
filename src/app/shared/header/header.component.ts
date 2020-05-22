import { MasterService } from './../../components/master/services/master-service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonConstants } from '../../shared/constants'
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private translateService: TranslateService,
    public dataService: DataService,
    private router: Router,
    private masterService: MasterService,
    private fb: FormBuilder) { }

  languagesData: any;
  defaultLanguage: any;
  routes: any;
  accountRoutes: any;
  reportRoutes: any;
  languageValue: any;
  languageName: string;
  headerForm: FormGroup;
  adminMenu: any;
  isCollapsed = false;
  userName: any;
  resetPassword: any;

  ngOnInit() {
    this.callingMethods();
    this.userName = localStorage.getItem('name')
    this.resetPassword = localStorage.getItem('roleId')

  }

  /**Calling what ever the functions need while page load
   * 
   */
  callingMethods() {
    this.adminMenu = JSON.parse(localStorage.getItem('menuData'));
    this.validationsForLanguage();
    this.languages(localStorage.getItem('language'));
  }

  /**validationsForLanguage
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


  /**Languages Data
  * 
  */
  languages(value: any) {
    this.languagesData = [{ id: 1, name: 'English', value: 'en' }, { id: 2, name: 'हिन्दी', value: 'hn' }]

  }

  /**languageChange
   * 
   * @param event 
   */
  languageChange(event: any) {
    this.languageValue = event.value;
    this.defaultLanguage = event.value;
    this.dataService.changeMessage(event.name)
    localStorage.setItem('language', this.defaultLanguage);
    this.translateService.use(event.value);
    this.masterService.resp1.next(event.value);
  }

  /**Admin Logout
   * 
   */
  logout() {
    this.router.navigateByUrl('/login');
    localStorage.clear();
    localStorage.setItem('language', this.defaultLanguage);
  }

  /**
   * Disable Menu Items
   * 
   * @param menuItems
   */
  disableMenuItems(menuItems) {
    if (menuItems == 'states' || menuItems == 'districts'
      || menuItems == 'talukas' || menuItems == 'villages'
      || menuItems == 'category-categories' || menuItems == 'category-natures'
      || menuItems == 'institutions' || menuItems == 'designations') {
      return false;
    }
    else {
      return true;
    }
  }
}

