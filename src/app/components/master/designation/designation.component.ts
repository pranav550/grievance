import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss'],
  providers: [MasterService, CommonHelper, NgxSpinnerService]
})
export class DesignationComponent implements OnInit {
  designationData: any;
  submitted = false;
  modalRef: BsModalRef;
  addGrievanceNature: any;
  grievanceNature: any;
  selectedState: any;
  statesData: any;
  isStateExists: boolean;
  designations: any;
  addDesignationForm: FormGroup;
  dataTable: any;
  editDesignationForm: FormGroup;
  constructor(
    private modalService: BsModalService,
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getStates();
  }

  addDesignationModal(template: TemplateRef<any>) {
    this.validationsForAddDesignations();
    this.modalRef = this.modalService.show(template);
  }

  /**
 * Add form control function
 */
  get addDesginationF() {
    return this.addDesignationForm.controls;
  }

  /**
 * Get States data
 */
  getStates() {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.data.length > 0) {
          this.selectedState = response.data[0];
          this.statesData = response.data;
          this.getDesignations(this.selectedState.id);
          this.isStateExists = true;
        } else {
          this.statesData = [];
          this.reploatingDataTable();
          this.chRef.detectChanges();
          const table: any = $("table");
          this.dataTable = table.DataTable().draw();
          this.isStateExists = false;
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
          this.statesData = [];
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**addDesignationValidations
  * 
  */
  validationsForAddDesignations() {
    this.submitted = false
    this.addDesignationForm = this.fb.group({
      addDesignationSelectedState: [this.selectedState, Validators.required],
      addDesignationName: ['', [Validators.required, Validators.maxLength(100)]],
      addDesignationDescription: ['', Validators.maxLength(150)],
      addDesignationStatus: [true]
    });
  }

  /**add Designation API call 
   * 
   */
  addDesgination() {
    try {
      let apiData = this.addDesignationForm.value,
        status = apiData.addDesignationStatus ? 'active' : 'inactive';
      this.submitted = true;
      if (this.addDesignationForm.invalid) {
        return;
      }
      let data = {
        "stateId": apiData.addDesignationSelectedState.id,
        "name": apiData.addDesignationName,
        "description": apiData.addDesignationDescription,
        "status": status
      }
      this.masterService.postData('designation', data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getDesignations(apiData.addDesignationSelectedState.id);
          this.selectedState = apiData.addDesignationSelectedState;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /** get designations
   * 
   * @param stateId 
   */
  getDesignations(stateId: number) {
    try {
      this.masterService.getData('designation/', stateId).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.data) {
            if (response.data[0].designations) {
              this.designations = response.data[0].designations;
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $("table");
              this.dataTable = table.DataTable().draw();
            } else {
              this.commonHelper.toasterMessageError("No Data found");
            }
          } else {

          }
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }
  /**update designation modal popup open
   * 
   * @param template 
   * @param formData 
   */
  editDesignationModal(template: TemplateRef<any>, formData: any) {
    this.designationData = formData;
    let status = formData.status ? true : false;
    this.modalRef = this.modalService.show(template);
    this.submitted = false;
    this.editDesignationForm = this.fb.group({
      editDesignationSelectedState: this.selectedState,
      editDesignationName: [formData.name, [Validators.required, Validators.maxLength(100)]],
      editDesignationDescription: [formData.description, Validators.maxLength(150)],
      editDesignationStatus: status
    });
  }
  /**
   * edit form control function
   */
  get editDesginationF() {
    return this.editDesignationForm.controls;
  }

  /**update designation
   * 
   */
  updateDesignation() {
    try {
      this.submitted = true;
      if (this.editDesignationForm.invalid) {
        return;
      }
      let apiData = this.editDesignationForm.value,
        status = apiData.editDesignationStatus ? "active" : 'inactive',
        data = {
          "stateId": apiData.editDesignationSelectedState.id,
          "name": apiData.editDesignationName,
          "description": apiData.editDesignationDescription,
          "status": status
        }
      this.masterService.putData('designation/', this.designationData.designationsId, data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getDesignations(this.selectedState.id);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    }
    catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**designation status
   * 
   * @param formData 
   */
  designationStatus(formData: any) {
    try {
      let status = formData.status === "active" ? "inactive" : "active",
        data = {
          status: status
        };
      this.masterService.putData('update_designation_status/', formData.designationsId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.getDesignations(this.selectedState.id);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /**state change
   * 
   * @param event 
   */
  onStateChange(event) {
    if (event) {
      this.getDesignations(event.id);
    }
  }
}
