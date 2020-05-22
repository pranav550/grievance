import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-grievance-nature',
  templateUrl: './grievance-nature.component.html',
  styleUrls: ['./grievance-nature.component.scss'],
  providers: [MasterService, CommonHelper]
})
export class GrievanceNatureComponent implements OnInit {
  categoryData: any;
  modalRef: BsModalRef;
  isStateExists: boolean;
  submitted = false;
  addGrievanceNature: any;
  categoryDataExists: boolean = false;
  grievanceNature: any;
  selectedState: any;
  statesData: any;
  dataTable: any;
  selectedCategory: any;
  categoryNatureForm: FormGroup;
  editCategoryNatureForm: FormGroup;
  editGrevianceData: any;
  categoriesNature: any;
  deleteData: any;

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

  /*page load  API starts*/
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
          this.getCategories(this.selectedState.id, "default");
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
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**getCategories
   * 
   * @param stateId 
   * @param value 
   */
  getCategories(stateId: number, value) {
    try {
      this.masterService.getData('grievance_type/', stateId).subscribe((response: any) => {
        if (response.status) {
          if (response.data) {
            if (response.data[0].grievanceType.length > 0) {
              this.categoryData = response.data[0].grievanceType;
              this.categoryDataExists = true;
              if (value === 'default') {
                this.selectedCategory = response.data[0].grievanceType[0];
                this.getGrevianceNature(this.selectedCategory.grievanceTypeId);
              } else if (value === 'addChange') {
                this.categoryNatureForm.get('addCategorySelectGrievanceType').setValue(response.data[0].grievanceType[0]);
              } else if (value === 'editChange') {
                this.editCategoryNatureForm.get('editCategorySelectGrievanceType').setValue(response.data[0].grievanceType[0]);
              }
            } else {
              this.spinner.hide();
              this.categoryDataExists = false;
              this.categoryData = [];
              if (value === 'default') {
                this.selectedCategory = [];
              } else if (value === 'addChange') {
                this.categoryNatureForm.get('addCategorySelectGrievanceType').setValue([]);
              } else if (value === 'editChange') {
                this.editCategoryNatureForm.get('editCategorySelectGrievanceType').setValue([]);
              } else {
                this.selectedCategory = [];
              }

            }
          }
        } else {
          this.spinner.hide();
        }
      }, error => {

      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  getGrevianceNature(grievanceTypeId: number) {
    try {
      this.masterService.getData('grievance_nature/', grievanceTypeId).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.data.length > 0) {
            this.categoriesNature = response.data;
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $("table");
            this.dataTable = table.DataTable().draw();
          } else {
            this.categoriesNature = [];
            this.reploatingDataTable();
            this.chRef.detectChanges();
            const table: any = $("table");
            this.dataTable = table.DataTable().draw();
          }
        } else {
          this.spinner.hide();
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /*page load API ends*/

  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $('#dataTable1').DataTable();
    table.destroy();
  }

  /**on stateChange
   * 
   * @param event 
   */
  onStateChange(event: any, value: string) {
    if (value === 'default') {
      // this.getGrevianceNature(event.id);
    } else if (value === 'addChange') {

    } else if (value === 'editChange') {

    }
    this.getCategories(event.id, value);
  }


  /*add functionality starts here*/
  /**addCategoryNatureValidations
   * 
   */
  validationsForAddNature() {
    this.submitted = false
    this.categoryNatureForm = this.fb.group({
      addCategoryNatureName: ['', [Validators.required, Validators.maxLength(100)]],
      addGrievanceSelectState: [this.selectedState, Validators.required],
      addCategorySelectGrievanceType: [this.selectedCategory],
      addCategoryNatureDescription: ['', Validators.maxLength(150)],
      addCategoryNatureStatus: [true]
    });
  }

  /**
 * Add form control function
 */
  get addCategoryNF() {
    return this.categoryNatureForm.controls;
  }

  /** add category nature
   * 
   */
  addCategoryNature() {
    try {
      this.submitted = true;
      let apiData = this.categoryNatureForm.value,
        status = apiData.addCategoryNatureStatus ? 'active' : 'inactive';
      if (this.categoryNatureForm.invalid) {
        return;
      }
      let data = {
        "stateId": apiData.addGrievanceSelectState.id,
        "name": apiData.addCategoryNatureName,
        "grievanceTypeId": apiData.addCategorySelectGrievanceType.grievanceTypeId,
        "description": apiData.addCategoryNatureDescription,
        "status": status
      }
      this.masterService.postData('grievance_nature', data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getGrevianceNature(apiData.addCategorySelectGrievanceType.grievanceTypeId);
          this.selectedState = apiData.addGrievanceSelectState;
          this.selectedCategory = apiData.addCategorySelectGrievanceType;
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


  /**modal popup open for add 
   * 
   * @param template 
   */
  addGrievanceNatureModal(template: TemplateRef<any>) {
    // this.getCategories(this.selectedState.id, 'addChange');
    this.validationsForAddNature();
    this.modalRef = this.modalService.show(template);
  }


  /*update functionality starts Here*/
  /**
* edit form control function
*/
  get editGrevianceF() {
    return this.editCategoryNatureForm.controls;
  }
  /**modal popup open for edit 
   * 
   * @param formData 
   * @param template 
   */
  editGrievanceNatureModal(formData: any, template: TemplateRef<any>) {
    // this.getCategories(this.selectedState.id, 'default');
    this.modalRef = this.modalService.show(template);
    this.submitted = false;
    let status = formData.status === 'active' ? true : false;
    this.editGrevianceData = formData;
    this.editCategoryNatureForm = this.fb.group({
      editCategorySelectGrievanceType: [this.selectedCategory, Validators.required],
      editCategorySelectState: this.selectedState,
      editGrevianceName: [formData.grievanceNatureName, [Validators.required, Validators.maxLength(100)]],
      editGrievanceDescription: [formData.description, Validators.maxLength(150)],
      editGrevianceStatus: status
    });

  }

  /**update gerviance nature
   * 
   */
  updateGrevianceNature() {
    try {
      this.submitted = true;
      if (this.editCategoryNatureForm.invalid) {
        return;
      }
      let apiData = this.editCategoryNatureForm.value,
        status = apiData.editGrevianceStatus ? "active" : 'inactive',
        data = {
          "stateId": apiData.editCategorySelectState.id,
          "grievanceTypeId": apiData.editCategorySelectGrievanceType.grievanceTypeId,
          "name": apiData.editGrevianceName,
          "description": apiData.editGrievanceDescription,
          "status": status
        }
      this.masterService.putData('grievance_nature/', this.editGrevianceData.grievanceNatureId, data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.selectedState = apiData.editCategorySelectState;
          this.selectedCategory = apiData.editCategorySelectGrievanceType;
          this.getGrevianceNature(apiData.editCategorySelectGrievanceType.grievanceTypeId);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    }
    catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /*update functionality ends Here*/

  /*delete functionality starts here*/

  /**delete modal popup
   * 
   * @param formData 
   * @param template 
   */
  // deleteGrievanceModal(template: TemplateRef<any>, formData: any) {
  //   this.modalRef = this.modalService.show(template);
  //   this.deleteData = formData;
  // }

  /**deleting the category
   * 
   * @param value 
   */
  // deleteCategory(value: boolean) {
  //   try {
  //     if (value) {
  //       this.masterService.delete('grievance_nature/', this.deleteData.grievanceNatureId).subscribe((response: any) => {
  //         if (response.status) {
  //           this.commonHelper.toasterMessage(response.message);
  //           this.getGrevianceNature(this.selectedState.id);
  //           this.modalRef.hide();
  //         } else {
  //           this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
  //         }
  //       });
  //     } else {
  //       this.modalRef.hide();
  //     }
  //   } catch (exc) {
  //     this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
  //   }
  // }

  /*delete functionality ends here*/

  /*status changes event starts*/
  categoreisStatusValue(formData: any) {
    try {
      let status = formData.status === "active" ? "inactive" : "active",
        data = {
          status: status
        };
      this.spinner.show();
      this.masterService.putData('update_grievance_nature_status/', formData.grievanceNatureId, data).subscribe((response: any) => {
        if (response) {
          this.spinner.hide();
          this.commonHelper.toasterMessage(response.message);
          this.getGrevianceNature(this.selectedCategory.grievanceTypeId);
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /*
   On Change of Grievance Type
  */
  onGTypeChange(event) {
    if (event) {
      this.getGrevianceNature(event.grievanceTypeId);
    } else {
    }
  }
}
