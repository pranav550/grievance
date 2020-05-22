import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { debug } from 'util';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss'],
  providers: [MasterService, NgxSpinnerService, CommonHelper]
})
export class HospitalComponent implements OnInit {
  isDistrictsExists: boolean;
  isTalukaExists: boolean;
  submitted = false;
  hospitalFormNewData: any;
  hosiptalRegisterForm: FormGroup;
  editHosiptalForm: FormGroup;
  selectedState: any;
  selectedDistrict: any;
  statesData: any;
  isStateExists: boolean;
  selectedTaluka: any;
  districtsData: any;
  talukasData: any;
  hospitals: any;
  permissions_view: boolean;
  permissions_add: boolean;
  permissions_delete: boolean;
  permissions_update: boolean;
  dataTable: any;
  hospitalId: number;
  modalRef: BsModalRef;
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

  /**
   * Add form control function
   */
  get addHospitalF() {
    return this.hosiptalRegisterForm.controls;
  }

  get editHospitalF() {
    return this.editHosiptalForm.controls;
  }

  /**addHospitalValidations
   * 
   */
  validationsForAddHospital() {
    this.submitted = false;
    this.hosiptalRegisterForm = this.fb.group({
      addHosptialName: ['', [Validators.required, Validators.maxLength(250)]],
      addHosptialId: ['', Validators.required],
      addHospitalSelectState: [this.selectedState, Validators.required],
      addHospitalSelectDistrict: [[], Validators.required],
      addHospitalSelectTaluka: [[], Validators.required],
      addHosptialDisplayName: ['', [Validators.maxLength(250)]],
      addHospitalDescription: ['', Validators.maxLength(250)],
      addHospitalStatus: [true]
    });
  }

  /**
   * addHospitalModel
   * @param template 
   */
  addHospitalModal(template: TemplateRef<any>) {
    this.getDistricts(this.selectedState.id, 'addChange');
    this.validationsForAddHospital();
    this.modalRef = this.modalService.show(template);
  }

  /**
   * editModal
   * @param hospitalData 
   * @param template 
   */
  openEditHospitalModal(hospitalData: any, template: TemplateRef<any>) {
    this.editGetDistricts(this.selectedState.id);
    this.editGetTalukas(hospitalData.districts.districtId);
    this.hospitalId = hospitalData.hospitalId;
    let status = hospitalData.status === 'active' ? true : false;
    this.modalRef = this.modalService.show(template);
    this.submitted = false;
    let newDistircts = [{ name: hospitalData.districts.districtName, districtId: hospitalData.districts.districtId }],
      newTalukas = [{ name: hospitalData.talukas.talukaName, talukaId: hospitalData.talukas.talukaId }];
    this.editHosiptalForm = this.fb.group({
      editHospitalSelectState: this.selectedState,
      editHospitalSelectDistrict: [newDistircts[0], Validators.required],
      editHospitalSelectTaluka: [newTalukas[0], Validators.required],
      editHosptialName: [hospitalData.name, [Validators.required, Validators.maxLength(100)]],
      editHosptialId: [hospitalData.code, Validators.required],
      editHosptialDisplayName: [hospitalData.displayName, [Validators.maxLength(250)]],
      editHospitalDescription: [hospitalData.description, Validators.maxLength(250)],
      editHospitalStatus: [status]
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
   * updateHospitalDetails
   */
  updateHospital() {
    try {
      this.submitted = true;
      if (this.editHosiptalForm.invalid) {
        return;
      }
      // this.getDistricts(this.editHosiptalForm.value.editHospitalSelectState.id, '');
      let apiData = this.editHosiptalForm.value,
        status = apiData.editHospitalStatus ? "active" : 'inactive',
        data = {
          "stateId": apiData.editHospitalSelectState.id,
          "districtId": apiData.editHospitalSelectDistrict.districtId,
          "talukaId": apiData.editHospitalSelectTaluka.talukaId,
          "code": apiData.editHosptialId,
          "name": apiData.editHosptialName,
          "description": apiData.editHospitalDescription,
          "displayName": apiData.editHosptialDisplayName,
          "status": status
        }
      this.spinner.show();
      this.masterService.putData('hospital/', this.hospitalId, data).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.selectedState = apiData.editHospitalSelectState;
          this.getHospitals(apiData.editHospitalSelectState.id);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
   * hospitalDeleteModal
   * @param template
   * @param hospitalData 
   */
  hospitalDeleteModal(template: TemplateRef<any>, hospitalData: any) {
    this.modalRef = this.modalService.show(template);
    this.hospitalFormNewData = hospitalData;
  }

  /**
  * Get States data
  */
  getStates() {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.data.length > 0) {
          let selectedVal: any;
          response.data.forEach(element => {
            if (element.id == CommonConstants.stateId) {
              selectedVal = element;
            }
          });

          this.selectedState = selectedVal;
          this.statesData = response.data;
          this.getDistricts(response.data[0].id, 'selectChange');
          this.getHospitals(this.selectedState.id);
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
        if (response.data.length > 0) {
          if (response.data[0].districts.length > 0) {
            this.isDistrictsExists = true;
            this.districtsData = response.data[0].districts;
            if (value === 'editChange') {
              this.editHosiptalForm.get('editHospitalSelectDistrict').setValue([]);
              this.editHosiptalForm.get('editHospitalSelectTaluka').setValue([]);
              this.talukasData = [];
            } else if (value === 'addChange') {
              this.talukasData = [];
              this.hosiptalRegisterForm.get('addHospitalSelectDistrict').setValue([]);
              this.hosiptalRegisterForm.get('addHospitalSelectTaluka').setValue([]);
            } else {
              this.getTalukas(response.data[0].districts[0].districtId, value);
              this.selectedDistrict = response.data[0].districts[0];
            }
          } else {
            this.districtsData = [];
            this.talukasData = [];
            if (value === 'addChange') {
              this.hosiptalRegisterForm.get('addHospitalSelectDistrict').setValue([]);
              this.hosiptalRegisterForm.get('addHospitalSelectTaluka').setValue([]);
            } else if (value === 'editChange') {
              this.editHosiptalForm.get('editHospitalSelectTaluka').setValue([]);
              this.editHosiptalForm.get('editHospitalSelectDistrict').setValue([]);
            } else {
              this.isDistrictsExists = false;
              this.selectedDistrict = [];
              this.selectedTaluka = [];
            }
          }
        } else {
          this.spinner.hide();
        }
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
            if (response.data.length && response.data[0].talukas.length > 0) {
              this.isTalukaExists = true;
              this.talukasData = response.data[0].talukas;
              this.selectedTaluka = response.data[0].talukas[0];
              if (value === 'editChange') {
                this.editHosiptalForm.get('editHospitalSelectTaluka').setValue([]);
              } else if (value === 'addChange') {
                this.hosiptalRegisterForm.get('addHospitalSelectTaluka').setValue([]);
              } else {
                this.selectedTaluka = response.data[0].talukas[0];
              }
            } else {
              this.talukasData = [];
              if (value === 'addChange') {
                this.hosiptalRegisterForm.get('addHospitalSelectTaluka').setValue([]);
              } else if (value === 'editChange') {
                this.editHosiptalForm.get('editHospitalSelectTaluka').setValue([]);
              } else {
                this.isTalukaExists = false;
                this.selectedTaluka = [];
              }
            }
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        });
      } else {
        this.talukasData = [];
        if (value === 'addChange') {
          this.hosiptalRegisterForm.get('addHospitalSelectTaluka').setValue([]);
        } else if ('editChange') {
          this.editHosiptalForm.get('editHospitalSelectTaluka').setValue([]);
        } else {
          this.selectedTaluka = [];
        }
      }
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
   * getHospitals
   * @param stateId 
   */
  getHospitals(stateId: number) {
    try {
      this.masterService.getData('hospital/', stateId).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.data.length > 0) {
            if (response.data[0].hospitals) {
              this.hospitals = response.data[0].hospitals;
              this.permissions_view = Boolean(response.data[0].permissions.view)
              this.permissions_add = Boolean(response.data[0].permissions.add)
              this.permissions_update = Boolean(response.data[0].permissions.edit)
              this.permissions_delete = Boolean(response.data[0].permissions.delete)

              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $("table");
              this.dataTable = table.DataTable().draw();
            }
          } else {
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**addHospital
   * 
   */
  addHospital() {
    try {
      let apiData = this.hosiptalRegisterForm.value,
        status = apiData.addHospitalStatus ? 'active' : 'inactive';
      this.submitted = true;
      if (this.hosiptalRegisterForm.invalid) {
        return;
      }
      let data = {
        "stateId": apiData.addHospitalSelectState.id,
        "districtId": apiData.addHospitalSelectDistrict.districtId,
        "talukaId": apiData.addHospitalSelectTaluka.talukaId,
        "code": apiData.addHosptialId,
        "name": apiData.addHosptialName,
        "description": apiData.addHospitalDescription,
        "displayName": apiData.addHosptialDisplayName,
        "status": status
      }
      this.masterService.postData('hospital', data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.selectedState = apiData.addHospitalSelectState;
          this.getHospitals(apiData.addHospitalSelectState.id);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.spinner.hide();
    }
  }

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }

  /**
   * update the status of hospital
   * @param stateForm 
   */
  hospitalStatusValue(stateForm: any) {
    try {
      let status = stateForm.status === "active" ? "inactive" : "active",
        data = {
          status: status
        };
      this.masterService.putData('update_hospital_status/', stateForm.hospitalId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.getHospitals(this.selectedState.id);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
   * 
   * @param value 
   */
  deleteHospital(value: boolean) {
    try {
      if (value) {
        this.spinner.show();
        this.masterService.delete('hospital/', this.hospitalFormNewData.hospitalId).subscribe((response: any) => {
          if (response.status) {
            this.spinner.hide();
            this.commonHelper.toasterMessage(response.message);
            this.getHospitals(this.selectedState.id);
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
   * change event
   * @param event 
   */
  hospitalEnter(event: any) {
    this.hosiptalRegisterForm.get('addHosptialId').setValue(event.substring(0, 3));
  }

  /**
   * 
   * @param event 
   * @param value 
   */
  onStateChange(event, value) {
    if (event) {
      this.getDistricts(event.id, value);
    }
    if (value === 'selectChange') {
      this.getHospitals(event.id);
    }
  }

  /*District change event*/
  onDistrictChange(event, value) {
    if (event) {
      this.getTalukas(event.districtId, value);
    }
  }
}


