import { LevelInstructionComponent } from './components/instruction/level-instruction/level-instruction.component';
import { BeneficaryInstructionComponent } from './components/instruction/beneficary-instruction/beneficary-instruction.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { AdminForgotPasswordComponent } from './components/authentication/forgot/admin-forgot-password/admin-forgot-password.component';
import { AdminForgotDetailsComponent } from './components/authentication/forgot/admin-forgot-details/admin-forgot-details.component';
import { GrievanceAddComponent } from './components/grievance-web-portal/grievance-add/grievance-add.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


/*importing component*/
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { StatesComponent } from './components/master/states/states.component';
import { DistrictsComponent } from './components/master/districts/districts.component';
import { TalukaSubDistrictsComponent } from './components/master/taluka-sub-districts/taluka-sub-districts.component';
import { VillagesComponent } from './components/master/villages/villages.component';
import { PrivilegeComponent } from './components/master/privilege/privilege.component';
import { RoleComponent } from './components/master/role/role.component';
import { UserComponent } from './components/master/account-user/user.component';
import { HospitalComponent } from './components/master/hospital/hospital.component';
import { CategoryComponent } from './components/master/category/category.component';
import { GrievanceNatureComponent } from './components/master/grievance-nature/grievance-nature.component';
import { InstitutionComponent } from './components/master/institution/institution.component';
import { DesignationComponent } from './components/master/designation/designation.component';
import { LevelComponent } from './components/master/level/level.component';
import { VerifyAccountComponent } from './components/authentication/verify-account/verify-account.component';
import { GrievanceDashboardComponent } from './components/grievance-web-portal/grievance-dashboard/grievance-dashboard.component';
import { ForgotPasswordComponent } from './components/authentication/forgot/forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from './components/authentication/forgot/forgot-username/forgot-username.component';
import { AdminLoginComponent } from './components/authentication/admin-login/admin-login.component';
import { BeneficaryDashboardComponent } from './components/dashboards/beneficary-dashboard/beneficary-dashboard.component';
import { HelpdeskDashboardComponent } from './components/dashboards/helpdesk-dashboard/helpdesk-dashboard.component';
import { AdminDashboardComponent } from './components/dashboards/admin-dashboard/admin-dashboard.component';
import { GrievanceRegisterComponent } from './components/grievance-web-portal/grievance-register/grievance-register.component';
import { BlockWiseReportComponent } from './components/reports/block-wise-report/block-wise-report.component';
import { ComplaintsSummaryReportsComponent } from './components/reports/complaints-summary-reports/complaints-summary-reports.component';
import { ComplaintTypeReportsComponent } from './components/reports/complaint-type-reports/complaint-type-reports.component';
import { DistrictWiseReportsComponent } from './components/reports/district-wise-reports/district-wise-reports.component';
import { MonthWiseReportsComponent } from './components/reports/month-wise-reports/month-wise-reports.component';
import { NatureComplaintReportsComponent } from './components/reports/nature-complaint-reports/nature-complaint-reports.component';
import { AddUserMasterComponent } from './components/master/add-user-master/add-user-master.component';
import { EscalationMatrixComponent } from './components/master/escalation-matrix/escalation-matrix.component';
// import { GrievanceHistoryComponent } from './components/grievance-web-portal/grievance-history/grievance-history.component';
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

/*Routes*/
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'admin-forgot-password',
    component: AdminForgotPasswordComponent
  },
  {
    path: 'beneficary-instruction',
    component: BeneficaryInstructionComponent
  },
  {
    path: 'level-instruction',
    component: LevelInstructionComponent
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'states',
    // component: StatesComponent,
    // canActivate: [AuthGuard],
    component: PageNotFoundComponent,
  },
  {
    path: 'districts',
    // component: DistrictsComponent,
    // canActivate: [AuthGuard]
    component: PageNotFoundComponent,
  },
  {
    path: 'talukas',
    // component: TalukaSubDistrictsComponent,
    // canActivate: [AuthGuard]
    component: PageNotFoundComponent,
  },
  {
    path: 'villages',
    // component: VillagesComponent,
    // canActivate: [AuthGuard]
    component: PageNotFoundComponent,
  },
  {
    path: 'privileges',
    component: PrivilegeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    component: RoleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manage-user',
    component: AddUserMasterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hospitals',
    component: HospitalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category-categories',
    // component: CategoryComponent,
    // canActivate: [AuthGuard]
    component: PageNotFoundComponent,
  },
  {
    path: 'category-natures',
    // component: GrievanceNatureComponent,
    // canActivate: [AuthGuard]
    component: PageNotFoundComponent,
  },
  {
    path: 'institutions',
    // component: InstitutionComponent,
    // canActivate: [AuthGuard]
    component: PageNotFoundComponent,
  },
  {
    path: 'designations',
    // component: DesignationComponent,
    // canActivate: [AuthGuard]
    component: PageNotFoundComponent,
  },
  {
    path: 'levels',
    component: LevelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-username',
    component: ForgotUsernameComponent
  },
  {
    path: 'verify-account/:code',
    component: VerifyAccountComponent
  },
  {
    path: 'grievance-dashboard',
    component: GrievanceDashboardComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'grievance-feedback',
    component: GrievanceDashboardComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'grievance-history',
  //   component: GrievanceHistoryComponent,
  //   canActivate: [AuthGuard]
  // },
  {

    path: 'escalation-matrix',
    component: EscalationMatrixComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent
  },
  {
    path: 'dashboard',
    component: BeneficaryDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'helpdesk-dashboard',
    component: HelpdeskDashboardComponent

  },
  {
    path: 'block-reports',
    component: BlockWiseReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'complaints-summary-reports',
    component: ComplaintsSummaryReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'complaint-type-reports',
    component: ComplaintTypeReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'district-wise-reports',
    component: DistrictWiseReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'month-wise-reports',
    component: MonthWiseReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nature-complaint-reports',
    component: NatureComplaintReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'grievance-register',
    component: GrievanceRegisterComponent
  },
  {
    path: 'grievance-add',
    component: GrievanceAddComponent
  },
  {
    path: 'nature-complaint-reports',
    component: NatureComplaintReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'opd-feedback',
    component: OpdFeedbackFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ipd-feedback',
    component: IpdFeedbackFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'supervisor-dashboard',
    component: SupervisorDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'grievance-details',
    component: GrievanceDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'level-dashboard',
    component: LevelDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'daily-transaction',
    component: DailyTransactionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'real-time-dashboard',
    component: RealTimeDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rereported-grievance',
    component: ReportedGrievancesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forwarded-grievance',
    component: ForwardedGrievancesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
