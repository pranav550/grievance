import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
declare var $: any;


@Injectable({
    providedIn: 'root'
})
export class FeedbackModalService {

    constructor() { }

    modeldata: string;
    modal = new Subject();

    open() {
        $('#myModal').modal('show')
        this.modal.next(true);
    }
    close() {
        $('#myModal').modal('hide')
        this.modal.next(false);
    }
    closeModal() {
        this.close();
    }

    
}
