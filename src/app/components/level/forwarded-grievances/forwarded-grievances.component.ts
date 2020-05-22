import { Component, OnInit, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MasterService } from "../../master/services/master-service";
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";

@Component({
  selector: 'app-forwarded-grievances',
  templateUrl: './forwarded-grievances.component.html',
  styleUrls: ['./forwarded-grievances.component.scss'],
  providers: [MasterService]
})
export class ForwardedGrievancesComponent implements OnInit {
  dataTable: any;
  dailyTransactionData: any;
  grieveanceDetailsData: any;
  modalRef: BsModalRef;

  constructor(
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private route: Router,
    private modalService: BsModalService,

  ) { }

  ngOnInit(): void {
    this.getDailyTransactionList();
  }

  /*getData bind table data */
  getDailyTransactionList() {
    try {
      this.spinner.show();
      this.masterService.getAll('reopened_grievances').subscribe(
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

}
