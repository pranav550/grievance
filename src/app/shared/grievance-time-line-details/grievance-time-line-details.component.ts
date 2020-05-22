import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grievance-time-line-details',
  templateUrl: './grievance-time-line-details.component.html',
  styleUrls: ['./grievance-time-line-details.component.scss']
})
export class GrievanceTimeLineDetailsComponent implements OnInit {
  @Input() grievanceHistoryData:any;
  constructor() { }

  ngOnInit() {
  }

}
