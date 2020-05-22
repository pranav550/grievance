import { Injectable, OnInit } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { CommonConstants } from './shared/constants';


@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    constructor(
        private router: Router, private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
        this.toastyConfig.theme = 'material';
        this.toastyConfig.limit = 1;

    }
    ngOnInit() {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let toastOptions: ToastOptions = {
            title: "",
            msg: "",
            showClose: true,
            timeout: CommonConstants.defaultTime,
            theme: 'default'
        };
        if (localStorage.getItem('token')) {
            const authReq = req.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'X-localization': localStorage.getItem('language')
                })
            });
            return next.handle(authReq)
                .catch((err) => {
                    if (err) {
                        if (err.status === 422) {

                            /* Handling the Error condition based */
                            if (err.error.errors.name) {
                                toastOptions.msg = err.error.errors.name[0];
                            }
                            if (err.error.errors.code) {
                                toastOptions.msg = err.error.errors.code[0];
                            }
                            if (err.error.errors.mobileNumber) {
                                toastOptions.msg = err.error.errors.mobileNumber[0];
                            }
                            if (err.error.errors.username) {
                                toastOptions.msg = err.error.errors.username[0];
                            }
                            if (err.error.errors.userName) {
                                toastOptions.msg = err.error.errors.userName[0];
                            }
                            if (err.error.errors.fatherOrHusbandName) {
                                toastOptions.msg = err.error.errors.fatherOrHusbandName[0];
                            }
                            if (err.error.errors.reminderFrequencyUnitValue) {
                                toastOptions.msg = err.error.errors.reminderFrequencyUnitValue[0];
                            }
                            if (err.error.errors.timePeriodUnitValue) {
                                toastOptions.msg = err.error.errors.timePeriodUnitValue[0];
                            }
                            if (err.error.errors.complainantName) {
                                toastOptions.msg = err.error.errors.complainantName[0];
                            }
                            if (err.error.errors.error_message) {
                                toastOptions.msg = err.error.errors.error_message;
                            }

                            this.toastyService.error(toastOptions);
                        } else if (err.status === 500) {
                            toastOptions.msg = "Some thing went wrong. Please try again";
                            this.toastyService.error(toastOptions);
                        } else if (err.status === 400) {
                            toastOptions.msg = err.error.message;
                            this.toastyService.error(toastOptions);
                        } else if (err.status === 404) {
                            toastOptions.msg = err.error.message;
                            this.toastyService.error(toastOptions);
                        } else if (err.status === 401) {
                            localStorage.clear();
                            toastOptions.msg = "Session is expired. Please Login again"
                            this.toastyService.error(toastOptions);
                            this.router.navigateByUrl('/login');
                        }
                        return throwError(err);

                    }
                });
        } else {
            const authReq = req.clone({ headers: req.headers.set("headerName", "headerValue") });
            return next.handle(authReq)
                .catch((err) => {
                    if (err) {
                        toastOptions.msg = err.error.message;
                        this.toastyService.error(toastOptions);
                        return throwError(err);
                    }

                });
        }

    }
}