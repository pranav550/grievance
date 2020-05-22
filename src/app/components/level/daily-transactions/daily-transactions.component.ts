import { Component, OnInit, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MasterService } from "../../master/services/master-service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";
import { GrievanceViewService } from '../../../shared/grievance-time-line-details/grievance-time-line-details.service';

@Component({
  selector: 'app-daily-transactions',
  templateUrl: './daily-transactions.component.html',
  styleUrls: ['./daily-transactions.component.scss'],
  providers: [MasterService]
})
export class DailyTransactionsComponent implements OnInit {

  dataTable: any;
  dailyTransactionData: any;
  grieveanceDetailsData: any;
  modalRef: BsModalRef;
  modalView: boolean = false;
  grievanceHistoryData: any;

  constructor(
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private route: Router,
    private modalService: BsModalService,
    private grievanceViewService: GrievanceViewService

  ) { }

  ngOnInit(): void {
    this.getDailyTransactionList();
  }

  /*getData bind table data */
  getDailyTransactionList() {
    try {
      this.spinner.show();
      this.masterService.getAll('daily_transactions').subscribe(
        (response: any) => {
          if (response.status) {
            if (response.data.length > 0) {
              this.spinner.hide();
              this.dailyTransactionData = response.data;
              const table: any = $("table");
              this.reploatingDataTable();
              this.chRef.detectChanges();
              this.dataTable = table.DataTable({ order: [[1, "desc"]] }).draw();
            } else {
              this.spinner.hide();
              this.dailyTransactionData = [];
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $("table");
              this.dataTable = table.DataTable().draw();
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

  /* Showing the user grievance Detail Modal Popup*/
  grievanceDetailsModal(template: TemplateRef<any>, grievanceId) {
    try {
      this.masterService.getGrievanceDetails('grievance_details/', grievanceId).subscribe(
        (response: any) => {
          if (response.data.length > 0) {
            this.grieveanceDetailsData = response.data[0];
            if (this.grieveanceDetailsData.actionTakenBy == '') {
              this.grieveanceDetailsData.actionTakenBy = '-'
            }
            if (this.grieveanceDetailsData.actionRemark == '') {
              this.grieveanceDetailsData.actionRemark = '-'
            }
          } else {
            this.spinner.hide();
          }
          this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-lg' }));
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) { }
  }
}
