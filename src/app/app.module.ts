import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { ToastyModule } from 'ng2-toasty';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppRoutingModule } from './app-routing.module';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileSelectDirective, FileUploadModule } from 'ng2-file-upload';
import { ImagePreview } from './components/level/level-dashboard/image-preview.directive';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/authentication/register/register.component'
import { LoginComponent } from './components/authentication/login/login.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { MyHttpInterceptor } from '../app/my-http-interceptor';
import { StatesComponent } from './components/master/states/states.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DistrictsComponent } from './components/master/districts/districts.component';
import { TalukaSubDistrictsComponent } from './components/master/taluka-sub-districts/taluka-sub-districts.component';
import { VillagesComponent } from './components/master/villages/villages.component';
import { UserComponent } from './components/master/account-user/user.component';
import { RoleComponent } from './components/master/role/role.component';
import { HospitalComponent } from './components/master/hospital/hospital.component';
import { CategoryComponent } from './components/master/category/category.component';
import { GrievanceNatureComponent } from './components/master/grievance-nature/grievance-nature.component';
import { InstitutionComponent } from './components/master/institution/institution.component';
import { DesignationComponent } from './components/master/designation/designation.component';
import { LevelComponent } from './components/master/level/level.component';
import { VerifyAccountComponent } from './components/authentication/verify-account/verify-account.component';
import { CommonConstants } from './shared/constants';
import { GrievanceDashboardComponent } from './components/grievance-web-portal/grievance-dashboard/grievance-dashboard.component';
import { PrivilegeComponent } from './components/master/privilege/privilege.component';
import { ForgotDetailsComponent } from './components/authentication/forgot/forgot-details/forgot-details.component';
import { ForgotPasswordComponent } from './components/authentication/forgot/forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from './components/authentication/forgot/forgot-username/forgot-username.component';
import { AdminLoginComponent } from './components/authentication/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/dashboards/admin-dashboard/admin-dashboard.component';
import { BeneficaryDashboardComponent } from './components/dashboards/beneficary-dashboard/beneficary-dashboard.component';
import { DataService } from './shared/service/data.service';
import { GrievanceRegisterComponent } from './components/grievance-web-portal/grievance-register/grievance-register.component';
import { BlockWiseReportComponent } from './components/reports/block-wise-report/block-wise-report.component';
import { ComplaintsSummaryReportsComponent } from './components/reports/complaints-summary-reports/complaints-summary-reports.component';
import { ComplaintTypeReportsComponent } from './components/reports/complaint-type-reports/complaint-type-reports.component';
import { DistrictWiseReportsComponent } from './components/reports/district-wise-reports/district-wise-reports.component';
import { MonthWiseReportsComponent } from './components/reports/month-wise-reports/month-wise-reports.component';
import { NatureComplaintReportsComponent } from './components/reports/nature-complaint-reports/nature-complaint-reports.component';
import { AddUserMasterComponent } from './components/master/add-user-master/add-user-master.component';
import { NumberOnlyDirective } from './helper/number.directive';
import { AutofocusDirective } from './shared/autofocus/autofocus.directive';
import { EscalationMatrixComponent } from './components/master/escalation-matrix/escalation-matrix.component';
// import { GrievanceHistoryComponent } from './components/grievance-web-portal/grievance-history/grievance-history.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { HeaderComponent } from './shared/header/header.component';
import { OpdFeedbackFormComponent } from './components/grievance-feedback-form/opd-feedback-form/opd-feedback-form.component';
import { IpdFeedbackFormComponent } from './components/grievance-feedback-form/ipd-feedback-form/ipd-feedback-form.component';
import { SupervisorDashboardComponent } from './components/supervisor/supervisor-dashboard/supervisor-dashboard.component';
import { GrievanceDetailsComponent } from './components/supervisor/grievance-details/grievance-details.component';
import { LevelDashboardComponent } from './components/level/level-dashboard/level-dashboard.component';
import { DailyTransactionsComponent } from './components/level/daily-transactions/daily-transactions.component';
import { RealTimeDashboardComponent } from './components/real-time-dashboard/real-time-dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ReportedGrievancesComponent } from './components/level/reported-grievances/reported-grievances.component';
import { ForwardedGrievancesComponent } from './components/level/forwarded-grievances/forwarded-grievances.component';
import { GrievanceDetailsPopupComponent } from './shared/grievance-details-popup/grievance-details-popup.component';
import { GrievanceDetailsService } from './shared/grievance-details-popup/grievance-details.service';
import { GrievanceTimeLineDetailsComponent } from './shared/grievance-time-line-details/grievance-time-line-details.component'
import { GrievanceViewService } from './shared/grievance-time-line-details/grievance-time-line-details.service';
import { FeedbackModalComponent } from './shared/feedback-modal/feedback-modal.component'
import { FeedbackModalService } from './shared/feedback-modal/feedback-modal.service';
import { FeedbackRatingPipe } from './shared/pipes/feedback-rating.pipe';
import { HelpdeskDashboardComponent } from './components/dashboards/helpdesk-dashboard/helpdesk-dashboard.component';
import { GrievanceAddComponent } from './components/grievance-web-portal/grievance-add/grievance-add.component';
import { AdminForgotDetailsComponent } from './components/authentication/forgot/admin-forgot-details/admin-forgot-details.component';
import { AdminForgotPasswordComponent } from './components/authentication/forgot/admin-forgot-password/admin-forgot-password.component';
import { BeneficaryInstructionComponent } from './components/instruction/beneficary-instruction/beneficary-instruction.component';
import { LevelInstructionComponent } from './components/instruction/level-instruction/level-instruction.component';




// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    StatesComponent,
    FooterComponent,
    DistrictsComponent,
    TalukaSubDistrictsComponent,
    VillagesComponent,
    UserComponent,
    RoleComponent,
    HospitalComponent,
    CategoryComponent,
    GrievanceNatureComponent,
    InstitutionComponent,
    DesignationComponent,
    LevelComponent,
    ForgotUsernameComponent,
    VerifyAccountComponent,
    GrievanceDashboardComponent,
    PrivilegeComponent,
    ForgotDetailsComponent,
    AdminLoginComponent,
    BeneficaryDashboardComponent,
    AdminDashboardComponent,
    GrievanceRegisterComponent,
    BlockWiseReportComponent,
    ComplaintsSummaryReportsComponent,
    ComplaintTypeReportsComponent,
    DistrictWiseReportsComponent,
    MonthWiseReportsComponent,
    NatureComplaintReportsComponent,
    AddUserMasterComponent,
    NumberOnlyDirective,
    AutofocusDirective,
    EscalationMatrixComponent,
    // GrievanceHistoryComponent,
    NavBarComponent,
    HeaderComponent,
    OpdFeedbackFormComponent,
    IpdFeedbackFormComponent,
    SupervisorDashboardComponent,
    GrievanceDetailsComponent,
    LevelDashboardComponent,
    DailyTransactionsComponent,
    ImagePreview,
    RealTimeDashboardComponent,
    PageNotFoundComponent,
    ReportedGrievancesComponent,
    ForwardedGrievancesComponent,
    GrievanceDetailsPopupComponent,
    GrievanceTimeLineDetailsComponent,
    FeedbackModalComponent,
    FeedbackRatingPipe,
    HelpdeskDashboardComponent,
    GrievanceAddComponent,
    AdminForgotDetailsComponent,
    AdminForgotPasswordComponent,
    ResetPasswordComponent,
    BeneficaryInstructionComponent,
    LevelInstructionComponent

  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FileUploadModule,
    DataTablesModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    DatetimePopupModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgSelectModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot({
      siteKey: CommonConstants.recaptchSiteKey
    }),
    ToastyModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true
    },
    DataService,
    GrievanceDetailsService,
    GrievanceViewService,
    FeedbackModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
