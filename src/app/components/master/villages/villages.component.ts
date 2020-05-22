
import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MasterService } from '../services/master-service';
import { CommonConstants } from '../../../shared/constants'
import { CommonHelper } from '../../../helper/helper.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-villages",
  templateUrl: "./villages.component.html",
  styleUrls: ["./villages.component.scss"],
  providers: [MasterService, CommonHelper]
})

export class VillagesComponent implements OnInit {
  submitted = false;
  addVillageForm: FormGroup;
  editVillageForm: FormGroup;
  submittedAddVillageForm = false;
  villagesData: any;
  dataTable: any;
  modalRef: BsModalRef;
  selectedState: any;
  statesData: any;
  isTalukaExists: boolean = false;
  selectedDistrict: any;
  districtsData: any;
  villageId: number;
  isDistrictsExists: boolean = false;
  selectedTaluka: any;
  talukasData: any;
  villageAddStatus: any;
  validationLength: Number;
  villageFormNewData: any;
  constructor(
    private modalService: BsModalService,
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  /**
   * Add form control function
   */
  get addVillageF() {
    return this.addVillageForm.controls;
  }

  /**
   * Edit form control function
   */
  get editVillageF() {
    return this.editVillageForm.controls;
  }

  ngOnInit() {
    this.validationLength = CommonConstants.MaxValidation;
    this.getStates();
  }


  /**
   * Opening Modal popup for add
   * @param template 
   */
  openModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.modalRef = this.modalService.show(template);
    this.masterService.getAll('states').subscribe((response: any) => {
      if (response.data) {
        this.addVillageForm = this.fb.group({
          addSelectState: [this.selectedState, Validators.required],
          addSelectDistrict: [this.selectedDistrict, Validators.required],
          addSelectTaluka: [this.selectedTaluka, Validators.required],
          addVillageName: ['', [Validators.required, Validators.maxLength(100)]],
          addDisplayName: ['', Validators.maxLength(100)],
          addVillageId: ['', Validators.required],
          addVillageDescription: ['', Validators.maxLength(100)],
          addVillageStatus: [true],
        });
        this.statesData = response.data;
      }
    });
  }


  /**
   * Modal popup for Edit
   * @param editDetails 
   * @param template 
   */
  openEditVillageModal(editDetails: any, template: TemplateRef<any>) {
    this.villageId = editDetails.villageId;
    this.modalRef = this.modalService.show(template);
    this.submitted = false;
    let status = editDetails.status === 'active' ? true : false;
    this.editVillageForm = this.fb.group({
      editSelectState: [this.selectedState],
      editSelectDistrict: [this.selectedDistrict],
      editSelectTaluka: [this.selectedTaluka, Validators.required],
      editVillageName: [editDetails.name, [Validators.required, Validators.maxLength(100)]],
      editVillageId: [editDetails.code, [Validators.required, Validators.maxLength(100)]],
      ediVillageDisplayName: [editDetails.displayName, Validators.maxLength(100)],
      editVillageDescription: [editDetails.description, Validators.maxLength(100)],
      editVillageStatus: status,
    });
  }


  /**
   * Village update
   */
  villageEdit() {
    try {
      this.submitted = true;
      if (this.editVillageForm.invalid) {
        return;
      }
      // if (this.editVillageForm.value.editSelectDistrict === 'Select District') {
      //   return;
      // }
      // if (this.editVillageForm.value.editSelectTaluka === 'Select Taluka') {
      //   return;
      // }
      let apiData = this.editVillageForm.value,
        status = apiData.editVillageStatus ? "active" : 'inactive',
        data = {
          "stateId": apiData.editSelectState.id,
          "districtId": apiData.editSelectDistrict.districtId,
          "talukaId": apiData.editSelectTaluka.talukaId,
          "code": apiData.editVillageId,
          "name": apiData.editVillageName,
          "displayName": apiData.ediVillageDisplayName,
          "description": apiData.editVillageDescription,
          "status": status,
          "villageId": apiData.editVillageId
        }
      this.masterService.putData('village/', this.villageId, data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getEditVillages();
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
   * Get States data
   */
  getStates() {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.selectedState = response.data[0];
            this.statesData = response.data;
            this.getDistricts(response.data[0].id, 'selectChange');
            this.addVillageForm = this.fb.group({
              addSelectState: [this.selectedState, Validators.required],
              addSelectDistrict: [this.selectedDistrict, Validators.required],
              addSelectTaluka: [this.selectedTaluka, Validators.required],
              addVillageName: ['', [Validators.required, Validators.maxLength(100)]],
              addDisplayName: ['', Validators.maxLength(100)],
              addVillageId: ['', Validators.required],
              addVillageDescription: ['', Validators.maxLength(100)],
              addVillageStatus: [true]
            });
          } else {
            this.statesData = [];
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table = $('table');
            this.dataTable = table.DataTable().draw();
            this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
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


  /**
   * Passing first three digits from Village as code
   * @param event 
   */
  villageEnter(event: any) {
    this.addVillageForm.get('addVillageId').setValue(event.substring(0, 3));
  }

  /**
   * Village Change Edit event
   * @param event 
   */
  villageEditEnter(event) {
    this.editVillageForm.get('editVillageId').setValue(event.substring(0, 3));
  }

  /**
   * Get districts data
   * @param stateId 
   */
  getDistricts(stateId, value) {
    try {
      this.masterService.getData('district/', stateId).subscribe((response: any) => {
        if (response.status) {
          if (response.data) {
            if (response.data[0].districts.length > 0) {
              if (value === 'selectChange') {
                this.selectedDistrict = response.data[0].districts[0];
                this.districtsData = response.data[0].districts;
                this.isDistrictsExists = true;
                this.getTalukas(response.data[0].districts[0].districtId, value);
              } else if (value === 'addChange') {
                this.districtsData = response.data[0].districts;
                this.addVillageForm.get('addSelectDistrict').setValue(response.data[0].districts[0]);
                this.getTalukas(response.data[0].districts[0].districtId, value);
              } else if (value === 'editChange') {
                this.districtsData = response.data[0].districts;
                this.editVillageForm.get('editSelectDistrict').setValue(response.data[0].districts[0]);
                this.getTalukas(response.data[0].districts[0].districtId, value);
              }
            } else {
              this.commonHelper.toasterMessageError(CommonConstants.districtsMessage);
              this.spinner.hide();
              this.getTalukas('', value);
              this.districtsData = [];
              if (value === 'addChange') {
                this.addVillageForm.get('addSelectDistrict').setValue([]);
              } else if (value === 'editChange') {
                this.editVillageForm.get('editSelectDistrict').setValue([]);
              } else {
                this.isDistrictsExists = true;
                this.selectedDistrict = [];
                this.selectedTaluka = [];
              }
            }
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        } else {
          this.spinner.hide();
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
  getTalukas(districtId, value) {
    try {
      if (districtId) {
        this.masterService.getData('taluka/', districtId).subscribe((response: any) => {
          if (response.status) {
            this.spinner.hide();
            if (response.data[0].talukas.length > 0) {
              if (value === 'selectChange') {
                if (response.data.length && response.data[0].talukas.length) {
                  this.getVillages(response.data[0].talukas[0].talukaId);
                  this.talukasData = response.data[0].talukas;
                  this.chRef.detectChanges();
                  const table: any = $("table");
                  this.dataTable = table.DataTable().draw();
                  this.selectedTaluka = response.data[0].talukas[0];
                  this.isTalukaExists = true;
                  this.isDistrictsExists = true;
                } else {
                  this.isTalukaExists = false;
                  this.getVillages('');
                }
              } else if (value === 'addChange') {
                this.talukasData = response.data[0].talukas;
                this.addVillageForm.get('addSelectTaluka').setValue(response.data[0].talukas[0]);
              } else if (value === 'editChange') {
                this.talukasData = response.data[0].talukas;
                this.editVillageForm.get('editSelectTaluka').setValue(response.data[0].talukas[0]);
              }
            } else {
              this.commonHelper.toasterMessageError(CommonConstants.talukasMessage);
              this.spinner.hide();
              if (value === 'addChange') {
                this.addVillageForm.get('addSelectTaluka').setValue([]);
              } else if (value === 'editChange') {
                this.editVillageForm.get('editSelectTaluka').setValue([]);
              } else {
                this.selectedTaluka = [];
                this.talukasData = [];
                this.isTalukaExists = false;
                this.isDistrictsExists = false;
                this.getVillages('');
                this.chRef.detectChanges();
                const table: any = $("table");
                this.dataTable = table.DataTable().draw();
              }
            }
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        }, error => {
          this.modalRef.hide();
        });
      } else {
        this.spinner.hide();
        this.talukasData = [];
        if (value === 'addChange') {
          this.addVillageForm.get('addSelectTaluka').setValue([]);
        } else if (value === 'editChange') {
          this.editVillageForm.get('editSelectTaluka').setValue([]);
        } else {
          this.selectedTaluka = '';
          this.isTalukaExists = false;
          this.isDistrictsExists = false;
          this.getVillages('');
          this.chRef.detectChanges();
          const table: any = $("table");
          this.dataTable = table.DataTable().draw();
          this.selectedTaluka = '';
        }
      }
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * Get villages data
   * @param talukaId 
   */
  getVillages(talukaId) {
    try {
      if (talukaId) {
        this.masterService.getData('village/', talukaId).subscribe((response: any) => {
          if (response.status) {
            if (response.data.length) {
              this.reploatingDataTable();
              this.villagesData = response.data[0].villages;
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
            } else {
              this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
            }
          } else {
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        });
      } else {
        this.reploatingDataTable();
        this.villagesData = [];
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable().draw();
      }

    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }


  /**
   *updating the status of the Village 
   * @param stateForm 
   */
  villageStatusValue(stateForm: any) {
    try {
      let status = stateForm.status === "active" ? "inactive" : "active",
        data = {
          status: status
        };
      this.masterService.putData('update_village_status/', stateForm.villageId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.getVillages(this.selectedTaluka.talukaId);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /*state change event*/
  onStateChange(event, value) {
    if (event) {
      this.getDistricts(event.id, value);
    }
  }

  /*District change event*/
  onDistrictChange(event, value) {
    if (event) {
      this.getTalukas(event.districtId, value);
    }
  }

  /*village change event*/
  onTalukaChange(event) {
    if (event) {
      this.getVillages(event.talukaId)
    }
  }


  /* Add Village Function */
  villageAdd() {
    try {
      this.submitted = true;
      if (this.addVillageForm.invalid) {
        return;
      }
      // if (this.addVillageForm.value.addSelectDistrict === 'Select District') {
      //   return;
      // }
      // if (this.addVillageForm.value.addSelectTaluka === 'Select Taluka') {
      //   return;
      // }
      let status = this.addVillageForm.value.addVillageStatus ? 'active' : 'inactive',
        data = {
          "stateId": this.addVillageForm.value.addSelectState.id,
          "districtId": this.addVillageForm.value.addSelectDistrict.districtId,
          "talukaId": this.addVillageForm.value.addSelectTaluka.talukaId,
          "code": this.addVillageForm.value.addVillageId,
          "name": this.addVillageForm.value.addVillageName,
          "status": status,
          "displayName": this.addVillageForm.value.addDisplayName,
          "description": this.addVillageForm.value.addVillageDescription
        }
      this.masterService.postData('village', data).subscribe((response: any) => {
        if (response.data) {
          this.commonHelper.toasterMessage(response.message);
          this.getAddVillages();
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  //village Delete(village)
  villageDeleteModal(template: TemplateRef<any>, villageFormData: any) {
    this.villageFormNewData = villageFormData;
    this.modalRef = this.modalService.show(template);
  }


  /**
   * Deleting the Village
   * @param value 
   */
  deleteVillage(value: Boolean) {
    try {
      if (value) {
        this.masterService.delete('village/', this.villageFormNewData.villageId).subscribe((response: any) => {
          if (response.status) {
            this.commonHelper.toasterMessage(response.message);
            this.getVillages(this.selectedTaluka.talukaId);
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
   * Function to get data after create and edit village
   */
  getAddVillages() {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.data) {
          this.selectedState = this.addVillageForm.value.addSelectState;
          this.statesData = response.data;
          this.masterService.getData('district/', this.addVillageForm.value.addSelectState.id)
            .subscribe((districtResponse: any) => {
              if (districtResponse.data) {
                this.selectedDistrict = this.addVillageForm.value.addSelectDistrict;
                this.districtsData = districtResponse.data[0].districts;
                this.masterService.getData('taluka/', this.addVillageForm.value.addSelectDistrict.districtId)
                  .subscribe((talukaResponse: any) => {
                    if (talukaResponse.data) {
                      this.selectedTaluka = this.addVillageForm.value.addSelectTaluka;
                      this.talukasData = talukaResponse.data[0].talukas;
                      this.masterService.getData('village/', this.addVillageForm.value.addSelectTaluka.talukaId)
                        .subscribe((villageResponse: any) => {
                          if (villageResponse.status) {
                            this.spinner.hide();
                            this.modalRef.hide();
                            if (villageResponse.data.length) {
                              this.reploatingDataTable();
                              this.villagesData = villageResponse.data[0].villages;
                              this.chRef.detectChanges();
                              const table: any = $('table');
                              this.dataTable = table.DataTable().draw();
                            }
                          }
                        });
                    }
                  });
              }
            });
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
   * Function to get data after create and edit village
   */
  getEditVillages() {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.data) {
          this.selectedState = this.editVillageForm.value.editSelectState;
          this.statesData = response.data;
          this.masterService.getData('district/', this.editVillageForm.value.editSelectState.id)
            .subscribe((districtResponse: any) => {
              if (districtResponse.data) {
                this.selectedDistrict = this.editVillageForm.value.editSelectDistrict;
                this.districtsData = districtResponse.data[0].districts;
                this.masterService.getData('taluka/', this.editVillageForm.value.editSelectDistrict.districtId)
                  .subscribe((talukaResponse: any) => {
                    if (talukaResponse.data) {
                      this.selectedTaluka = this.editVillageForm.value.editSelectTaluka;
                      this.talukasData = talukaResponse.data[0].talukas;
                      this.masterService.getData('village/', this.editVillageForm.value.editSelectTaluka.talukaId)
                        .subscribe((villageResponse: any) => {
                          if (villageResponse.status) {
                            this.spinner.hide();
                            if (villageResponse.data.length) {
                              this.reploatingDataTable();
                              this.villagesData = villageResponse.data[0].villages;
                              this.chRef.detectChanges();
                              const table: any = $('table');
                              this.dataTable = table.DataTable().draw();
                            }
                          }
                        });
                    }
                  });
              }
            });
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


}
