import { Injectable } from "@angular/core";
import { ToastOptions, ToastyService } from 'ng2-toasty';
import { CommonConstants } from '../shared/constants'

@Injectable()
export class CommonHelper {
    constructor(private toastyService: ToastyService) { }
    /*toaster message for success*/
    toasterMessage(msg) {
        let toastOptions: ToastOptions = {
            title: "",
            msg: msg,
            showClose: true,
            timeout: CommonConstants.defaultTime,
            theme: 'default'
        };
        toastOptions.msg = msg;
        this.toastyService.success(toastOptions);
    }
    /*toaster message for failure*/
    toasterMessageError(msg) {
        let toastOptions: ToastOptions = {
            title: "",
            msg: msg,
            showClose: true,
            timeout: CommonConstants.defaultTime,
            theme: 'default'
        };
        this.toastyService.error(toastOptions);
    }
    /**showing success message for few seconds function*/
}
