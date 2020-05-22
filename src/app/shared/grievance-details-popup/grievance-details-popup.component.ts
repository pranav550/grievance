import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'app-grievance-details-popup',
  templateUrl: './grievance-details-popup.component.html',
  styleUrls: ['./grievance-details-popup.component.scss']
})
export class GrievanceDetailsPopupComponent implements OnInit {

  @Input() grieveanceDetailsData: any;
  @Input() actionTakenData: any;
  constructor() { }

  ngOnInit() {

  }

}
