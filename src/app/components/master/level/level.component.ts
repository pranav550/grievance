import { filter } from 'rxjs/operators';
import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../services/master-service';
import { CommonHelper } from '../../../helper/helper.component';
import { CommonConstants } from '../../../shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
  providers: [MasterService, CommonHelper]
})
export class LevelComponent implements OnInit {
  modalRef: BsModalRef;
  selectedState: any;
  statesData: any;
  levelsData: any;
  lvlData: any;
  isStateExists: boolean;
  submitted: boolean;
  selectedStateEvent: any;
  LevelFormNewData: any;
  addLevelForm: FormGroup;
  editLevelForm: FormGroup;
  FilterLevelForm: FormGroup;
  dataTable: any;
  CanCloseGrievance: any;
  selectEditCanCloseGrievance: any;
  stateName: String;
  selectedCanCloseGrievance: any;
  permissions_add: boolean;
  permissions_view: boolean;
  permissions_delete: boolean;
  permissions_edit: boolean;
  categories: any = [];
  categoriesNature: any = [];
  selectedCategory: any = {};
  natureId: any = [];
  selectedNature: any;
  gId: any = [];
  editGrievance: any;
  editNature: any;
  stateId: number
  grivId: number;
  grivNatureId: number;
  countryValue: any;
  natureValue: any;
  counter = 0;
  addGrievance: any = [];
  grievanceData: any = [];
  natureData: any = [];
  currentLevelId: number;
  addNature: any;

  constructor(
    private modalService: BsModalService,
    private masterService: MasterService,
    private chRef: ChangeDetectorRef,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.CanCloseGrievance = CommonConstants.CanCloseGrievance
    this.stateId = CommonConstants.stateId
    this.selectedCanCloseGrievance = this.CanCloseGrievance[1]
    this.getStates(true);
    this.getCategories()
  }
  /*validation rules*/
  validatorRule() {
    this.addLevelForm = this.fb.group({
      addLevelState: [this.selectedState, [Validators.required]],
      addLevelName: ['', [Validators.required, Validators.maxLength(100)]],
      addLevelCategory: this.categoriesNature.length > 0 ? [[], Validators.required] : [''],
      addLevelNature: [[]],
      addLevelDescription: ['', Validators.maxLength(150)],
      addLevelCanCloseGrievance: [this.selectedCanCloseGrievance],
      addLevelStatus: [true, Validators.required]
    });
  }
  //get f() { return this.addLevelForm.controls; }
  get addLevelF() {
    return this.addLevelForm.controls;
  }
  get editLevelF() {
    return this.editLevelForm.controls;
  }
  /*get states*/
  getStates(value: boolean) {
    try {
      this.spinner.show();
      this.masterService.getAll('states').subscribe((response: any) => {
        if (response.status) {
          if (response.data.length > 0) {
            this.isStateExists = true;
            let selectedValue: any;
            response.data.forEach(element => {
              if (element.id == CommonConstants.stateId) {
                selectedValue = element;
              }
            });
            if (value) {
              this.validatorRule();

              this.selectedState = selectedValue;
              this.statesData = response.data;

              // this.getLevels(selectedValue.id);
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
            } else {
              this.statesData = response.data;
              this.reploatingDataTable();
              this.chRef.detectChanges();
              const table: any = $('table');
              this.dataTable = table.DataTable().draw();
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



  /*get Levels*/
  getLevels(categoryId: any, stateId: number, natureId: any) {
    try {
      let data = {
        natureId: this.natureId == null ? "" : this.natureId,
        stateId: CommonConstants.stateId,
        gId: this.gId
      }
      if (this.natureId.length > 0 || this.gId.length > 0) {
        this.masterService.getLev("get_levels/", data.gId, stateId, data.natureId).subscribe((response: any) => {
          if (response) {
            if (response.data) {
              if (response.data.levels.length > 0) {
                this.permissions_add = Boolean(response.data.permissions.add)
                this.permissions_edit = Boolean(response.data.permissions.edit)
                this.permissions_delete = Boolean(response.data.permissions.delete)
                this.permissions_view = Boolean(response.data.permissions.view)
                this.spinner.hide();
                this.levelsData = response.data.levels;
                this.stateName = response.data.stateName;
                this.reploatingDataTable();
                this.chRef.detectChanges();
                const table: any = $('table');
                this.dataTable = table.DataTable().draw();
              } else {
                this.levelsData = [];
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
      }
      else {
        this.levelsData = [];
      }
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }



  /**
   * 
   * @param template 
   */
  addLevelModal(template: TemplateRef<any>) {
    this.submitted = false;
    this.modalRef = this.modalService.show(template);
    this.validatorRule();
  }
  onStateChange(event) {

  }
  canCloseGrievance(event, checkForm) {
    if (checkForm == "editChange") {
      this.selectEditCanCloseGrievance = event.name
    }
  }
  /* Adding users */
  addLevels() {
    try {
      this.submitted = true;
      // if (this.addLevelForm.invalid) {
      //   return;
      // }

      let apiValues = this.addLevelForm.value,
        status = apiValues.addLevelStatus ? 'active' : 'inactive',
        data = {
          "stateId": apiValues.addLevelState.id,
          "name": apiValues.addLevelName,
          "grievanceTypeId": this.gId,
          "grievanceNatureId": this.natureId.length > 0 ? this.natureId : "",
          "description": apiValues.addLevelDescription,
          "canCloseGrievance": apiValues.addLevelCanCloseGrievance.name.toLowerCase(),
          "status": status,
        }
      // this.gId = this.addGId
      this.masterService.postData('level', data).subscribe((response: any) => {
        if (response.data) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.spinner.hide();
          this.getLevels(this.gId, apiValues.addLevelState.id, this.natureId);
          this.getStates(false);
          this.selectedState = apiValues.addLevelState;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, err => {
        this.spinner.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  /**
  * Opening edit modal popup 
  * @param editLevelForm 
  * @param template 
  */
  openEditModal(formData: any, template: TemplateRef<any>) {
    this.lvlData = formData;
    this.editGrievance = this.selectedCategory
    this.editNature = this.selectedNature
    this.modalRef = this.modalService.show(template);

    let status = formData.status === 'active' ? true : false;

    this.editLevelForm = this.fb.group({
      editLevelCategory: this.selectedCategory,
      editLevelSelect: this.selectedState,
      editLevelName: [formData.name, [Validators.required, Validators.maxLength(100)]],
      editLevelNature: this.selectedNature,
      editLevelDescription: [formData.description, Validators.maxLength(100)],
      editLevelCanCloseGrievance: formData.canCloseGrievance.charAt(0).toUpperCase() + formData.canCloseGrievance.slice(1),
      editLevelStatus: status
    });
  }

  /**
   * level update*/
  editLevels(template: TemplateRef<any>) {
    try {
      this.submitted = true;
      if (this.editLevelForm.invalid) {
        return;
      }
      let apiData = this.editLevelForm.value,
        status = apiData.editLevelStatus ? 'active' : 'inactive';
      if (this.selectEditCanCloseGrievance) {
        apiData.editLevelCanCloseGrievance = this.selectEditCanCloseGrievance;
      } else {
        apiData.editLevelCanCloseGrievance = apiData.editLevelCanCloseGrievance;
      }
      let data = {
        "stateId": apiData.editLevelSelect.id,
        "name": apiData.editLevelName,
        "grievanceTypeId": this.gId,
        "grievanceNatureId": this.natureId.length > 0 ? this.natureId : "",
        "status": status,
        "description": apiData.editLevelDescription,
        "canCloseGrievance": apiData.editLevelCanCloseGrievance.toLowerCase(),
      }
      this.masterService.putData('level/', this.lvlData.levelId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          this.modalRef.hide();
          this.getLevels(this.gId, apiData.editLevelSelect.id, this.natureId);
          this.selectedState = apiData.editLevelSelect;
        } else {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /**
    * levelDelete(level)
    * @param template 
    * @param levelFormData 
    */
  //   levelDeleteModal(template: TemplateRef<any>, levelFormData: any) {
  //     this.LevelFormNewData = levelFormData
  //     this.modalRef = this.modalService.show(template);
  //   }
  // /**
  //    * deleting district
  //    * @param value 
  //    */
  //   deletelevel(value: boolean) {
  //     try {
  //       if (value) {
  //         this.masterService.delete('level/', this.LevelFormNewData.levelId).subscribe((response: any) => {
  //           // if (response.status) {
  //           //   this.commonHelper.toasterMessage(response.message);
  //           //   this.getLevels(this.selectedState.id);
  //           //   this.modalRef.hide();
  //           // } else {
  //           //   this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
  //           // }
  //         });
  //       } else {
  //         this.modalRef.hide();
  //       }
  //     } catch (exc) {
  //       this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
  //     }
  //   }

  /**
   * updating the status of the level
   * @param levelvalues 
   */
  levelStatus(levelvalues: any) {
    try {
      let status = levelvalues.status === 'active' ? "inactive" : "active",
        data = {
          "status": status
        }
      this.masterService.putData('update_level_status/', levelvalues.levelId, data).subscribe((response: any) => {
        if (response) {
          this.commonHelper.toasterMessage(response.message);
          // this.getLevels(this.selectedState.id);
        } else {
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

  /**get categories
  *
  * @param stateId
  */
  getCategories() {
    try {
      this.spinner.show();
      this.masterService.getAll("active_grievanceType").subscribe(
        (response: any) => {
          if (response.status) {
            this.spinner.hide();
            if (response.data.length > 0) {
              this.categories = response.data;
              this.selectedCategory = this.countryValue
            } else {
              this.spinner.hide();
              this.categories = [];
            }
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError(
              CommonConstants.validationMessage
            );
          }
        },
        error => {
          this.spinner.hide();
        }
      );
    } catch (exc) {
      this.spinner.hide();
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  //**function change the categories
  onCategoryChange(event) {
    this.gId = [];
    this.natureId = []
    // this.selectedNature = undefined
    event.map((data) => {
      this.grievanceData.push(data)
      //this.selectedCategory = data
      this.gId.push(data.grievanceTypeId);
    })
    if (this.gId.length != 0) {
      this.getGrievanceNature(this.gId);
    } else {
      this.gId = []
      this.natureId = []
      this.levelsData = []
      this.reploatingDataTable();
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable().draw();
    }

    if (this.gId == 4) {
      this.natureId == []
      this.getLevels(this.gId, this.stateId, this.natureId)
    }
  }

  onAddCategoryChange(event) {
    this.gId = []
    this.natureId = []
    // this.selectedNature = undefined
    if (this.addLevelForm.controls['addLevelNature']) {
      this.addLevelForm.controls['addLevelNature'].reset();
    }
    event.map((data) => {
      // this.selectedCategory = data
      // this.test1.push(this.selectedCategory)
      this.gId.push(data.grievanceTypeId);
    })

    if (this.gId.length != 0) {
      this.getGrievanceNature(this.gId);
    } else {
      this.natureId = []
    }


    // if (this.gId == 4) {
    //   this.natureId == undefined
    //   this.getLevels(this.gId, this.stateId, this.natureId)
    //   this.levelsData=

    // }
  }

  onEditCategoryChange(event) {
    if (event.length == 0) {
      this.editLevelForm.controls['editLevelCategory'].reset();
    }
    this.gId = []
    this.natureId = []
    //  this.editGrievance = undefined
    if (this.editLevelForm.controls['editLevelNature']) {
      this.editLevelForm.controls['editLevelNature'].reset();
    }
    event.map((data) => {
      this.gId.push(data.grievanceTypeId);
    })

    if (this.gId.length != 0) {
      this.getGrievanceNature(this.gId);
    } else {
      this.natureId = []
    }
  }


  // function for getting grievanceNature
  getGrievanceNature(id) {
    try {
      this.spinner.show();
      this.masterService.getData('active_grievanceNature/', id).subscribe((response: any) => {
        if (response.status) {
          let newData = [];
          this.spinner.hide();
          response.data.filter(newResponse => {
            newData.push({ id: newResponse.grievanceNatureId, name: newResponse.grievanceNatureName });
          });
          if (newData.length > 0) {
            this.spinner.hide();
            this.categoriesNature = newData;

          } else {
            this.categoriesNature = [];
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }, error => {
        this.spinner.hide();
      });
    } catch (excp) {
      this.spinner.hide();
    }
  }

  // function for onChange  Grievance nature 
  onNatureChange(value) {
    if (value.length == 0) {
      this.gId = []
      this.natureId = []
      this.selectedCategory = []
      this.levelsData = []
      this.reploatingDataTable();
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable().draw();

    }

    this.natureId = []
    value.map(data => {
      this.natureData.push(data)
      this.natureId.push(data.id)
    })
    if (this.categoriesNature.length > 0) {
      this.getLevels(this.gId, this.stateId, this.natureId)
    }

  }

  // function for onChange  Grievance nature 
  onAddNatureChange(value) {
    if (value.length == 0) {
      this.addLevelForm.controls['addLevelCategory'].reset();
    }
    this.natureId = []
    value.map((data) => {
      this.natureId.push(data.id)
    })
  }

  // function for onChange  Grievance nature 
  onEditNatureChange(value) {
    this.natureId = []
    value.map((data) => {
      this.natureId.push(data.id)
    })
  }

  // clear the search
  clearFilter(value1) {
    if (value1 == false) {
      this.counter = this.counter - 1;
      // this.addUserForm.controls['addUserBlockLocation'].reset();
      // this.categoriesNature = [];
      this.natureId = [];
    }
    else {
      this.counter = this.counter + 1;
    }
  }

}
