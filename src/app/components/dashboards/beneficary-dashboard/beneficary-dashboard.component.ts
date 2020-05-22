import { Component, OnInit, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MasterService } from "../../master/services/master-service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonHelper } from "../../../helper/helper.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { GrievanceDetailsPopupComponent } from '../../../shared/grievance-details-popup/grievance-details-popup.component';
import { GrievanceDetailsService } from '../../../shared/grievance-details-popup/grievance-details.service';
import { GrievanceViewService } from '../../../shared/grievance-time-line-details/grievance-time-line-details.service';

declare var $: any;

@Component({
  selector: "app-beneficary-dashboard",
  templateUrl: "./beneficary-dashboard.component.html",
  styleUrls: ["./beneficary-dashboard.component.scss"],
  providers: [MasterService, CommonHelper]
})
export class BeneficaryDashboardComponent implements OnInit {
  dataTable: any;
  allGreviancesData: number;
  pendingGreviancesData: number;
  closedGrevianceData: number;
  isAllGrievanceDataExists: boolean;
  isPendingExists: boolean;
  isClosedDataExists: boolean;
  registerGrievancesData: any;
  allPGriCount: any;
  allCGriCount: any;
  allRGriCount: any;
  allCountExist: boolean = false;
  grieveanceDetailsData: any;
  grievanceHistoryData: any;
  modalRef: BsModalRef;
  userFeedBackForm: FormGroup;
  gId: Number;
  errorCheck: boolean = false;
  modalBool: boolean = false;
  modalView: boolean = false;
  actionTakenData: Array<any> = [];
  fileUploadData: Array<any> = [];

  constructor(
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private route: Router,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private commonHelper: CommonHelper,
    private grievanceDetailsPopupModal: GrievanceDetailsService,
    private grievanceViewService: GrievanceViewService
  ) { }

  ngOnInit(): void {
    let apiUrl = "beneficiary/grievance_list_";
    this.getAllGrievanceCount('beneficiary/total_count');
    this.getData(apiUrl + "all")
  }

  /**API calling method
  *
  * @param url
  * @param greviancesType
  */
  getAllGrievanceCount(apiRoute: string) {
    try {
      // this.spinner.show();
      this.masterService.getallGrievanceCount(apiRoute).subscribe(
        (response: any) => {
          if (response.status) {
            if (response.data.length > 0) {
              // this.spinner.hide();
              this.allCountExist = true;
              this.allPGriCount = response.data[0].totalPending;
              this.allCGriCount = response.data[0].totalClosed;
              this.allRGriCount = response.data[0].totalRegistered;
            } else {
              // this.spinner.hide();
              this.allCountExist = false;
              this.allPGriCount = 0;
              this.allCGriCount = 0;
              this.allRGriCount = 0;
            }
          }
        },
        error => {
          // this.spinner.hide();
        }
      );
    } catch (excp) {
      // this.spinner.hide();
    }
  }

  /*getData bind table data */
  getData(apiRoute: string) {
    this.spinner.show();
    try {
      this.spinner.show();
      this.masterService.getAll(apiRoute).subscribe(
        (response: any) => {
          if (response.status) {
            if (response.data.length > 0) {
              this.spinner.hide();

              this.registerGrievancesData = response.data;
              const table: any = $("table");
              this.reploatingDataTable();
              this.chRef.detectChanges();

              this.dataTable = $("#dataTable1").DataTable({ "order": [] }).draw();

            } else {
              this.spinner.hide();
              this.registerGrievancesData = [];
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $("table");
              this.dataTable = $("#dataTable1").DataTable().draw();
            }
          } else {
            this.spinner.hide();
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $("#dataTable1").DataTable();
    table.destroy();
  }
  /*routing grievance history screen */
  viewTimeLineGrievance(id) {
    this.modalView = true;
    this.masterService.getData("grievance_history/", id).subscribe(
      (response: any) => {
        if (response) {
          this.spinner.hide();
          this.grievanceHistoryData = response.data;
          this.openViewModal();
        } else {
          this.spinner.hide();
          this.grievanceHistoryData = [];
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  /* Function for Opening the View Model*/
  openViewModal() {
    this.grievanceViewService.open();
  }

  /* Showing grievance Modal Popup on click of grievamce Id*/
  grievanceDetailsModal(grievanceId) {
    this.modalBool = true;
    this.masterService.getGrievanceDetails('grievance_details/', grievanceId).subscribe(
      (response: any) => {
        if (response.data.length > 0) {
          this.grieveanceDetailsData = response.data[0];
          this.getFiles(grievanceId);
        } else {
          this.spinner.hide();
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  /* Showing the User Grievance FeedBack Modal Popup*/
  grievanceUserFeedBackModal(template: TemplateRef<any>, grievanceId) {
    if (this.userFeedBackForm) {
      this.userFeedBackForm.reset();
    }
    this.userFeedBackForm = this.fb.group({
      feedbackComment: ['', Validators.maxLength(250)],
      feedbackStatus: [true, Validators.required]
    });
    this.gId = grievanceId;
    this.modalRef = this.modalService.show(template);
  }

  /*submit FeedBack*/
  submitUserFeedback() {
    try {
      let apiValues = this.userFeedBackForm.value,
        status = apiValues.feedbackStatus ? 'satisfied' : 'unsatisfied',
        data = {
          "grievanceId": this.gId,
          "feedback": status,
          "comment": apiValues.feedbackComment,
        }
      this.modalRef.hide();
      this.masterService.postData('grievance_feedback', data).subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.commonHelper.toasterMessage(response.message);
            this.getData("beneficiary/grievance_list_all");
          } else {
            this.spinner.hide();
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }

  //function to diaable or enable the subbmit button
  emptyDisable(event) {
    if (event.target.value.length <= 255) {
      this.errorCheck = false;
    } else if (event.target.value.length > 255) {
      this.errorCheck = true;
    }
  }

  /* Function for Opening the Password Popup Model*/
  openModal() {
    this.grievanceDetailsPopupModal.open();
  }

  /*getData bind table data */
  getFiles(id) {
    try {
      this.spinner.show();
      this.openModal();
      this.masterService.getAll('grievance_uploads/' + id).subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.actionTakenData = response.data;
            this.actionTakenData.map(item => {
              if (item.isGrievanceRedressed == 1) {
                item.isGrievanceRedressedVal = "Yes";
              } else {
                item.isGrievanceRedressedVal = "No"
              }
              this.fileUploadData = item.uploads
            })

          } else {
            this.spinner.hide();
            this.actionTakenData = [];
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }
}
