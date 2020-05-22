import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.scss'],
  providers: [MasterService, CommonHelper, NgxSpinnerService]
})
export class PrivilegeComponent implements OnInit {
  modalRef: BsModalRef;
  selectedStateEvent: any;
  statesData: any;
  dataTable: any;
  stateID: number
  roleID: number
  rolesData: any;
  allAction: any;
  stateName: String;
  actionPermissionData: any;
  selectedRoleEvent: any;
  isactionPermissionExists: boolean = false;
  submitted = false;
  updateStateBool: boolean = true;
  updateRoleBool: boolean = true;
  showContent: boolean = false;
  checkedId = [];
  isDisabled: boolean = false;
  checkedData: any = [];
  checkObj: any = {}
  second:any;

  checkeachTrueAllBox = [];
  currentActionData: any = [];
  constructor(
    private modalService: BsModalService,
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getStates();

  }
  /**
  * Get states data
  */
  getStates() {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {

        let selectedVal: any;
        response.data.forEach(element => {
          if (element.id == CommonConstants.stateId) {
            selectedVal = element;
          }
        });
        if (response.data.length > 0) {
          this.selectedStateEvent = selectedVal;
          this.statesData = response.data;
          this.stateID = selectedVal.id
          this.getRoles(selectedVal.id, 'defaultFilter');
        } else {
          this.statesData = [];
          this.reploatingDataTable();
          this.chRef.detectChanges();
          const table = $('table');
          this.dataTable = table.DataTable().draw();
          this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
          this.spinner.hide();
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /*get roles*/
  getRoles(stateId, value) {
    try {
      this.masterService.getData('roles/', stateId).subscribe((response: any) => {
        if (response.status) {
          if (response.data[0].roles.length > 0) {
            this.spinner.hide();
            this.rolesData = response.data[0].roles;
            this.stateName = response.data[0].stateName;
            this.updateStateBool = false;
            // if (value === 'defaultFilter') {
            //   this.getActionsPermission(response.data[0].roles[0].roleId);
            //   this.roleID = response.data[0].roles[0].roleId;
            // this.selectedRoleEvent = response.data[0].roles[0];
            // }
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $('table');
            this.dataTable = table.DataTable().draw();

          } else {
            this.updateStateBool = true;
            this.rolesData = [];
            this.reploatingDataTable();
            this.chRef.detectChanges();
            this.chRef.detectChanges();
            const table = $('table');
            this.dataTable = table.DataTable().draw();
            this.commonHelper.toasterMessageError(CommonConstants.roleMessage);
            this.spinner.hide();
            if (value === 'defaultFilter') {
              this.selectedRoleEvent = [];
              this.isactionPermissionExists = false;
            }
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
   * SelectChangeEvent for default
   * @param event 
   */
  onStateEventChange(event, value) {
    this.checkedId = [];
    this.selectedRoleEvent = [];
    this.actionPermissionData = [];
    this.reploatingDataTable();
    this.chRef.detectChanges();
    this.chRef.detectChanges();
    const table = $('table');
    this.dataTable = table.DataTable().draw();
    if (event) {
      this.stateID = event.id;
      this.getRoles(event.id, value);
    }
  }

  /**
   * role page starting change event
   * @param event 
   */
  onRoleEventChange(event) {
    this.checkedId = [];
    if (event) {
      this.roleID = event.roleId
      this.getActionsPermission(event.roleId);

    }
  }





  /**
     * Get Action data
     * @param roleId 
     */
  getActionsPermission(roleId) {
    try {
      if (roleId) {
        this.masterService.getData('role_permissions/', roleId).subscribe((response: any) => {
          if (response.status) {
            this.spinner.hide();
            if (response.data.length > 0) {
              this.reploatingDataTable();
              this.actionPermissionData = response.data;
              this.updateRoleBool = false;
              this.showContent = true;

              // disable the checkbox
              this.actionPermissionData.filter(data => {

                if ((data.id == 1) || (data.id == 2) || (data.id == 6) || (data.id == 8) || (data.id == 9) ||
                  (data.id == 10) || (data.id == 11) || (data.id == 12) || (data.id == 13) || (data.id == 14) || (data.id == 15)) {
                  data.assigned = false
                }

              })
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
              this.isactionPermissionExists = true;
            } else {
              this.updateRoleBool = true;
              this.showContent = false;
              this.actionPermissionData = [];
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
              this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
            }
          } else {
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        }, error => {
          this.spinner.hide();
        });
      } else {
        this.spinner.hide();
        this.reploatingDataTable();
        this.actionPermissionData = [];
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable().draw();
        this.rolesData = [];
        this.selectedRoleEvent = '';
        this.isactionPermissionExists = false;
      }

    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  // CheckAll and Uncheck all at same time in Add
  selectAllAdd(event, value) {
    if (event.target.checked == true) {
      this.actionPermissionData.forEach(element => {
        element.add = value
        element.id
        this.currentActionData.push(element)
        // console.log(this.currentActionData)
      })
    }
    // else if (event.target.checked == false) {
    //   this.actionPermissionData.forEach(element => {
    //     element.add = false;
    //     element.id
    //     this.currentActionData.push(element)
    //   })
    // }
  }
  // CheckAll and Uncheck all at same time in View
  selectAllView(event, value) {
    // console.log(value)
    if (event.target.checked == true) {
      this.actionPermissionData.forEach(element => {
        element.view = value;
        element.id
        this.currentActionData.push(element)
        // console.log(this.currentActionData)
      })
    }

    // else if (event.target.checked == false) {
    //   this.actionPermissionData.forEach(element => {
    //     element.view = false;
    //     element.id
    //     this.currentActionData.push(element)
    //   })
    // }
  }
  // CheckAll and Uncheck all at same time in Edit
  selectAllEdit(event, value) {
    if (event.target.checked == true) {
      this.actionPermissionData.forEach(element => {
        element.edit = value
        element.id
        this.currentActionData.push(element)
        // console.log(this.currentActionData)
      })
    }
    // else if (event.target.checked == false) {
    //   this.actionPermissionData.forEach(element => {
    //     element.edit = false;
    //     element.id
    //     this.currentActionData.push(element)
    //   })
    // }
  }
  // CheckAll and Uncheck all at same time in Delete
  selectAllDelete(event, value) {
    if (event.target.checked == true) {
      this.actionPermissionData.forEach(element => {
        element.delete = value
        element.id
        this.currentActionData.push(element)
        // console.log(this.currentActionData)
      })
    }
    // else if (event.target.checked == false) {
    //   this.actionPermissionData.forEach(element => {
    //     element.delete = false;
    //     element.id
    //     this.currentActionData.splice(element.id)
    //   })
    // }
  }

  //Check and uncheck change function for privilege
  actionCheck(event, action, actionData, i) {
    actionData.forEach((element, index) => {
      if (element.id == event.target.value) {
        actionData[index][event.target.name] = event.target.checked;
        // actionData[index]['action_id'] = event.target.value;
      }
    });
    this.currentActionData = actionData;
  }


  updatePrivilegeModal() {
    this.currentActionData = [];
    this.actionPermissionData.filter(data => {
      this.checkObj = {
        "id": data.id,
        "view": Boolean(data.view),
        "add": Boolean(data.add),
        "edit": Boolean(data.edit),
        "delete": Boolean(data.delete)
      }
      this.currentActionData.push(this.checkObj)
    })
    // console.log(this.checkObj);



    // this.currentActionData = this.currentActionData.filter(function (item, index, inputArray) {
    //   return inputArray.indexOf(item) == index;
    // });
    // console.log(this.currentActionData)

    try {
      this.submitted = true;
      let data = {
        "stateId": this.stateID,
        "roleId": this.roleID,
        "actions": this.currentActionData
      }
      // console.log(data);
      this.masterService.postData('assign_permission', data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  addPrivilegeModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  editPrivilegeModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  deletePrivilegeModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }

}
