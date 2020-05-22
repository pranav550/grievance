import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  providers: [MasterService, CommonHelper]
})
export class RoleComponent implements OnInit {
  modalRef: BsModalRef;
  selectedState: any;
  statesData: any;
  rolesData: any;
  rolData: any;
  isStateExists: boolean;
  submitted: boolean;
  selectedStateEvent: any;
  RoleFormNewData: any;
  addRoleForm: FormGroup;
  editRoleForm: FormGroup;
  dataTable: any;
  actionsData: any;
  stateName: String;
  constructor(
    private modalService: BsModalService,
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getStates(true);
    this.getActions();
  }
  /*validation rules*/
  validatorRule() {
    this.addRoleForm = this.fb.group({
      addRoleState: [this.selectedState, [Validators.required]],
      addRoleName: ['', [Validators.required, Validators.maxLength(150)]],
      addRoleDescription: ['', [Validators.maxLength(150)]],
      addRoleActions: [[], [Validators.required]],
      addRoleStatus: [true, Validators.required],

    });
  }
  //get f() { return this.addRoleForm.controls; }
  get addRoleF() {
    return this.addRoleForm.controls;
  }
  get editRoleF() {
    return this.editRoleForm.controls;
  }

  /**
     * 
     * @param template 
     */
  addRoleModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.modalRef = this.modalService.show(template);
    this.validatorRule();
  }
  /*get states*/
  getStates(value: boolean) {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.isStateExists = true;
            let selectedValue: any;
            response.data.forEach(element => {
              if (element.id == CommonConstants.stateId) {
                selectedValue = element;
              }
            });
            if (value) {
              this.validatorRule();
              this.selectedState = selectedValue;
              this.statesData = response.data;
              this.getRoles(selectedValue.id);
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
            } else {
              this.statesData = response.data;
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
            }
          } else {
            this.statesData = [];
            this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
            this.isStateExists = false;
            this.spinner.hide();
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $('table');
            this.dataTable = table.DataTable().draw();
          }
        } else {
          this.spinner.hide();
        }

      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /*get Actions*/
  getActions() {
    try {
      this.spinner.show();
      this.masterService.getAll('actions').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            response.data.map(item => {
              item.gender = 'Select All'
            })
            this.actionsData = response.data;
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $('table');
            this.dataTable = table.DataTable().draw();
          } else {
            this.actionsData = [];
            this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
            this.spinner.hide();
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $('table');
            this.dataTable = table.DataTable().draw();
          }
        } else {
          this.spinner.hide();
        }

      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  onStateChange(event) {
    if (event) {
      this.getRoles(event.id);
    }
  }
  /* Adding users */
  addRoles() {
    try {
      this.submitted = true;
      if (this.addRoleForm.invalid) {
        return;
      }
      let apiValues = this.addRoleForm.value,
        status = apiValues.addRoleStatus ? 'active' : 'inactive',
        data = {
          "stateId": apiValues.addRoleState.id,
          "name": apiValues.addRoleName,
          "description": apiValues.addRoleDescription,
          "actions": apiValues.addRoleActions,
          "status": status,
        }

      this.masterService.postData('roles', data).subscribe((response: any) => {
        if (response.data) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.spinner.hide();
          this.getRoles(apiValues.addRoleState.id);
          this.getStates(false);
          this.selectedState = apiValues.addRoleState;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, err => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /*get states*/
  getRoles(stateId) {
    try {
      this.masterService.getData('roles/', stateId).subscribe((response: any) => {
        if (response) {
          if (response.data.length > 0) {
            if (response.data[0].roles.length > 0) {
              this.spinner.hide();
              this.rolesData = response.data[0].roles;
              this.stateName = response.data[0].stateName;
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
            } else {
              this.rolesData = [];
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
              this.spinner.hide();
            }
          } else {
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /**
  * updating the status of the level
  * @param rolevalues 
  */
  rolesStatus(rolevalues: any) {
    try {
      this.spinner.show();
      let status = rolevalues.status === 'active' ? "inactive" : "active",
        data = {
          "status": status
        }
      this.masterService.putData('update_role_status/', rolevalues.roleId, data).subscribe((response: any) => {
        if (response) {
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          this.getRoles(this.selectedState.id);
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  openEditModal(formData: any, template: TemplateRef<any>) {
    this.rolData = formData;
    let actionData = []
    formData.actions.map(element => {
      actionData.push({ name: element.actionName, id: element.actionId });
    });
    this.modalRef = this.modalService.show(template);
    let status = formData.status === 'active' ? true : false;
    this.editRoleForm = this.fb.group({
      editRoleState: [this.selectedState, [Validators.required]],
      editRoleName: [formData.roleName, [Validators.required, Validators.maxLength(150)]],
      editRoleDescription: [formData.description, [Validators.maxLength(150)]],
      editRoleActions: [actionData, [Validators.required]],
      editRoleStatus: [status, Validators.required],

    });
  }

  /**
   * level update*/
  editRoles(template: TemplateRef<any>) {
    try {
      this.submitted = true;
      if (this.editRoleForm.invalid) {
        return;
      }
      let actionID = []
      this.editRoleForm.value.editRoleActions.map(item => {
        actionID.push(item.id)
      })
      let apiData = this.editRoleForm.value,
        status = apiData.editRoleStatus ? 'active' : 'inactive',
        data = {
          "stateId": apiData.editRoleState.id,
          "name": apiData.editRoleName,
          "actions": actionID,
          "status": status,
          "description": apiData.editRoleDescription,
        }
      this.masterService.putData('roles/', this.rolData.roleId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getRoles(apiData.editRoleState.id);
          this.getActions();
          this.selectedState = apiData.editRoleState;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  deleteRoleModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }

}
