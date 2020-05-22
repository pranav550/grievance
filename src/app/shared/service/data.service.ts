import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class DataService {
    public editUser="addUserDetails";
    public editGrievanceDetails="addGrievanceDetails";
    public levelActionGrievanceDetails="actionLevelGrievanceDetails";
    level=[];

    //Global variable for showing language in whole application
    private messageSource = new BehaviorSubject("English");
    currentMessage = this.messageSource.asObservable();
    changeMessage(message: string) {
        this.messageSource.next(message)
    }

    //Global array for fetching Userdetails 
    private UserDetails = new BehaviorSubject([]);
    getCurrentUserDetails = this.UserDetails.asObservable();
    getUserDetails(message: Array<any>) {
        this.UserDetails.next(message)
    }

    //Global array for fetching grievancedetails 
    private GrievanceDetails = new BehaviorSubject([]);
    getCurrentGrievanceDetails = this.GrievanceDetails.asObservable();
    getGrievanceDetails(message: Array<any>) {
        this.GrievanceDetails.next(message)
    }

}