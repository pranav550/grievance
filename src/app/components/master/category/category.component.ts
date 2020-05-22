import {
  Component,
  OnInit,
  TemplateRef,
  ChangeDetectorRef
} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [MasterService, NgxSpinnerService, CommonHelper]
})
export class CategoryComponent implements OnInit {
  districtsData: any;
  isStateExists: boolean;
  modalRef: BsModalRef;
  categoryFormNewData: any;
  selectedState: any;
  errorOrResponse = false;
  statesData: any;
  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;
  categories: any;
  dataTable: any;
  submitted = false;
  editCategoryDetails: any;
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

  /**addCategoryModal validations
   * 
   */
  addCategoryValidations() {
    this.submitted = false
    this.addCategoryForm = this.fb.group({
      addCategoryName: ['', [Validators.required, Validators.maxLength(100)]],
      addCategorySelectState: [this.selectedState, Validators.required],
      addCategoryDescription: ['', Validators.maxLength(150)],
      addCategoryStatus: [true]
    });
  }
  /**addCategory add modal popup open
   * 
   * @param template 
   */
  addCategoryModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.addCategoryValidations();
    this.modalRef = this.modalService.show(template);
  }



  /**addCategory edit modal popup open
  * 
  * @param formData 
  * @param template 
  */
  editCategoryModal(formData: any, template: TemplateRef<any>) {
    this.editCategoryDetails = formData;
    this.modalRef = this.modalService.show(template);
    let status = formData.status === 'active' ? true : false;
    this.submitted = false;
    this.editCategoryForm = this.fb.group({
      editCategorySelectState: [this.selectedState, Validators.required],
      editCategoryName: [formData.name, [Validators.required, Validators.maxLength(100)]],
      editCategoryDescription: [formData.description, Validators.maxLength(150)],
      editCategoryStatus: status
    });
  }

  /**addCategory delete modal popup open
  * 
  * @param template 
  */
  deleteCategoryModal(categoryData: any, template: TemplateRef<any>) {
    this.categoryFormNewData = categoryData;
    this.modalRef = this.modalService.show(template);
  }

  /**
 * Get States data
 */
  getStates() {
    try {
      this.spinner.show();
      this.errorOrResponse = false;
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.data.length > 0) {
            this.selectedState = response.data[0];
            this.statesData = response.data;
            this.getCategories(this.selectedState.id);
            this.addCategoryValidations();
            this.isStateExists = true;
            this.errorOrResponse = true;
          } else {
            this.isStateExists = false;
            this.errorOrResponse = true;
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
          this.errorOrResponse = true;
        }
      });
    } catch (exc) {
      this.errorOrResponse = true;
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  /**
   * state change
   * @param event 
   */
  onStateChange(event: any) {
    if (event) {
      this.getCategories(event.id);
    }
  }


  /**
 * Add form control function
 */
  get addCategoryF() {
    return this.addCategoryForm.controls;
  }

  /**
  * edit form control function
  */
  get editCategoryF() {
    return this.editCategoryForm.controls;
  }


  addCategory() {
    try {
      this.submitted = true;
      this.errorOrResponse = false;
      let apiData = this.addCategoryForm.value,
        status = apiData.addCategoryStatus ? 'active' : 'inactive';
      if (this.addCategoryForm.invalid) {
        return;
      }
      let data = {
        "name": apiData.addCategoryName,
        "stateId": apiData.addCategorySelectState.id,
        "description": apiData.addCategoryDescription,
        "status": status
      }
      this.masterService.postData('grievance_type', data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getCategories(apiData.addCategorySelectState.id);
          this.selectedState = apiData.addCategorySelectState;
          this.errorOrResponse = true;
        } else {
          this.errorOrResponse = true;
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.errorOrResponse = true;
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**get categories 
   * 
   * @param stateId 
   */
  getCategories(stateId: number) {
    try {
      this.spinner.show();
      this.masterService.getData('grievance_type/', stateId).subscribe((response: any) => {
        if (response.status) {
          this.spinner.hide();
          if (response.data) {
            if (response.data[0].grievanceType.length > 0) {
              this.categories = response.data[0].grievanceType;
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $("table");
              this.dataTable = table.DataTable().draw();
            } else {
              this.spinner.hide();
              this.categories = [];
              this.reploatingDataTable();
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
        this.spinner.hide();
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
 * update the status of category
 * @param stateForm 
 */
  categoryStatusValue(categoryForm: any) {
    try {
      this.errorOrResponse = false;
      let status = categoryForm.status === "active" ? "inactive" : "active",
        data = {
          status: status
        };
      this.masterService.putData('update_grievance_type_status/', categoryForm.grievanceTypeId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.getCategories(this.selectedState.id);
          this.errorOrResponse = true;
        } else {
          this.errorOrResponse = true;
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.errorOrResponse = true;
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
   * delete category
   * @param value 
   */
  deleteCategory(value: boolean) {
    try {
      if (value) {
        this.errorOrResponse = false;
        this.masterService.delete('grievance_type/', this.categoryFormNewData.grievanceTypeId).subscribe((response: any) => {
          if (response.status) {
            this.commonHelper.toasterMessage(response.message);
            this.getCategories(this.selectedState.id);
            this.modalRef.hide();
            this.errorOrResponse = true;
          } else {
            this.errorOrResponse = true;
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        });
      } else {
        this.modalRef.hide();
        this.errorOrResponse = true;
      }
    } catch (exc) {
      this.errorOrResponse = true;
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /**
   * update category
   */
  updateCategory() {
    try {
      this.errorOrResponse = false;
      this.submitted = true;
      if (this.editCategoryForm.invalid) {
        return;
      }

      let apiData = this.editCategoryForm.value,
        status = apiData.editCategoryStatus ? "active" : 'inactive',
        data = {
          "stateId": apiData.editCategorySelectState.id,
          "name": apiData.editCategoryName,
          "description": apiData.editCategoryDescription,
          "status": status
        }
      this.masterService.putData('grievance_type/', this.editCategoryDetails.grievanceTypeId, data).subscribe((response: any) => {
        if (response.status) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getCategories(apiData.editCategorySelectState.id);
          this.selectedState = apiData.editCategorySelectState;
          this.errorOrResponse = true;
        } else {
          this.errorOrResponse = true;
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    }
    catch (exc) {
      this.errorOrResponse = true;
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
}
