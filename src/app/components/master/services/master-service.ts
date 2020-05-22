import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonConstants } from "../../../shared/constants";

@Injectable()
export class MasterService {
  constructor(private httpClient: HttpClient,

  ) { }
  errorConnectionLost: boolean = false;
  errorOrResponse: boolean = false;
  /*CRUD OPERATIONS FOR MASTER*/

  //postApicalls
  postData(url: string, data: any) {
    return this.httpClient.post(CommonConstants.BaseUrl + url, data);
  }



  /*delete*/
  delete(url: string, id: number) {
    return this.httpClient.delete(CommonConstants.BaseUrl + url + id);
  }

  /*getApi*/
  getData(url: string, id: number) {
    return this.httpClient.get(CommonConstants.BaseUrl + url + id);
  }

  /*getMatrixData*/
  getMatrixData(url: string, gId: number, sId: number, nid: number) {
    return this.httpClient.get(CommonConstants.BaseUrl + url + gId + "/" + sId + "/" + nid);
  }

  // /*getMatrixData*/
  // getMatrixData(url: string, data: any) {
  //   return this.httpClient.get(CommonConstants.BaseUrl + url, data);
  // }

  getAll(url: string) {
    return this.httpClient.get(CommonConstants.BaseUrl + url);
  }

  getLevels(url: string, sId: number, gId: number) {
    return this.httpClient.get(CommonConstants.BaseUrl + url + sId + "/" + gId);
  }

  getLev(url: string, gId: any, sId: number, nid: any) {
    return this.httpClient.get(CommonConstants.BaseUrl + url + gId + "/" + sId + "/" + nid);
  }



  /*putApi*/
  putData(url: string, id: number, data: any) {
    return this.httpClient.put(CommonConstants.BaseUrl + url + id, data);
  }

  /* get IPD Form Data*/
  getIpdData(url: string) {
    return this.httpClient.get(CommonConstants.BaseUrl + url);
  }

  /* get all new  and Accepeted Grievances */
  getAllNewGrievances(url: string, data: any) {
    return this.httpClient.post(CommonConstants.BaseUrl + url, data);
  }

  /* get all Rejected Grievances */
  getAllRejectedGrievances(url: string, data: any) {
    return this.httpClient.post(CommonConstants.BaseUrl + url, data);
  }

  /* get the grievance Status*/
  putGrievanceStatus(url: string, id: number, data: any) {
    return this.httpClient.put(CommonConstants.BaseUrl + url + id, data);
  }

  /* get grievance Dteails*/
  getGrievanceDetails(url: string, gId: any) {
    return this.httpClient.get(CommonConstants.BaseUrl + url + gId);
  }

  /* get level Grievances Count*/
  alllevelGrievanceCount(url: string) {
    return this.httpClient.get(CommonConstants.BaseUrl + url);
  }

  /* get level Grievances List*/
  getLevelGrievancesList(url: string, data: any) {
    return this.httpClient.post(CommonConstants.BaseUrl + url, data);
  }

  /*get level Grievances Count*/
  getallGrievanceCount(url: string) {
    return this.httpClient.get(CommonConstants.BaseUrl + url);
  }

  /*get IPD Feedback Count*/
  getIPDFeedBackCount(url: string) {
    return this.httpClient.get(CommonConstants.BaseUrl + url);
  }

  /*get OPD Feedback Count*/
  getOPDFeedBackCount(url: string) {
    return this.httpClient.get(CommonConstants.BaseUrl + url);
  }

  /*get HelpDesk */
  getHelpDesk(url: string) {
    return this.httpClient.get(CommonConstants.BaseUrl + url);
  }

  /*get HelpDesk Count */
  getHelpDeskCount(url: string) {
    return this.httpClient.get(CommonConstants.BaseUrl + url);
  }

  /*get Language Count */
  resp1 = new BehaviorSubject("");
  getLang = this.resp1.asObservable();







}
