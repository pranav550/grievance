import { Component, OnInit, TemplateRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { MasterService } from '../services/master-service'
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants'
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html',
  styleUrls: ['./districts.component.scss'],
  providers: [MasterService, CommonHelper]
})

export class DistrictsComponent implements OnInit {
  submitted = false;
  editDistrictForm: FormGroup;
  addDistrictForm: FormGroup;
  submittedAddDistrictForm = false;
  districtId: Number;
  dataTable: any;
  districtData: any;
  addSelectedState: any;
  modalRef: BsModalRef;
  statesData: any;
  isStateExists: boolean;
  stateId: Number;
  selectedState: any;
  selectedStateModalName: any;
  stateName: String;
  validationLength: Number;
  districtFormNewData: any;
  cities: any;
  editDistrict: Object = {
    editDistrictName: '',
    editDistrictDisplayName: '',
    editDistrictId: '',
    mode: true,
    editDescriptionName: ''
  }
  districtsData: any;

  constructor(private modalService: BsModalService,
    private masterService: MasterService,
    private commonHelper: CommonHelper,
    private chRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder) { }





  /**
   * Open modal popup for create district
   * @param template 
   */
  openModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.addDistrictForm.reset();
    this.statesAPiData(template);

  }

  /*states API and validations*/
  statesAPiData(template) {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.modalRef = this.modalService.show(template);
            this.spinner.hide();
            this.statesData = response.data;
            this.addDistrictForm = this.fb.group({
              districtAddSelect: [this.selectedState, Validators.required],
              districtAddName: ['', [Validators.required, Validators.maxLength(100)]],
              districtAddId: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
              districtAddDisplayName: ['', Validators.maxLength(100)],
              districtAddDescription: ['', Validators.maxLength(100)],
              districtAddStatus: [true, Validators.required]
            });
          } else {
            this.spinner.hide();
            this.selectedState = [];
            this.statesData = [];
          }
        } else {
          this.spinner.hide();
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /* Adding district */
  districtAdd() {
    try {
      this.submitted = true;
      if (this.addDistrictForm.invalid) {
        return;
      }
      let apiValues = this.addDistrictForm.value,
        status = apiValues.districtAddStatus ? 'active' : 'inactive',
        data = {
          "stateId": apiValues.districtAddSelect.id,
          "code": apiValues.districtAddId,
          "name": apiValues.districtAddName,
          "status": status,
          "displayName": apiValues.districtAddDisplayName,
          "description": apiValues.districtAddDescription
        }
      this.masterService.postData('district', data).subscribe((response: any) => {
        if (response.data) {
          this.statesData = response.data;
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.reploatingDataTable();
          this.getDistricts(apiValues.districtAddSelect.id);
          this.getStates(false);
          this.selectedState = apiValues.districtAddSelect;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * districtDelete(districts)
   * @param template 
   * @param districtFormData 
   */
  districtDeleteModal(template: TemplateRef<any>, districtFormData: any) {
    this.districtFormNewData = districtFormData
    this.modalRef = this.modalService.show(template);
  }


  //get f() { return this.addDistrictForm.controls; }
  get addDistrictF() {
    return this.addDistrictForm.controls;

  }

  get editDistrictF() {
    return this.editDistrictForm.controls;
  }

  ngOnInit() {
    this.getStates(true);
    this.validationLength = CommonConstants.MaxValidation;
  }

  /*Fetching States Data*/
  getStates(value: boolean) {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.isStateExists = true;
            if (value) {
              this.addDistrictForm = this.fb.group({
                districtAddSelect: [response.data[0], Validators.required],
                districtAddName: ['', [Validators.required, Validators.maxLength(100)]],
                districtAddId: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
                districtAddDisplayName: ['', Validators.maxLength(100)],
                districtAddDescription: ['', Validators.maxLength(100)],
                districtAddStatus: [true, Validators.required]
              });
              this.selectedState = response.data[0];
              this.statesData = response.data;
              this.getDistricts(response.data[0].id);
            } else {
              this.statesData = response.data;
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

  /**
   * Fetcing District Data
   * @param stateId
   */
  getDistricts(stateId) {
    try {
      this.masterService.getData('district/', stateId).subscribe((response: any) => {
        if (response) {
          if (response.data.length > 0) {
            if (response.data[0].districts.length > 0) {
              this.spinner.hide();
              this.districtsData = response.data[0].districts;
              this.stateName = response.data[0].stateName;
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
            } else {
              this.districtsData = [];
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

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }

  /**
   * statechange
   * @param event 
   */
  onStateChange(event: any) {
    if (event) {
      this.getDistricts(event.id);
    }
  }

  /**
   * passing first three digits from district as code
   * @param event 
   */
  districtEnter(event: any) {
    this.addDistrictForm.get('districtAddId').setValue(event.substring(0, 3));

  }
  /**
     * passing in edit first three digits from district as code
     * @param event 
     */
  districtEditEnter(event: any) {
    this.editDistrictForm.get('editDistrictId').setValue(event.substring(0, 3));
  }


  /**
   * Opening edit modal popup 
   * @param editdistrictForm 
   * @param template 
   */
  openEditModal(formData: any, template: TemplateRef<any>) {
    this.districtData = formData;
    this.modalRef = this.modalService.show(template);
    let status = formData.status === 'active' ? true : false;
    this.editDistrictForm = this.fb.group({
      editDistrictSelect: this.selectedState,
      editDistrictName: [formData.name, [Validators.required, Validators.maxLength(100)]],
      editDistrictId: [formData.code, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      editDistrictDisplayName: [formData.displayName, Validators.maxLength(100)],
      editDistrictDescription: [formData.description, Validators.maxLength(100)],
      editDistrictStatus: status
    });
  }


  /**
   * district update*/
  districtUpdate() {
    try {
      this.submitted = true;
      if (this.editDistrictForm.invalid) {
        return;
      }
      let apiData = this.editDistrictForm.value,
        status = apiData.editDistrictStatus ? 'active' : 'inactive',
        data = {
          "stateId": apiData.editDistrictSelect.id,
          "code": apiData.editDistrictId,
          "name": apiData.editDistrictName,
          "status": status,
          "displayName": apiData.editDistrictDisplayName,
          "description": apiData.editDistrictDescription
        }
      this.masterService.putData('district/', this.districtData.districtId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getDistricts(apiData.editDistrictSelect.id);
          this.selectedState = apiData.editDistrictSelect;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * deleting district
   * @param value 
   */
  districtDelete(value: boolean) {
    try {
      if (value) {
        this.masterService.delete('district/', this.districtFormNewData.districtId).subscribe((response: any) => {
          if (response.status) {
            this.commonHelper.toasterMessage(response.message);
            this.getDistricts(this.selectedState.id);
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
   * updating the status of the district
   * @param districtvalues 
   */
  districtStatus(districtvalues: any) {
    try {
      let status = districtvalues.status === 'active' ? "inactive" : "active",
        data = {
          "status": status
        }
      this.masterService.putData('update_district_status/', districtvalues.districtId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.getDistricts(this.selectedState.id);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
}
