import { Component, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants'
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss'],
  providers: [MasterService, CommonHelper]
})
export class StatesComponent implements OnInit {
  submitted = false;
  addStateForm: FormGroup;
  newStateData: any;
  editStateForm: FormGroup;
  editStateData: any;
  dataTable: any;
  validationLength: Number;
  modalRef: BsModalRef;
  stateId: Number;
  statesData: any;
  states = [];

  constructor(private modalService: BsModalService,
    private masterService: MasterService,
    private commonHelper: CommonHelper,
    private chRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.getStates();
    this.validationLength = CommonConstants.MaxValidation;
  }

  /**
   * Open modal Popup
   * @param template
   */
  openModal(template: TemplateRef<any>) {
    // this.addStateForm.reset();
    this.submitted = false;
    this.modalRef = this.modalService.show(template);
    this.addStateForm = this.fb.group({
      addStateName: ['', [Validators.required, Validators.maxLength(100)]],
      addStateId: ['', Validators.required],
      addStateDisplayName: ['', Validators.maxLength(100)],
      addStateDescription: ['', Validators.maxLength(100)],
      addStateStatusMode: [true, Validators.required]
    });
  }

  /**
   * Open modal for edit states 
   * @param stateData
   * @param template 
   */
  editStateModal(stateData: any, template: TemplateRef<any>) {
    this.newStateData = stateData;
    let status = stateData.status === 'active' ? true : false;
    this.modalRef = this.modalService.show(template);
    this.editStateForm = this.fb.group({
      editStateName: [stateData.name, [Validators.required, Validators.maxLength(100)]],
      editStateId: [stateData.code, Validators.required],
      editStateDisplayName: [stateData.displayName, Validators.maxLength(100)],
      editStateDescription: [stateData.description, Validators.maxLength(100)],
      editStateStatus: status
    });
  }


  /**
   * Modal popup for delete states
   * @param template 
   * @param state 
   */
  deleteStateModalPopup(template: TemplateRef<any>, state: any) {
    this.modalRef = this.modalService.show(template);
    this.editStateData = state;
  }

  //get f() { return this.addStateForm.controls; }
  get addStateF() {
    return this.addStateForm.controls;
  }

  //get f() { return this.addStateForm.controls; }
  get editStateF() {
    return this.editStateForm.controls;
  }

  /**
   * Search Changes
   * @param value 
   */
  public searchChanged(value) {
    // Make cool HTTP requests
  }

  /**
   * Retreive States Data
   */
  getStates() {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.data.length > 0) {
            this.statesData = response.data;
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $('table');
            this.dataTable = table.DataTable().draw();
          } else {
            this.statesData = [];
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $('table');
            this.dataTable = table.DataTable().draw();
            this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
          }
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * Passing first three digits from district as code 
   * @param event 
   */
  stateEnter(event: any) {
    this.addStateForm.get('addStateId').setValue(event.substring(0, 3));
  }

  stateEditEnter(event: any) {
    this.editStateForm.get('editStateId').setValue(event.substring(0, 3));
  }


  /*Adding State*/
  createState() {
    try {
      this.submitted = true;
      if (this.addStateForm.invalid) {
        return;
      }
      let status = this.addStateForm.value.addStateStatusMode ? "active" : "inactive";
      let data = {
        "code": this.addStateForm.value.addStateId,
        "name": this.addStateForm.value.addStateName,
        "displayName": this.addStateForm.value.addStateDisplayName,
        "description": this.addStateForm.value.addStateDescription,
        "status": status
      }
      this.spinner.show();
      this.masterService.postData('states', data).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          this.getStates();
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.reploatingDataTable();
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * Update the stateDetails 
   *
   */
  editStateDetails() {
    try {
      this.submitted = true;
      if (this.editStateForm.invalid) {
        return;
      }
      let status = this.editStateForm.value.editStateStatus ? "active" : "inactive";
      let apiData = this.editStateForm.value;
      let data = {
        "code": apiData.editStateId,
        "name": apiData.editStateName,
        "status": status,
        "description": apiData.editStateDescription,
        "displayName": apiData.editStateDisplayName
      }
      this.spinner.show();
      this.masterService.putData('states/', this.newStateData.id, data).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          this.modalRef.hide();
          this.commonHelper.toasterMessage(response.message);
          this.getStates();
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }

  /**
   * Delete State
   * @param arg1 
   */
  deleteState(arg1: boolean) {
    try {
      if (arg1) {
        this.masterService.delete('states/', this.editStateData.id).subscribe((response: any) => {
          if (response.status) {
            this.commonHelper.toasterMessage(response.message);
            this.getStates();
            this.modalRef.hide();
          } else {
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        });
      } else {
        this.modalRef.hide();
      }
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * Updating the status of the state
   * @param stateForm 
   */
  stateStatusValue(stateForm: any) {
    try {
      let status = stateForm.status === 'active' ? "inactive" : "active"
      let data = {
        "status": status
      }
      this.masterService.putData('update_state_status/', stateForm.id, data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.getStates();
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

}

