import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../../master/services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../../shared/service/data.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [MasterService, CommonHelper]
})
export class UserComponent implements OnInit {
  modalRef: BsModalRef;
  submitted = false;
  userData: any;
  statesData: any;
  editDataUser: any;
  dataTable: any;
  errorOrResponse = false;
  detailUserForm: any;
  addressLine1: any;
  addressLine2: any;
  addressPinCode: any;
  addressDistricts: any;
  addressStates: any;
  currentAddressLine1: any;
  currentAddressLine2: any;
  currentAddressPinCode: any;
  currentAddressDistricts: any;
  selectedState: string = "";
  currentAddressStates: any;
  constructor(private modalService: BsModalService, public dataService: DataService, public router: Router, private masterService: MasterService, private chRef: ChangeDetectorRef, private commonHelper: CommonHelper, private spinner: NgxSpinnerService, private fb: FormBuilder
  ) { }


  ngOnInit() {
    // this.getStates();
    this.getUsers();
  }
  /**
    * Open modal Popup
    * @param template
    */
  addUserModal() {
    this.dataService.editUser = "addUserDetails";
    this.router.navigate(['/manage-user']);
  }

  /*get states*/
  getStates() {
    try {
      this.spinner.show();
      this.errorOrResponse = false;
      this.masterService.getAll('active_states').subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.data.length != 0) {
            this.statesData = response.data;
            this.errorOrResponse = true;
          } else {
            this.statesData = []
            this.errorOrResponse = true;
          }
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          this.statesData = [];
          this.errorOrResponse = true;
          // this.detectTableChanges();
          this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
          this.spinner.hide();
        }
      });

    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
    setTimeout(() => {
      this.spinner.hide();
      if (this.errorOrResponse == false) {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, 40000)
  }


  /*get user list*/
  getUsers() {
    try {
      this.spinner.show();
      this.errorOrResponse = false;
      this.masterService.getAll('user').subscribe((response: any) => {
        if (response) {
          if (response.data.length > 0) {
            this.spinner.hide();
            this.userData = response.data;
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $('table');
            this.dataTable = table.DataTable().draw();
            this.errorOrResponse = true;
          } else {
            this.userData = [];
            this.reploatingDataTable();
            this.errorOrResponse = true;
            this.chRef.detectChanges();
            const table: any = $('table');
            this.dataTable = table.DataTable().draw();
            this.spinner.hide();
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
          // }
          // else {
          //   this.userData = [];
          //   this.reploatingDataTable();
          //   this.chRef.detectChanges();
          //   const table: any = $('table');
          //   this.dataTable = table.DataTable().draw();
          //   this.spinner.hide();
          //   this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          // }
        } else {
          this.spinner.hide();
          this.errorOrResponse = true;
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
    setTimeout(() => {
      this.spinner.hide();
      if (this.errorOrResponse == false) {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, 40000)
  }

  /*validation rules*/
  editUserModal(formData: any, template: TemplateRef<any>) {
    this.dataService.editUser = "editUserDetails";
    this.dataService.getUserDetails(formData);
    this.router.navigate(['/manage-user'])
  }


  /**
  * updating the status of the district
  * @param districtvalues 
  */
  userStatus(uservalues: any) {
    try {
      this.spinner.show();
      this.errorOrResponse = false;
      let status = uservalues.status === 'active' ? "inactive" : "active",
        data = {
          "status": status
        }
      this.masterService.putData('update_user_status/', uservalues.id, data).subscribe((response: any) => {
        if (response) {
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          this.getUsers();
          this.errorOrResponse = true;
        } else {
          this.spinner.hide();
          this.errorOrResponse = true;
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
    setTimeout(() => {
      this.spinner.hide();
      if (this.errorOrResponse == false) {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, 40000)
  }
  userDescriptionModal(template: TemplateRef<any>, formData) {
    this.addressLine1 = "";
    this.addressLine2 = "";
    this.addressPinCode = "";
    this.addressDistricts = "";
    this.addressStates = "";
    this.currentAddressLine1 = "";
    this.currentAddressLine2 = "";
    this.currentAddressPinCode = "";
    this.currentAddressDistricts = "";
    this.currentAddressStates = "";
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'modal-lg' }));
    formData.addresses.forEach(element => {
      if (element.type == "permanent") {
        this.addressLine1 = element.addressLine1;
        this.addressLine2 = element.addressLine2;
        this.addressPinCode = element.pinCode;
        this.addressDistricts = element.districts;
        this.addressStates = element.states;
      }
      if (element.type == "current") {
        this.currentAddressLine1 = element.addressLine1;
        this.currentAddressLine2 = element.addressLine1;
        this.currentAddressPinCode = element.pinCode;
        this.currentAddressDistricts = element.districts;
        this.currentAddressStates = element.states;
      }
    });
    this.detailUserForm = formData;
  }
  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }

  onStateChange(event: any, filter: string) {

  }
}
