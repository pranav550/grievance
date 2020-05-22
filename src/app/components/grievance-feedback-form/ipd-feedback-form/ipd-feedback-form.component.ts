import { Component, OnInit, TemplateRef } from '@angular/core';
import { MasterService } from './../../master/services/master-service';
import { CommonConstants } from '../../../shared/constants'
import { CommonHelper } from '../../../helper/helper.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, ControlContainer } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DataService } from '../../../shared/service/data.service'

@Component({
  selector: 'app-ipd-feedback-form',
  templateUrl: './ipd-feedback-form.component.html',
  styleUrls: ['./ipd-feedback-form.component.scss'],
  providers: [MasterService, CommonHelper, DatePipe]
})
export class IpdFeedbackFormComponent implements OnInit {
  submitted = false;
  ipdForm: FormGroup;
  errorOrResponse = false;
  disableSubmit = true;
  ipdFormStatus: any;
  selectedState: any;
  maxDate = new Date();
  maxDateJoin = new Date();
  statesData: any;
  errorCheck = false;
  selectedDistrict: any;
  districtsData: any;
  hospitalData: any;
  selectedHospital: any;
  ipd: boolean = false;
  addNewUser = {};
  ipdValue = [];
  isDistrictDataExists: boolean = false;
  isHospitalDataExists: boolean = false;
  genderData = [{ name: 'Male' }, { name: 'Female' }, { name: 'Transgender' }]
  modalRef: BsModalRef;
  currentSelectedLang: string;
  responseOne = {
    "data": [
      {
        "id": 37,
        "question": "Age",
        "options": "input"
      },
      {
        "id": 38,
        "question": "Gender",
        "options": "dropdown"
      },
      {
        "id": 35,
        "question": "Date",
        "options": "calendar"
      },
      {
        "id": 39,
        "question": "Date of Admission",
        "options": "calendar"
      },
      {
        "id": 36,
        "question": "Ward",
        "options": "text-box"
      },
      {
        "id": 33,
        "question": "What made you come to this hospital for treatment?",
        "options": "text"
      },
      {
        "id": 18,
        "question": "Your feedback on discharge process.",
        "options": "text"
      },
      {
        "id": 34,
        "question": "Your valuable suggestions.",
        "options": "text"
      },
      {
        "id": 15,
        "question": "Availability of sufficient information at Registration/ Admission counter (Directional & location signages, Registration counter, Laboratory, Radiology Department, Dispensary, etc).",
        "options": "radio"
      },
      {
        "id": 16,
        "question": "Waiting time at the registration/admission counter.",
        "options": "radio"
      },
      {
        "id": 17,
        "question": "Behavior and attitude of Hospital Staff at the registration/admission counter.",
        "options": "radio"
      },
      {
        "id": 19,
        "question": "Cleanliness of the ward.",
        "options": "radio"
      },
      {
        "id": 20,
        "question": "Cleanliness of bathrooms & toilets.",
        "options": "radio"
      },
      {
        "id": 21,
        "question": "Cleanliness of bed sheets, pillow-covers etc.",
        "options": "radio"
      },
      {
        "id": 22,
        "question": "Cleanliness of surroundings and campus drains.",
        "options": "radio"
      },
      {
        "id": 23,
        "question": "Regularity of Doctor’s attention.",
        "options": "radio"
      },
      {
        "id": 24,
        "question": "Attitude and communication of Doctors.",
        "options": "radio"
      },
      {
        "id": 25,
        "question": "Time spent for examination of patient and counseling. Promptness in response by Nurses in the ward.",
        "options": "radio"
      },
      {
        "id": 26,
        "question": "Round the clock availability of nurses in the ward.",
        "options": "radio"
      },
      {
        "id": 27,
        "question": "Attitude and communication of nurses.",
        "options": "radio"
      },
      {
        "id": 28,
        "question": "Availability, attitude & promptness of Ward boys/girls.",
        "options": "radio"
      },
      {
        "id": 29,
        "question": "All prescribed drugs were made available from hospital supply. Your perception of doctor’s knowledge.",
        "options": "radio"
      },
      {
        "id": 30,
        "question": "Diagnostics services were provided within the hospital.",
        "options": "radio"
      },
      {
        "id": 31,
        "question": "Timeliness of supply of the diet and its quality",
        "options": "radio"
      },
      {
        "id": 32,
        "question": "Your over-all satisfaction during the treatment as an inpatient.",
        "options": "radio"
      }
    ],

  }
  IpdData: any = [];

  IPDForm: FormGroup;
  constructor(
    private masterService: MasterService,
    private commonHelper: CommonHelper,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private dataService: DataService
  ) {
    this.maxDateJoin.setDate(this.maxDate.getDate());
  }

  ngOnInit() {
    this.getStates();
    this.getIpdFormData();
    this.ipdForm = this.filterDefaultValues();

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
    this.ipd = true;
    this.getIpdFormData();
  }
  getIpdFormData() {
    try {
      this.errorOrResponse = false;
      this.spinner.show();
      this.masterService.getIpdData('ipd_questions_list').subscribe((response: any) => {
        if (response.status && response.data.length > 0) {
          this.spinner.hide();
          // this.IpdData = response.data;
          this.IpdData = this.responseOne.data;
          this.errorOrResponse = true;
          this.IpdData.map(item => {
            item.textAreaVal = false;
          })
          this.filterDefaultValues();
        } else {
          this.spinner.hide();
          this.IpdData = [];
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
    if (this.IpdData.length > 0) {
      this.errorOrResponse = true;
      setTimeout(() => {
        this.ipdForm = this.fb.group({});
        this.IpdData.forEach(control => {
          if (control.id == 38) {
            this.ipdForm.addControl('ratingForm_' + control.id, this.fb.control([]));
          } else {
            this.ipdForm.addControl('ratingForm_' + control.id, this.fb.control(''));
          }

        });
      }, 0);
      return this.ipdForm;
    }
  }
  //function to diaable or enable the subbmit button
  emptyDisable(event, type, id) {
    if (type == 'textarea') {
      if (event.target.value.length <= 255) {
        this.IpdData.map(item => {
          if (id == item.id) {
            this.errorCheck = item.textAreaVal = false;
          }
        })
      } else if (event.target.value.length > 255) {
        this.IpdData.map(item => {
          if (id == item.id) {
            this.errorCheck = item.textAreaVal = true;
          }
        })
      }
    }
  }

  ipdFeedback() {
    this.submitted = true;
    let questionId;
    let answers = [];
    let data;
    this.modalRef.hide();
    Object.entries(this.ipdForm.value).forEach(([key, value]) => {
      if (value != "") {
        var chars = key.slice(0, key.search(/\d/));
        questionId = key.replace(chars, '');
        questionId = parseInt(questionId);
        this.IpdData.map(item => {
          if (item.options == 'text') {
            if (item.id == questionId) {
              let ValueOpd = JSON.stringify(value);
              if (ValueOpd.length < 255) {
                item.textAreaVal = false;
              } else {
                item.textAreaVal = true;
              }
            }
          }
          if (item.options == 'calendar' && item.id == questionId && value != "Invalid Date") {
            value = this.datepipe.transform(value, "yyyy-MM-dd ");
          }
          if (item.options == 'dropdown' && item.id == questionId) {
            value = value['name'];
          }
        })
        // this.disableSubmit = false;
        if (value == "Invalid Date") {
          value = null
        }
        if (value != null || value != undefined) {
          answers.push({
            "questionId": questionId,
            "answer": value,


          });
        }
      }
    });

    data = {
      answers,
      grievanceId: localStorage.getItem("grievanceId")
    }

    if (this.errorCheck == false && this.disableSubmit == true) {
      this.spinner.show();
      this.errorOrResponse = false;
      try {
        this.masterService.postData('ipd_feedback_answer', data).subscribe((response: any) => {
          if (response.data) {
            this.commonHelper.toasterMessage(response.message);
            this.spinner.hide();
            this.errorOrResponse = true;
            this.ipd = false;
            this.IpdData.map(item => {
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
        });
      }
      catch (excp) {
        this.spinner.hide();
      }
      setTimeout(() => {
        this.spinner.hide();
        if (this.errorOrResponse == false) {
          this.commonHelper.toasterMessageError(CommonConstants.validationMessage);
        }
      }, 40000)
    }
  }

  // Opening confirm IPD Pop-up Modal
  confirmIPDFeedbackModal(template: TemplateRef<any>) {
    let questionId;
    let answers = [];
    Object.entries(this.ipdForm.value).forEach(([key, value]) => {
      if (value != "") {
        var chars = key.slice(0, key.search(/\d/));
        questionId = key.replace(chars, '');
        questionId = parseInt(questionId);
        this.IpdData.map(item => {
          if (item.options == 'text') {
            if (item.id == questionId) {
              let ValueOpd = JSON.stringify(value);
              if (ValueOpd.length < 255) {
                item.textAreaVal = false;
              } else {
                item.textAreaVal = true;
              }
            }
          }
          if (item.options == 'calendar' && item.id == questionId && value != "Invalid Date") {
            value = this.datepipe.transform(value, "yyyy-MM-dd ");
          }
          if (item.options == 'dropdown' && item.id == questionId) {
            value = value['name'];
          }
        })
        this.disableSubmit = false;
        if (value == "Invalid Date") {
          value = null
        }
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