import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { MasterService } from '../services/master-service'
import { CommonConstants } from '../../../shared/constants'
import { CommonHelper } from '../../../helper/helper.component';
@Component({
  selector: 'app-taluka-sub-districts',
  templateUrl: './taluka-sub-districts.component.html',
  styleUrls: ['./taluka-sub-districts.component.scss'],
  providers: [MasterService, CommonHelper, NgxSpinnerService]
})

export class TalukaSubDistrictsComponent implements OnInit {
  submitted = false;
  editTalukaForm: FormGroup;
  addTalukaForm: FormGroup;
  submittedAddTalukaForm = false;
  dataTable: any;
  deleteId: any;
  talukaId: number;
  AddTalukaID: boolean = false;
  modalRef: BsModalRef;
  districtName: any;
  selectedStateEvent: any;
  selectedDistrictEvent: any;
  selectedState: any;
  talukaData: any;
  statesData: any;
  selectedDistrict: any;
  validationLength: Number;
  districtsData: any;
  isTalukaDataExists: boolean = false;
  talukasValueOfID = {
    talukaValue: ''
  }

  constructor(private modalService: BsModalService, private masterService: MasterService, private commonHelper: CommonHelper, private chRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private fb: FormBuilder) { }

  ngOnInit() {
    this.validationLength = CommonConstants.MaxValidation;
    this.getStates();
  }

  /**
   * open modal for add taluka
   * @param template 
   */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.submitted = false;
    this.addTalukaForm = this.fb.group({
      addTalukaSelectedState: [this.selectedStateEvent, Validators.required],
      addTalukaSelectedDistrict: [this.selectedDistrictEvent, Validators.required],
      addTalukaTalukaName: ['', [Validators.required, Validators.maxLength(100)]],
      addTalukaTalukaValue: ['', Validators.maxLength(100)],
      addTalukaDisplayName: ['', Validators.maxLength(100)],
      addTalukaDescription: ['', Validators.maxLength(100)],
      addTalukaStatus: [true, Validators.required]
    });
  }


  /**
   * Modal for edit taluka
   * @param talukaData 
   * @param template 
   */
  editTalukaModal(talukaData: any, template: TemplateRef<any>) {
    this.submitted = false;
    this.talukaId = talukaData.talukaId;
    let status = talukaData.status === "active" ? true : false;
    this.editTalukaForm = this.fb.group({
      editTalukaSelectedState: [this.selectedStateEvent],
      editTalukaSelectedDistrict: [this.selectedDistrictEvent, Validators.required],
      editTalukaTalukaName: [talukaData.name, [Validators.required, Validators.maxLength(100)]],
      editTalukaTalukaId: [talukaData.code, [Validators.required, Validators.maxLength(100)]],
      editTalukaDisplayName: [talukaData.displayName, Validators.maxLength(100)],
      editTalukaDescription: [talukaData.description, Validators.maxLength(100)],
      editTalukaStatus: [status, Validators.required]
    });
    this.modalRef = this.modalService.show(template);
  }


  /**
   * delete Taluka Modal Popup 
   * @param talukaData 
   * @param template 
   */
  deleteTalukaModal(talukaData: any, template: TemplateRef<any>) {
    this.deleteId = talukaData;
    this.modalRef = this.modalService.show(template);
  }

  /**
   * deleteTaluka
   * @param value 
   */
  deleteTaluka(value: boolean) {
    try {
      if (value) {
        this.masterService.delete('taluka/', this.deleteId.talukaId).subscribe((response: any) => {
          if (response.status) {
            this.modalRef.hide();
            this.commonHelper.toasterMessage(response.message);
            this.getTalukas(this.selectedDistrictEvent.districtId);
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
   * Taluka edit name change
   * @param event 
   */
  talukaEditEnter(event) {
    this.editTalukaForm.get('editTalukaTalukaId').setValue(event.substring(0, 3));
  }

  /**
   * taluka add name change
   * @param event 
   */
  talukaNameEnter(event: any) {
    this.addTalukaForm.get('addTalukaTalukaValue').setValue(event.substring(0, 3));
  }


  /**
   * Get states data
   */
  getStates() {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.data.length > 0) {
          this.selectedStateEvent = response.data[0];
          this.statesData = response.data;
          this.getDistricts(response.data[0].id, 'defaultFilter');
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


  /**
   * Get districts data
   * @param stateId 
   */
  getDistricts(stateId, value) {
    try {
      this.masterService.getData('district/', stateId).subscribe((response: any) => {
        if (response.status) {
          if (response.data[0].districts.length > 0) {
            this.districtsData = response.data[0].districts;
            if (value === 'defaultFilter') {
              this.getTalukas(response.data[0].districts[0].districtId);
              this.selectedDistrictEvent = response.data[0].districts[0];
            } else if (value === 'addFilter') {
              this.addTalukaForm.get('addTalukaSelectedDistrict').setValue(response.data[0].districts[0]);
            } else {
              this.editTalukaForm.get('editTalukaSelectedDistrict').setValue(response.data[0].districts[0])
            }
          } else {
            this.districtsData = [];
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table = $('table');
            this.dataTable = table.DataTable().draw();
            this.commonHelper.toasterMessageError(CommonConstants.districtsMessage);
            this.spinner.hide();
            if (value === 'defaultFilter') {
              this.selectedDistrictEvent = [];
              this.isTalukaDataExists = false;
            } else if (value === 'addFilter') {
              this.addTalukaForm.get('addTalukaSelectedDistrict').setValue('Select District');
            } else {
              this.editTalukaForm.get('editTalukaSelectedDistrict').setValue('Select District');
            }
          }
        } else {
          this.spinner.hide();
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
  getTalukas(districtId) {
    try {
      if (districtId) {
        this.masterService.getData('taluka/', districtId).subscribe((response: any) => {
          if (response.status) {
            this.spinner.hide();
            if (response.data.length > 0) {
              this.reploatingDataTable();
              this.districtName = response.data[0].districtName;
              this.talukaData = response.data[0].talukas;
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
              this.isTalukaDataExists = true;
            } else {
              this.talukaData = [];
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
              this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
            }
          } else {
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        }, error => {
          this.modalRef.hide();
        });
      } else {
        this.spinner.hide();
        this.reploatingDataTable();
        this.districtName = '';
        this.talukaData = [];
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable().draw();
        this.selectedDistrict = '';
        this.districtsData = [];
        this.selectedDistrictEvent = '';
        this.isTalukaDataExists = false;
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
   * District page starting change event
   * @param event 
   */
  onDistrictEventChange(event) {
    if (event) {
      this.getTalukas(event.districtId);
    }
  }

  /**
   * Generating taluka by using taluka name
   * @param event 
   */
  talukaIdChange(event: any) {
    this.talukasValueOfID.talukaValue = event.substring(0, 3);
  }


  /**
   * SelectChangeEvent for default
   * @param event 
   */
  onStateEventChange(event, value) {
    if (event) {
      this.getDistricts(event.id, value);
    }
  }

  //get f() { return this.addTalukaForm.controls; }
  get addTalukaF() {
    return this.addTalukaForm.controls;
  }

  //edit f() 
  get editTalukaF() {
    return this.editTalukaForm.controls;
  }

  /**
   * Add Taluka function
   */
  addTaluka() {
    try {
      this.submitted = true;
      if (this.addTalukaForm.invalid) {
        return;
      }
      if (this.addTalukaForm.value.addTalukaSelectedDistrict === 'Select District') {
        return;
      }

      let apiData = this.addTalukaForm.value,
        status = this.addTalukaForm.value.addTalukaStatus ? 'active' : 'inactive',
        data = {
          "stateId": apiData.addTalukaSelectedState.id,
          "districtId": apiData.addTalukaSelectedDistrict.districtId,
          "name": apiData.addTalukaTalukaName,
          "displayName": apiData.addTalukaDisplayName,
          "code": apiData.addTalukaTalukaValue,
          "description": apiData.addTalukaDescription,
          "status": status
        }
      this.masterService.postData('taluka', data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getTalukas(apiData.addTalukaSelectedDistrict.districtId);
          this.selectedStateEvent = apiData.addTalukaSelectedState;
          this.selectedDistrictEvent = apiData.addTalukaSelectedDistrict;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * Taluka Update
   */
  talukaUpdate() {
    try {
      this.submitted = true;
      if (this.editTalukaForm.invalid) {
        return;
      }
      if (this.editTalukaForm.value.editTalukaSelectedDistrict === 'Select District') {
        return;
      }
      let apiData = this.editTalukaForm.value,
        status = this.editTalukaForm.value.editTalukaStatus ? "active" : "inactive",
        data = {
          "stateId": apiData.editTalukaSelectedState.id,
          "districtId": apiData.editTalukaSelectedDistrict.districtId,
          "name": apiData.editTalukaTalukaName,
          "displayName": apiData.editTalukaDisplayName,
          "code": apiData.editTalukaTalukaId,
          "description": apiData.editTalukaDescription,
          "status": status
        }
      this.masterService.putData('taluka/', this.talukaId, data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getTalukas(apiData.editTalukaSelectedDistrict.districtId);
          this.selectedDistrictEvent = apiData.editTalukaSelectedDistrict;
          this.selectedStateEvent = apiData.editTalukaSelectedState;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * Change status of Taluka 
   * @param value 
   * @param districtName 
   */
  talukaStatusValue(value: any, districtName: string) {
    try {
      let status = value.status === 'active' ? "inactive" : "active"
      let data = {
        status: status
      }
      this.masterService.putData('update_taluka_status/', value.talukaId, data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.getTalukas(this.selectedDistrictEvent.districtId);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
}
