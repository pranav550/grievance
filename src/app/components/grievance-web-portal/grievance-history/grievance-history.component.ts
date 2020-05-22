// import { Component, OnInit } from "@angular/core";
// import { MasterService } from "../../master/services/master-service";
// import { NgxSpinnerService } from "ngx-spinner";
// import { CommonHelper } from "src/app/helper/helper.component";
// @Component({
//   selector: "app-grievance-history",
//   templateUrl: "./grievance-history.component.html",
//   styleUrls: ["./grievance-history.component.scss"],
//   providers: [MasterService, CommonHelper]
// })
// export class GrievanceHistoryComponent implements OnInit {
//   grievanceData: any;
//   constructor(
//     private masterService: MasterService,
//     private spinner: NgxSpinnerService
//   ) {}

//   ngOnInit() {
//     let id = localStorage.getItem("grievanceId");
//     this.getGrievanceData(id);
//   }
//   /*getGrievanceData used for get history detail */
//   getGrievanceData(id: any) {
//     try {
//       this.spinner.show();
//       this.masterService.getData("grievance_history/", id).subscribe(
//         (response: any) => {
//           if (response) {
//             this.spinner.hide();
//             this.grievanceData = response.data;
//           } else {
//             this.spinner.hide();
//             this.grievanceData = [];
//           }
//         },
//         error => {
//           this.spinner.hide();
//         }
//       );
//     } catch (exc) {}
//   }
// }
