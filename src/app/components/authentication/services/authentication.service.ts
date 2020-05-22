import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

import { CommonConstants } from '../../../shared/constants';
@Injectable()

export class AuthenticationService {
    constructor(private httpClient: HttpClient) { }


    postData(url: string, data: any) {
        return this.httpClient.post(CommonConstants.BaseUrl + url, data);
    }

    getData(url: string, data: any) {
        return this.httpClient.get(CommonConstants.BaseUrl + url + data);
    }

    getGrievanceStatitics(url: string) {
        return this.httpClient.get(CommonConstants.BaseUrl + url);
    }
}