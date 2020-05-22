import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss'],
  providers: [MasterService, CommonHelper, NgxSpinnerService]
})
export class InstitutionComponent implements OnInit {
  submitted = false;
  institutionData: any;
  hospitalFormNewData: any;
  addInstitutionForm: FormGroup;
  editInstitutionForm: FormGroup;
  editHosiptalForm: FormGroup
  selectedState: any;
  selectedDistrict: any;
  statesData: any;
  selectedTaluka: any;
  districtsData: any;
  talukasData: any;
  hospitals: any;
  dataTable: any;
  isStateExists: boolean;
  modalRef: BsModalRef;
  institutionNewFormData: any;
  institutionId: number;
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


  addInstitutionModal(template: TemplateRef<any>) {
    this.getDistricts(this.selectedState.id, 'addFilter');
    this.validationsForAddInstitution();
    this.submitted = false;
    this.modalRef = this.modalService.show(template);
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
          this.getInstitution(response.data[0].id);
          this.getDistricts(response.data[0].id, 'defaultFilter');
          this.isStateExists = true;
        } else {
          this.isStateExists = false;
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

  /**
   * Get districts data
   * @param stateId 
   */
  getDistricts(stateId: number, value: string) {
    try {
      this.masterService.getData('district/', stateId).subscribe((response: any) => {
        if (response.status) {
          if (response.data[0].districts.length > 0) {
            this.districtsData = response.data[0].districts;
            if (value === 'defaultFilter') {
              this.getTalukas(response.data[0].districts[0].districtId, value);
              this.selectedDistrict = response.data[0].districts[0];
            } else if (value === 'addFilter') {
              this.talukasData = [];
              this.addInstitutionForm.get('addInstitutionSelectDistrict').setValue([]);
              this.addInstitutionForm.get('addInstitutionSelectTaluka').setValue([]);
            } else {
              this.editInstitutionForm.get('editInstitutionSelectDistrict').setValue([]);
              this.editInstitutionForm.get('editInstitutionSelectTaluka').setValue([]);
              this.talukasData = [];
            }
          } else {
            this.districtsData = [];
            this.talukasData = [];
            if (value === 'defaultFilter') {
              this.selectedDistrict = [];
              this.selectedTaluka = [];
            } else if (value === 'addFilter') {
              this.addInstitutionForm.get('addInstitutionSelectTaluka').setValue([]);
              this.addInstitutionForm.get('addInstitutionSelectDistrict').setValue([]);
            } else {
              this.editInstitutionForm.get('editInstitutionSelectDistrict').setValue([]);
              this.editInstitutionForm.get('editInstitutionSelectTaluka').setValue([]);
            }
          }
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.modalRef.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
    * Get Talukas data
    * @param districtId 
    */
  getTalukas(districtId: any, value: string) {
    try {
      if (districtId) {
        this.masterService.getData('taluka/', districtId).subscribe((response: any) => {
          if (response.status) {
            this.spinner.hide();
            if (response.data.length && response.data[0].talukas.length) {
              this.talukasData = response.data[0].talukas;
              if (value === 'defaultFilter') {
                this.selectedTaluka = response.data[0].talukas[0];
              } else if (value === 'addFilter') {
                this.addInstitutionForm.get('addInstitutionSelectTaluka').setValue([]);
              } else {
                this.editInstitutionForm.get('editInstitutionSelectTaluka').setValue([]);
              }
            } else {
              this.talukasData = [];
              if (value === 'defaultFilter') {
                this.selectedTaluka = "Select Taluka";
              } else if (value === 'addFilter') {
                this.addInstitutionForm.get('addInstitutionSelectTaluka').setValue([]);
              } else {
                this.editInstitutionForm.get('editInstitutionSelectTaluka').setValue([]);
              }
            }
          } else {
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        });
      } else {
        this.talukasData = [];
      }

    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
   * validations for add Instituion
   */
  validationsForAddInstitution() {
    this.addInstitutionForm = this.fb.group({
      addInstitutionSelectState: [this.selectedState, Validators.required],
      addInstitutionSelectDistrict: [[], Validators.required],
      addInstitutionSelectTaluka: [[], Validators.required],
      addInstitutionName: ['', [Validators.required, Validators.maxLength(150)]],
      addInstitutionAddress: ['', [Validators.maxLength(200)]],
      addInstitutionContactNo: ['', [Validators.pattern(CommonConstants.mobileNumberRegex)]],
      addInstitutionStatus: [true]
    });
  }

  /**
  * Add form control function
  */
  get addInstitutionF() {
    return this.addInstitutionForm.controls;
  }

  /**
 * Add form control function
 */
  get editInstitutionF() {
    return this.editInstitutionForm.controls;
  }

  /**
   * addInstitution
   */
  addInstitution() {
    try {
      let apiData = this.addInstitutionForm.value,
        status = apiData.addInstitutionStatus ?  "active" : "inactive";
      this.submitted = true;
      if (this.addInstitutionForm.invalid) {
        return;
      }
      let data = {
        "stateId": apiData.addInstitutionSelectState.id,
        "districtId": apiData.addInstitutionSelectDistrict.districtId,
        "talukaId": apiData.addInstitutionSelectTaluka.talukaId,
        "name": apiData.addInstitutionName,
        "address": apiData.addInstitutionAddress,
        "primaryContactNumber": apiData.addInstitutionContactNo,
        "status": status
      }
      this.masterService.postData('institution', data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getInstitution(apiData.addInstitutionSelectState.id);
          this.selectedState = apiData.addInstitutionSelectState;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.modalRef.hide();
      });
    } catch (exc) {
    }
  }

  /**getInstituion
   * 
   * @param stateId 
   */
  getInstitution(stateId: number) {
    try {
      this.masterService.getData('institution/', stateId).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.data) {
            if (response.data[0].institutionList) {
              this.institutionData = response.data[0].institutionList;
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $("table");
              this.dataTable = table.DataTable().draw();
            }
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError("No Data Found");
          }
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

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }


  /**
   * update the status of instituion
   * @param stateForm 
   */
  institutionStatusValue(stateForm: any) {
    try {
      let status = stateForm.status === "active" ? "inactive" : "active",
        data = {
          status: status
        };
      this.masterService.putData('update_institution_status/', stateForm.institutionId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.getInstitution(this.selectedState.id);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
     * Modal popup for Edit
     * @param editDetails 
     * @param template 
     */
  openEditInstitutionModal(editDetails: any, template: TemplateRef<any>) {
    this.editGetDistricts(this.selectedState.id);
    this.editGetTalukas(editDetails.districts.districtId);
    this.institutionId = editDetails.institutionId
    this.submitted = false;
    this.modalRef = this.modalService.show(template);
    let status = editDetails.status === 'active' ? true : false;
    let newDistircts = [{ name: editDetails.districts.districtName, districtId: editDetails.districts.districtId }],
      newTalukas = [{ name: editDetails.talukas.talukaName, talukaId: editDetails.talukas.talukaId }];
    this.editInstitutionForm = this.fb.group({
      editInstitutionSelectState: this.selectedState,
      editInstitutionSelectDistrict: [newDistircts[0], Validators.required],
      editInstitutionSelectTaluka: [newTalukas[0], Validators.required],
      editInstitutionName: [editDetails.name, [Validators.required, Validators.maxLength(150)]],
      editInstitutionAddress: [editDetails.address, [Validators.maxLength(200)]],
      editInstitutionContactNo: [editDetails.primaryContactNumber, [Validators.pattern(CommonConstants.mobileNumberRegex)]],
      editInstitutionStatus: status
    });

  }

  editGetTalukas(districtId) {
    this.spinner.show();
    this.talukasData = [];
    this.masterService.getData('taluka/', districtId).subscribe((response: any) => {
      if (response.status) {
        if (response.data[0].talukas.length > 0) {
          this.spinner.hide();
          this.talukasData = response.data[0].talukas;
        } else {
          this.spinner.hide();
          this.talukasData = [];
        }
      } else {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, error => {
      this.spinner.hide();
    });
  }

  editGetDistricts(stateId) {
    this.spinner.show();
    this.districtsData = [];
    this.masterService.getData('district/', stateId).subscribe((response: any) => {
      if (response.status) {
        this.spinner.hide();
        if (response.data[0].districts.length > 0) {
          this.spinner.hide();
          this.districtsData = response.data[0].districts;
        } else {
          this.spinner.hide();
          this.districtsData = [];
        }
      } else {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }

    }, error => {
      this.spinner.hide();
    });
  }



  /**
   * Institution update
   */
  editInstitution() {
    try {
      this.submitted = true;
      if (this.editInstitutionForm.invalid) {
        return;
      }
      let apiData = this.editInstitutionForm.value,
        status = apiData.editInstitutionStatus ? "active" : 'inactive',
        data = {
          "stateId": apiData.editInstitutionSelectState.id,
          "districtId": apiData.editInstitutionSelectDistrict.districtId,
          "talukaId": apiData.editInstitutionSelectTaluka.talukaId,
          "name": apiData.editInstitutionName,
          "address": apiData.editInstitutionAddress,
          "status": status,
          "primaryContactNumber": apiData.editInstitutionContactNo
        }
      this.masterService.putData('institution/', this.institutionId, data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getInstitution(apiData.editInstitutionSelectState.id);
          this.selectedState = apiData.editInstitutionSelectState
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.modalRef.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  onStateChange(event: any, value: string) {
    if (event) {
      this.getDistricts(event.id, value);
    }
    if (value === 'defaultFilter') {
      this.getInstitution(event.id)
    }
  }

  onDistrictChange(event: any, value: string) {
    if (event) {
      this.getTalukas(event.districtId, value);
    }
  }
}
