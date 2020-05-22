import { filter } from 'rxjs/operators';
import {
  Component,
  OnInit,
  TemplateRef,
  ChangeDetectorRef
} from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MasterService } from "../services/master-service";
import { CommonHelper } from "../../../helper/helper.component";
import { CommonConstants } from "../../../shared/constants";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-escalation-matrix",
  templateUrl: "./escalation-matrix.component.html",
  styleUrls: ["./escalation-matrix.component.scss"],
  providers: [MasterService, CommonHelper]
})
export class EscalationMatrixComponent implements OnInit {
  submitted = false;
  updateMatrixForm: FormGroup;
  addMatrixForm: FormGroup;
  modalRef: BsModalRef;
  categories: any;
  statesData: any;
  isStateExists: boolean;
  stateId: number;
  selectedState: any;
  selectedCategory: any;
  selectedCategory1: any;
  selectedNature: any;
  natureId: any = [];
  validationLength: Number;
  dataTable: any;
  matrixData: any;
  categoriesNature: any;
  editMatrixData: any;
  districtName: any;
  districtsData: any;
  reminderType: any;
  timeUnit: any;
  reminderData: any;
  timePeriodData: any;
  levelData: any;
  gId: any = [];
  permissions_add: boolean;
  permissions_delete: boolean;
  permissions_edit: boolean;
  permissions_view: boolean;
  grievanceId: number;
  categoriesNature1: any;
  selectedGrievance: any;
  addGrievance: any;
  addNature: any;
  editGrievance: any;
  editNature: any;
  editLevel: any;
  grievanceArray: any = [];
  grievanceNature: any = [];
  grievanceData: any;
  // tempId: any;
  // tempName: any;
  editLevels: any
  leveId: any;

  constructor(
    private modalService: BsModalService,
    private masterService: MasterService,
    private commonHelper: CommonHelper,
    private chRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getStates(true);
    this.getCategories();
    this.timeUnit = CommonConstants.timeUnit;
    this.reminderType = CommonConstants.reminderType;
    // this.getCategories()
    // this.updateMatrixForm.controls['editSelectState'].disable();
  }

  get addMatrixF() {
    return this.addMatrixForm.controls;
  }

  get editMatrixF() {
    return this.updateMatrixForm.controls;
  }

  /**
   * open modal for add taluka
   * @param template
   */
  addGrievanceModal(template: TemplateRef<any>) {
    this.validateGrievanceModal();
    //  this.getLevels(this.gId, this.stateId, this.natureId)
    this.modalRef = this.modalService.show(template);
  }
  validateGrievanceModal() {
    this.submitted = false;
    this.addMatrixForm = this.fb.group({
      addSelectState: [this.selectedState, Validators.required],
      addSelectDistrict: [],
      filterGrievanceNature: [this.selectedNature],
      addSelectCategory: [this.selectedCategory, Validators.required],
      addSelectLevel: [[], Validators.required],
      addSelectTimePeriod: [[], Validators.required],
      addSelectTimePeriodCount: ["", Validators.maxLength(10)],
      addSelectReminderF: [],
      addSelectReminderFCount: ["", Validators.maxLength(10)],
      addSelectReminderType: [[], Validators.required],
      addLevelStatus: [true]
    });
  }
  /**
   * Opening edit modal popup
   * @param editGrievanceModal
   * @param template
   */
  editGrievanceModal(id: number, template: TemplateRef<any>) {

    let promise = new Promise((resolve, reject) => {
      this.masterService
        .getData("escalation_matrix/", id)
        .toPromise()
        .then(
          resp => {
            this.editMatrixData = resp["data"][0];
            this.editMatrixData.grievanceType.map((data) => {
              this.grievanceArray.push({
                id: data.grievanceTypeId,
                name: data.grievanceTypeName
              })
            })

            this.editMatrixData.grievanceNature.map((data) => {
              this.grievanceNature.push({
                id: data.grievanceNatureId,
                name: data.grievanceNatureName
              })
            })

            this.editMatrixData.level.map((data) => {
              this.editLevels = data.id
            })
            this.editGrievance = this.grievanceArray;
            this.editNature = this.grievanceNature;
            let status = this.editMatrixData.status === "active" ? true : false;
            this.updateMatrixForm = this.fb.group({
              editSelectState: this.selectedState,
              editSelectDistrict: this.editMatrixData.districts[0],
              editSelectCategory: [
                this.editGrievance,
                Validators.required
              ],
              editfilterGrievanceNature: [
                this.editNature == null ? "" : this.editNature,
                Validators.required
              ],
              editSelectLevel: [
                this.editMatrixData.level[0].name,
                Validators.required
              ],
              editSelectTimePeriod: [
                this.editMatrixData.timePeriodUnitType,
                Validators.required
              ],
              editSelectTimePeriodCount: [
                this.editMatrixData.timePeriodUnitValue,
                Validators.maxLength(10)
              ],
              editSelectReminderF: [
                this.editMatrixData.reminderFrequencyUnitType
              ],
              editSelectReminderFCount: [
                this.editMatrixData.reminderFrequencyUnitValue,
                Validators.maxLength(10)
              ],
              editSelectReminderType: [
                this.editMatrixData.reminderType,
                Validators.required
              ],
              editLevelStatus: status
            });
            this.modalRef = this.modalService.show(template);
            resolve();
          },
          msg => {
            reject(msg);
          }
        );
    });
    return promise;
  }
  /*Fetching States Data*/
  getStates(value: boolean) {
    try {
      this.spinner.show();
      this.masterService.getAll("states").subscribe((response: any) => {
        if (response.data.length > 0) {
          this.isStateExists = true;
          let selectedValue: any;
          response.data.forEach(element => {
            if (element.id == CommonConstants.stateId) {
              selectedValue = element;
            }
          });
          if (value) {
            this.selectedState = selectedValue;
            this.statesData = response.data;
            this.getDistricts(this.selectedState.id, "");
            this.stateId = this.selectedState.id;
            this.chRef.detectChanges();
            const table: any = $("table");
            this.dataTable = table.DataTable().draw();
          } else {
            this.statesData = response.data;
            this.chRef.detectChanges();
            const table: any = $("table");
            this.dataTable = table.DataTable().draw();
          }
        } else {
          this.statesData = [];
          this.commonHelper.toasterMessageError(CommonConstants.statesMessage);
          this.isStateExists = false;
          this.chRef.detectChanges();
          this.reploatingDataTable();
        }
        this.spinner.hide();
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /**
   * statechange
   * @param event
   */
  onStateChange(event: any, value) {
    if (event) {
      this.getDistricts(event.id, "");
      this.stateId = event.id;
      this.getMatrixData(this.gId, this.stateId, this.natureId);
      this.selectedCategory = [];

    }
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


  getGrievanceNature(id) {
    //this.apiCalling('active_grievanceNature', id)

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

  onNatureChange(value) {
    if (value.length == 0) {
      this.gId = []
      this.natureId = []
      this.selectedCategory = []
      this.matrixData = []
      this.reploatingDataTable();
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable().draw();
    }
    // this.selectedNature = []
    this.natureId = []
    value.map((data) => {
      // this.selectedNature = data
      this.natureId.push(data.id)
      this.getLevels(this.gId, this.stateId, this.natureId)
    })
    this.getMatrixData(this.gId, this.stateId, this.natureId);

    // if (this.natureId.length != 0) {
    //   this.getMatrixData(this.gId, this.stateId, this.natureId);
    // }
    // else {
    //   this.matrixData = [];
    // }
  }

  onAddNatureChange(value) {
    if (value.length == 0) {
      this.gId = []
      this.natureId = []
      this.selectedCategory = []
      this.matrixData = []
      this.addMatrixForm.controls['addSelectCategory'].reset();
      this.addMatrixForm.controls['addSelectCategory'].reset();
      this.reploatingDataTable();
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable().draw();
    }
    // this.selectedNature = []
    this.natureId = []
    value.map((data) => {
      // this.selectedNature = data
      this.natureId.push(data.id)
      this.getLevels(this.gId, this.stateId, this.natureId)
    })
    this.getMatrixData(this.gId, this.stateId, this.natureId)
  }

  onEditCategoryChange(value) {
    this.gId = [];
    if (value.length == 0) {
      this.updateMatrixForm.controls['editSelectLevel'].reset();
      this.updateMatrixForm.controls['editfilterGrievanceNature'].reset();
    }
    value.map((data) => {
      this.gId.push(data.grievanceTypeId)

    })
    if (this.natureId.length == 0) {
      this.updateMatrixForm.controls['editSelectLevel'].reset();
      this.updateMatrixForm.controls['editSelectCategory'].reset();
    }

  }

  getGrievanceNature1(id) {
    //this.apiCalling('active_grievanceNature', id)

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
            this.categoriesNature1 = newData;
          } else {
            this.categoriesNature1 = [];
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

  /**
   * categorychange
   * @param event
   */
  onCategoryChange(event: any) {
    this.gId = []
    this.selectedGrievance = event

    if (event.length > 0) {
      event.map((data) => {
        this.grievanceData = data
        this.gId.push(data.grievanceTypeId);
        this.getGrievanceNature(this.gId);
        this.getGrievanceNature1(this.gId);

      })

      if (this.gId == 4) {
        this.getMatrixData(this.gId, this.stateId, this.natureId);
        this.getLevels(this.gId, this.stateId, this.natureId)
      }
    } else {
      this.gId = [];
      this.natureId = [];
      this.matrixData = [];
      this.reploatingDataTable();
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable().draw();
    }
  }


  /**
  * categorychange
  * @param event
  */
  onAddCategoryChange(event) {
    this.selectedCategory = []
    this.gId = [];
    if (event.length > 0) {
      event.map((data) => {
        this.gId.push(data.grievanceTypeId);
        this.getGrievanceNature(this.gId);
        this.getGrievanceNature1(this.gId);
        if (this.gId == 4) {
          this.getLevels(this.gId, this.stateId, this.natureId)
        }
      })
      if (this.addMatrixForm.controls['filterGrievanceNature']) {
        this.addMatrixForm.controls['filterGrievanceNature'].reset();
      }
      this.getGrievanceNature1(this.gId);
    } else {
      this.gId = 1;
    }
  }
  /**
   * Get districts data
   * @param stateId
   */
  getDistricts(stateId, value) {
    try {
      this.masterService.getData("district/", stateId).subscribe(
        (response: any) => {
          if (response.status) {
            if (response.data[0].districts.length > 0) {
              this.districtsData = response.data[0].districts;
            } else {
              this.districtsData = [];
              this.spinner.hide();
            }
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError(
              CommonConstants.validationMessage
            );
          }
        },
        error => {
          this.modalRef.hide();
        }
      );
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /*get level*/
  getLevels(gId: any, stateId: number, natureId: any) {
    try {
      let data = {
        gId: this.gId,
        stateId: CommonConstants.stateId,
        natureId: this.natureId == null ? "" : this.natureId
      }
      this.masterService
        .getLev("get_levels/", data.gId, data.stateId, data.natureId)
        .subscribe((response: any) => {
          if (response) {
            if (response.data.levels.length > 0) {
              this.spinner.hide();
              this.levelData = response.data.levels;
              response.data.levels.map((data) => {
                this.leveId = data.levelId
              })
            } else {
              this.levelData = [];
              this.spinner.hide();
            }
          } else {
            this.spinner.hide();
            this.commonHelper.toasterMessageError(
              CommonConstants.validationMessage
            );
          }
        });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /**get escalation matrix list
   *
   * @param stateId
   * @param categoryId
   *  
   */
  getMatrixData(categoryId: any, stateId: number, natureId: any, ) {
    try {
      let data = {
        categoryId: this.gId,
        natureId: this.natureId == null ? "" : this.natureId,
        stateId: CommonConstants.stateId
      }
      if (this.gId.length > 0 || this.natureId > 0) {
        this.masterService
          .getMatrixData("escalation_matrix/", data.categoryId, data.stateId, data.natureId)
          .subscribe(
            (response: any) => {
              if (response.status) {
                this.spinner.hide();
                if (response.data.length > 0) {
                  this.matrixData = response.data;
                  this.matrixData.filter(data => {
                    this.permissions_add = Boolean(data.add)
                    this.permissions_delete = Boolean(data.delete)
                    this.permissions_edit = Boolean(data.edit)
                    this.permissions_view = Boolean(data.view)
                  })
                  this.reploatingDataTable();
                  this.chRef.detectChanges();
                  const table: any = $("table");
                  this.dataTable = table.DataTable().draw();
                } else {
                  this.matrixData = [];
                  this.reploatingDataTable();
                  this.chRef.detectChanges();
                  const table: any = $("table");
                  table.DataTable({
                    language: {
                      emptyTable: "No data available in table", //
                      loadingRecords: "Please wait .. ", // default Loading...
                      zeroRecords: "No records found"
                    }
                  });
                  this.dataTable = table.DataTable().draw();
                }
              } else {
                this.spinner.hide();
              }
            },
            error => {
              this.spinner.hide();
            }
          );
      }
      else {

        this.matrixData = [];
      }
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /*redraw the datatable*/
  reploatingDataTable() {
    let table = $("#dataTable1").DataTable();
    table.destroy();
    // table.clear().draw();
  }
  /* save escalate matrix data*/
  addMatrixData() {
    try {
      this.submitted = true;

      // if (this.addMatrixForm.invalid) {
      //   return;
      // }
      let apiData = this.addMatrixForm.value,
        status = apiData.addLevelStatus ? "active" : "inactive",

        data = {
          stateId: apiData.addSelectState.id,
          districtId: apiData.addSelectDistrict.districtId,
          grievanceTypeId: this.gId,
          grievanceNatureId: this.categoriesNature.length > 0 ? this.natureId : "",
          levelId: this.leveId,
          timePeriodUnitType: apiData.addSelectTimePeriod,
          timePeriodUnitValue: apiData.addSelectTimePeriodCount,
          reminderFrequencyUnitType: apiData.addSelectReminderF,
          reminderFrequencyUnitValue: apiData.addSelectReminderFCount,
          reminderType: apiData.addSelectReminderType,
          status: status
        };
      // console.log(data)
      this.masterService
        .postData("escalation_matrix", data)
        .subscribe((response: any) => {
          if (response.status) {
            this.commonHelper.toasterMessage(response.message);
            this.modalRef.hide();
            this.getLevels(this.gId, this.stateId, this.natureId)
            // this.selectedState = apiData.addSelectState;
            // this.selectedCategory = apiData.addSelectCategory;
            this.getMatrixData(
              this.gId,
              apiData.addSelectState.id,
              this.natureId

            );
          } else {
            this.commonHelper.toasterMessageError(
              CommonConstants.validationMessage
            );
          }
        }, error => {
          this.spinner.hide();
        });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }



  /* update escalate matrix data */
  updateMatrixData() {
    try {
      this.submitted = true;
      // if (this.updateMatrixForm.invalid) {
      //   return;
      // }
      if (this.updateMatrixForm.value.editSelectCategory) {
        this.updateMatrixForm.value.editSelectCategory = this.updateMatrixForm.value.editSelectCategory.grievanceTypeId;
      }
      // this.updateMatrixForm.value.editSelectCategory = this.updateMatrixForm.value.editSelectCategory.grievanceTypeId;
      // this.updateMatrixForm.value.editSelectDistrict = this.updateMatrixForm.value.editSelectDistrict.districtId;
      let apiData = this.updateMatrixForm.value,
        status = apiData.editLevelStatus ? "active" : "inactive";
      // if (apiData.editSelectCategory == undefined) {
      //   apiData.editSelectCategory = apiData.editSelectCategory.grievanceTypeId
      // }


      let data = {
        stateId: apiData.editSelectState.id,
        districtId: apiData.editSelectDistrict.districtId == undefined ? apiData.editSelectDistrict.id : apiData.editSelectDistrict.districtId,
        grievanceTypeId: this.gId,
        grievanceNatureId: this.categoriesNature.length > 0 ? this.natureId : "",
        levelId: this.editLevels,
        timePeriodUnitType: apiData.editSelectTimePeriod,
        timePeriodUnitValue: apiData.editSelectTimePeriodCount,
        reminderFrequencyUnitType: apiData.editSelectReminderF,
        reminderFrequencyUnitValue: apiData.editSelectReminderFCount,
        reminderType: apiData.editSelectReminderType,
        status: status
      };
      //console.log(data)

      this.masterService
        .putData("escalation_matrix/", this.editMatrixData.id, data)
        .subscribe((response: any) => {
          if (response.data) {
            this.commonHelper.toasterMessage(response.message);
            this.modalRef.hide();
            this.selectedState = apiData.editSelectState;
            this.selectedCategory = apiData.editSelectCategory;
            this.selectedNature = []
            this.getMatrixData(
              this.gId,
              apiData.editSelectState.id,
              this.natureId

            );
          } else {
            this.reploatingDataTable();
            this.chRef.detectChanges();
            this.commonHelper.toasterMessageError(
              CommonConstants.validationMessage
            );
          }
        });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }
  /**
   * updating the status of the district
   * @param matrixvalues
   */
  matrixStatus(matrixvalues: any) {
    try {
      let status =
        matrixvalues.escalationMatrixStatus === "active"
          ? "inactive"
          : "active",
        data = { status: status };
      this.masterService.putData("update_escalation_status/", matrixvalues.id, data)
        .subscribe((response: any) => {
          if (response) {
            this.commonHelper.toasterMessage(response.message);
            this.getMatrixData(matrixvalues.grievanceTypeId, matrixvalues.stateId, matrixvalues.grievanceNatureId)
          } else {
            this.commonHelper.toasterMessageError(
              CommonConstants.validationMessage
            );
          }
        });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }


  // function for onChange  Grievance nature 
  onEditNatureChange(value) {
    if (value.length == 0) {
      this.updateMatrixForm.controls['editSelectCategory'].reset();
      this.updateMatrixForm.controls['editSelectLevel'].reset();
    }
    if (value.length > 0) {
      this.updateMatrixForm.controls['editSelectLevel'].reset();
    }
    this.natureId = []
    value.map((data) => {
      //  this.editNature = data
      this.natureId.push(data.id)
    })
  }
}
