import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UtilServiceService } from '../../services/util.service.service';
@Component({
  selector: 'app-matrix-type-input',
  templateUrl: './matrix-type-input.component.html',
  styleUrls: ['./matrix-type-input.component.scss'],
})
export class MatrixTypeInputComponent  implements OnInit {
  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter();
  @Output() updateLocalData = new EventEmitter();
  @Input() evidenceId: string;
  @Input() schoolId: string;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() submissionId: string;
  @Input() inputIndex : number;
  @Input() enableGps : any;
  @Input() enableQuestionReadOut: boolean;
  mainInstance: any;
  initilaData : any;
  constructor(
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private utils: UtilServiceService    ) { }

  ngOnInit() {
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
    this.initilaData = JSON.parse(JSON.stringify(this.data));
  }

  next(status?: any) {
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

  addInstances(): void {
    this.data.value = this.data.value ? this.data.value : [];
    this.data.value.push(JSON.parse(JSON.stringify(this.data.instanceQuestions)));
    this.checkForValidation();
  }

  async viewInstance(i : number) {
    const obj = {
      selectedIndex: i,
      data: JSON.parse(JSON.stringify(this.data)),
      evidenceId: this.evidenceId,
      schoolId: this.schoolId,
      generalQuestion: this.generalQuestion,
      submissionId: this.submissionId,
      questionIndex: this.inputIndex,
      enableQuestionReadOut: this.enableQuestionReadOut
    }
    let matrixModal = await this.modalCtrl.create({
      component: '',
      componentProps: obj
    });

    await matrixModal.present();

    const { data } = await matrixModal.onDidDismiss()
    this.updateInstance(i, data)
    // matrixModal.onDidDismiss(instanceValue => {
    //   if (this.enableGps) {
    //     this.checkForGpsLocation(i, instanceValue)
    //   } else {
    //     this.updateInstance(i, instanceValue)
    //   }
    // })
  }

  // checkForGpsLocation(instanceIndex, instanceValue) {
  //   if (JSON.stringify(instanceValue) !== JSON.stringify(this.data.value[instanceIndex]) && this.checkCompletionOfInstance(instanceValue, null)) {
  //     this.utils.startLoader();
  //     this.ngps.getGpsStatus().then(success => {
  //       this.utils.stopLoader();
  //       this.updateInstance(instanceIndex, instanceValue, success)
  //     }).catch(error => {
  //       this.utils.stopLoader();
  //       this.utils.openToast("Please try again.");
  //     })
  //   } else {
  //     this.updateInstance(instanceIndex, instanceValue)
  //   }
  // }

  updateInstance(instanceIndex : number, instanceValue : any, gpsLocation?: any) {
    if (instanceValue) {
      this.data.completedInstance = this.data.completedInstance ? this.data.completedInstance : [];
      this.data.value[instanceIndex] = instanceValue;
      let instanceCompletion = this.checkCompletionOfInstance(this.data.value[instanceIndex], gpsLocation);
      if (instanceCompletion) {
        this.data.value[instanceIndex].isInstanceCompleted = true
        if (this.data.completedInstance.indexOf(instanceIndex) < 0) {
          this.data.completedInstance.push(instanceIndex);
        }
      } else {
       this.data.value[instanceIndex].isInstanceCompleted = false
        const index = this.data.completedInstance.indexOf(instanceIndex);
        if (index >= 0) {
          this.data.completedInstance.splice(index, 1);
        }
      }
      this.checkForValidation();
    }
  }

  checkCompletionOfInstance(data : any, gpsLocation : any): boolean {
    let isCompleted = true;
    if (data) {
      for (const question of data) {
        question.gpsLocation = gpsLocation ? gpsLocation : "";
        if (!question.isCompleted) {
          isCompleted = false;
          return false
        }
      }
    } else {
      isCompleted = false
    }

    return isCompleted

  }

  deleteInstance(instanceIndex : number): void {
    this.data.value.splice(instanceIndex, 1);
    if (this.data.completedInstance && this.data.completedInstance.length && this.data.completedInstance.indexOf(instanceIndex) >= 0) {
      this.data.completedInstance.splice(instanceIndex, 1);
    }
    this.checkForValidation();

    // }
  }

  checkForValidation(): void {
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.data.endTime = this.data.isCompleted ? Date.now() : "";
    this.updateLocalData.emit();
  }


  async deleteInstanceAlert(index : number) {
    let translateObject : any;
    this.translate.get(['FRMELEMNTS_LBL_COFIRMATION_DELETE', 'FRMELEMNTS_LBL_COFIRMATION_DELETE_INSTANCE', 'NO', 'YES']).subscribe(translations => {
      translateObject = translations;
    })
    let alert = await this.alertCtrl.create({
      header: translateObject['FRMELEMNTS_LBL_COFIRMATION_DELETE'],
      message: translateObject['FRMELEMNTS_LBL_COFIRMATION_DELETE_INSTANCE'],
      cssClass:'attachment-delete-alert',
      buttons: [
        {
          text: translateObject['NO'],
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: translateObject['YES'],
          handler: () => {
            this.deleteInstance(index);
          }
        }
      ]
    });
    await alert.present();
  }

  getLastModified(instance : any) {
    let lastModifiedAt = 0;
    for (const question of instance) {
      if (question.startTime > lastModifiedAt) {
        lastModifiedAt = question.startTime;
      }
    }
    return lastModifiedAt
  }

}
