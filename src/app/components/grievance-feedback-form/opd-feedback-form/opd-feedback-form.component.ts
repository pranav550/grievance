import { Component, OnInit, TemplateRef } from '@angular/core';
import { MasterService } from './../../master/services/master-service';
import { CommonConstants } from '../../../shared/constants'
import { CommonHelper } from '../../../helper/helper.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, ControlContainer } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DataService } from '../../../shared/service/data.service';

@Component({
  selector: 'app-opd-feedback-form',
  templateUrl: './opd-feedback-form.component.html',
  styleUrls: ['./opd-feedback-form.component.scss'],
  providers: [MasterService, CommonHelper]
})
export class OpdFeedbackFormComponent implements OnInit {
  submitted = false;
  opdForm: FormGroup;
  errorOrResponse = false;
  opdFormStatus: any;
  selectedState: any;
  disableSubmit = true;
  statesData: any;
  selectedDistrict: any;
  errorCheck = false;
  districtsData: any;
  hospitalData: any;
  selectedHospital: any;
  opd: boolean = false;
  addNewUser = {};
  textAreaVal = false;
  opdValue = [];
  isDistrictDataExists: boolean = false;
  isHospitalDataExists: boolean = false;
  opdData: any = [];
  modalRef: BsModalRef;
  currentSelectedLang: string;
  responseOne = {
    "data": [
      {
        "id": 1,
        "question": "Availability of sufficient information in Hospital (Directional & location signages, Registration counter, Laboratory, Radiology Department, Dispensary, etc)",
        "options": "radio"
      },
      {
        "id": 2,
        "question": "Waiting time at the registration counter",
        "options": "radio"
      },
      {
        "id": 3,
        "question": "Behavior and attitude of Hospital Staff.",
        "options": "radio"
      },
      {
        "id": 4,
        "question": "Amenities in waiting area (chairs, fans, drinking water and cleanliness of bathrooms & toilets.",
        "options": "radio"
      },
      {
        "id": 5,
        "question": "Attitude & communication of Doctors.",
        "options": "radio"
      },
      {
        "id": 6,
        "question": "Time spent on consulting, examination and counseling.",
        "options": "radio"
      },
      {
        "id": 7,
        "question": "Availability of Lab and radiology investigation facilities within the hospital.",
        "options": "radio"
      },
      {
        "id": 8,
        "question": "Promptness at Medicine distribution counter.",
        "options": "radio"
      },
      {
        "id": 9,
        "question": "Availability of prescribed drugs at the hospital dispensary",
        "options": "radio"
      },
      {
        "id": 10,
        "question": "Your overall satisfaction during the visit to the hospital.",
        "options": "radio"
      },
      {
        "id": 11,
        "question": "What improvement would you like to see in the hospital?",
        "options": "text"
      },
      {
        "id": 12,
        "question": "What made you come to this hospital for treatment?",
        "options": "text"
      },
      {
        "id": 13,
        "question": "Would you like to return to this hospital next time for treatment?",
        "options": "text"
      },
      {
        "id": 14,
        "question": "Your valuable suggestions.",
        "options": "text"
      }
    ]
  }
  constructor(
    private masterService: MasterService,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.getStates();
    this.getopdFormData();
    this.opdForm = this.filterDefaultValues();

    /*Getting the current Language*/
    this.dataService.currentMessage.subscribe(message =>
      this.currentSelectedLang = message
    );
  }

  /**
  * Get States data
  */
  getStates() {
    try {
      this.spinner.show();
      this.errorOrResponse = false;
      this.masterService.getAll('active_states').subscribe((response: any) => {
        if (response.status && response.data.length > 0) {
          let selectedValue: any;
            response.data.forEach(element => {
              if (element.id == CommonConstants.stateId) {
                selectedValue = element;
              }
            });
          this.selectedState = selectedValue;
          this.statesData = response.data;
          this.getDistricts(selectedValue.id);
          this.getHospitals(selectedValue.id);
          this.spinner.hide();
          this.errorOrResponse = true;
        } else {
          this.statesData = [];
          this.districtsData = [];
          this.hospitalData = [];
          this.spinner.hide();
          this.errorOrResponse = true;
        }
      }, error => {
        this.errorOrResponse = true;
      });
    } catch (exc) {
      this.errorOrResponse = true;
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
    setTimeout(() => {
      this.spinner.hide();
      if (this.errorOrResponse == false) {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, 40000)
  }

  /*state change event*/
  onStateChange(event) {
    if (event) {
      this.getDistricts(event.id);
      this.getHospitals(event.id);
    }
  }

  /**
   * Get districts data
   * @param stateId 
   */
  getDistricts(stateId) {
    try {
      this.masterService.getData('active_districts/', stateId).subscribe((response: any) => {
        if (response.status && response.data && response.data[0].districts.length > 0) {
          this.selectedDistrict = response.data[0].districts[0];
          this.districtsData = response.data[0].districts;
          this.isDistrictDataExists = true;
        } else {
          this.spinner.hide();
          this.districtsData = [];
          this.selectedDistrict = [];
          this.isDistrictDataExists = false;
        }
      }, error => {
      });
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
      this.masterService.getData('active_hospitals/', stateId).subscribe((response: any) => {
        if (response.status && response.data[0].hospitals.length > 0) {
          this.spinner.hide();
          if (response.data[0].hospitals) {
            this.selectedHospital = response.data[0].hospitals[0];
            this.hospitalData = response.data[0].hospitals;
            this.isHospitalDataExists = true;
          }
        } else {
          this.spinner.hide();
          this.hospitalData = [];
          this.selectedHospital = [];
          this.isHospitalDataExists = false;
        }
      }, error => {
      });
    } catch (exc) {
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
  }

  submitReport() {
    this.opd = true;
    this.getopdFormData();
  }

  getopdFormData() {
    try {
      this.errorOrResponse = false;
      this.spinner.show();
      this.masterService.getIpdData('opd_questions_list').subscribe((response: any) => {
        if (response.status && response.data.length > 0) {
          this.spinner.hide();
          this.opdData = this.responseOne.data
          this.opdData.map(item => {
            item.textAreaVal = false;
          })
          this.errorOrResponse = true;
          this.filterDefaultValues();
        } else {
          this.spinner.hide();
          this.opdData = [];
          this.errorOrResponse = true;
        }
      }, error => {
        this.errorOrResponse = true;
      });
    } catch (exc) {
      this.errorOrResponse = true;
      this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
    }
    setTimeout(() => {
      this.spinner.hide();
      if (this.errorOrResponse == false) {
        this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
      }
    }, 40000)
  }

  filterDefaultValues() {
    if (this.opdData.length > 0) {
      this.errorOrResponse = true;
      setTimeout(() => {
        this.opdForm = this.fb.group({});
        this.opdData.forEach(control => {
          this.opdForm.addControl('ratingForm_' + control.id, this.fb.control(''));
        });
      }, 0);
      return this.opdForm;
    }
  }
  //function to diaable or enable the subbmit button
  emptyDisable(event, type, id) {
    if (type == 'textarea') {
      if (event.target.value.length <= 255) {
        this.opdData.map(item => {
          if (id == item.id) {
            this.errorCheck = item.textAreaVal = false;
          }
        })
      } else if (event.target.value.length > 255) {
        this.opdData.map(item => {
          if (id == item.id) {
            this.errorCheck = item.textAreaVal = true;
          }
        })
      }
    }
  }
  opdFeedback() {
    this.submitted = true;
    let questionId;
    let answers = [];
    let data;
    this.modalRef.hide();
    Object.entries(this.opdForm.value).forEach(([key, value]) => {
      if (value != "") {
        let chars = key.slice(0, key.search(/\d/));
        questionId = key.replace(chars, '');
        questionId = parseInt(questionId);
        this.opdData.map(item => {
          if (item.options == 'text') {
            if (item.id == questionId) {
              let ValueOpd = JSON.stringify(value);
              if (ValueOpd.length < 255) {
                this.errorCheck = item.textAreaVal = false;
              } else {
                this.errorCheck = item.textAreaVal = true;
              }
            }
          }
        })
        if (value != null || value != undefined) {
          answers.push({
            "questionId": questionId,
            "answer": value,
          });
        }
      }
    });
    // if (answers.length === this.responseOne.data.length) {
    //   this.disableSubmit = true;
    // } else {
    //   this.disableSubmit = false;
    //   this.commonHelper.toasterMessageError("Please fill all the fields");
    // }
    data = {
      answers,
      grievanceId:localStorage.getItem("grievanceId")
    }
    if (this.disableSubmit == true) {
      if (this.errorCheck == false) {
        this.spinner.show();
        this.errorOrResponse = false;
        try {
          this.masterService.postData('opd_feedback_answer', data).subscribe((response: any) => {
            if (response.data) {
              this.commonHelper.toasterMessage(response.message);
              this.spinner.hide();
              this.errorOrResponse = true;
              this.opd = false;
              this.textAreaVal = false;
              this.opdData.map(item => {
                item.textAreaVal = false;
              });
              this.submitted = false;
            } else {
              this.spinner.hide();
              this.errorOrResponse = true;
              this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
            }
          }, err => {
            this.spinner.hide();
            this.errorOrResponse = true;
            this.textAreaVal = true;
          });
        }
        catch (excp) {
          this.spinner.hide();
        } setTimeout(() => {
          this.spinner.hide();
          if (this.errorOrResponse == false) {
            this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
          }
        }, 40000)
      }
    }
  }

  // Opening confirm IPD Pop-up Modal
  confirmOPDFeedbackModal(template: TemplateRef<any>) {
    let questionId;
    let answers = [];
    Object.entries(this.opdForm.value).forEach(([key, value]) => {
      if (value != "") {
        let chars = key.slice(0, key.search(/\d/));
        questionId = key.replace(chars, '');
        questionId = parseInt(questionId);
        this.opdData.map(item => {
          if (item.options == 'text') {
            if (item.id == questionId) {
              let ValueOpd = JSON.stringify(value);
              if (ValueOpd.length < 255) {
                this.errorCheck = item.textAreaVal = false;
              } else {
                this.errorCheck = item.textAreaVal = true;
              }
            }
          }
        })
        if (value != null || value != undefined) {
          answers.push({
            "questionId": questionId,
            "answer": value,
          });
        }
      }
    });
    if (answers.length === this.responseOne.data.length) {
      this.disableSubmit = true;
      this.modalRef = this.modalService.show(template);
    } else {
      this.disableSubmit = false;
      if (this.currentSelectedLang == 'English') {
        this.commonHelper.toasterMessageError("Please fill all the fields");
      } else {
        this.commonHelper.toasterMessageError("कृपया सभी फ़ील्ड भरें");
      }
    }
  }

}
