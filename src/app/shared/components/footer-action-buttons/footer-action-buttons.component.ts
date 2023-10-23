import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UtilServiceService } from "../../services/util.service.service";

@Component({
  selector: 'app-footer-action-buttons',
  templateUrl: './footer-action-buttons.component.html',
  styleUrls: ['./footer-action-buttons.component.scss'],
})
export class FooterActionButtonsComponent {
  text: string;
  _data : any;

  @Input() updatedData: any;
  @Input()
  get data() {
    return this._data;
  }
  set data(data) {
    this._data = JSON.parse(JSON.stringify(data));
  }
  @Input() isFirst: boolean;
  @Input() isStartBTNEnabled:boolean;
  @Input() showStartButton : boolean = false;
  @Input() isLast: boolean;
  @Output() nextAction = new EventEmitter();
  @Output() backAction = new EventEmitter();
  @Output() openSheetAction = new EventEmitter();
  @Output() startAction = new EventEmitter();
  @Output() allowStart = new EventEmitter();
  @Input() completedQuestionCount = 0;
  @Input() questionCount = 0;
  @Input() isSubmitted: any;
  @Input() enableGps: any;
  @Input() showSubmit: any;
  @Input() viewOnly:boolean = false;

  percentage: number = 0;

  constructor(
    private utils: UtilServiceService,
    private translate: TranslateService,
    // private toast : ToastService
  ) {}
  ngOnChanges() {
    if (this.completedQuestionCount > 0) {
      this.percentage = this.questionCount ? (this.completedQuestionCount / this.questionCount) * 100 : 0;
      this.percentage = Math.trunc(this.percentage);
    } else {
      this.percentage = this.isSubmitted ? 100 : 0;
      this.completedQuestionCount = this.isSubmitted ? this.questionCount : 0;
    }
  }
  next(status?: string): void {
    this.nextAction.emit(status);
  }

  back(): void {
    this.backAction.emit();
  }

  gpsFlowChecks(action : any, status : any) {
    if (this.updatedData.responseType.toLowerCase() === "slider") {
      if (
        !this.updatedData.gpsLocation ||
        JSON.stringify(this._data.value) !== JSON.stringify(this.updatedData.value)
      ) {
      } else if (JSON.stringify(this._data.value) === JSON.stringify(this.updatedData.value)) {
        if (action === "next") {
          this.next(status);
        } else {
          this.back();
        }
      }
    } else if (this.updatedData.responseType.toLowerCase() === "pagequestions") {
      if (
        JSON.stringify(this._data.pageQuestions) !== JSON.stringify(this.updatedData.pageQuestions)
        // &&
        // this.utils.isPageQuestionComplete(this.updatedData)
      ) {
      } else {
        if (action === "next") {
          this.next(status);
        } else {
          this.back();
        }
      }
    } else if (JSON.stringify(this._data.value) !== JSON.stringify(this.updatedData.value)) {
    } else {
      if (action === "next") {
        this.next(status);
      } else {
        this.back();
      }
    }
  }

  // getGpsLocation(action, status) {
  //   this.utils.startLoader();
  //   this.ngps
  //     .getGpsStatus()
  //     .then((success) => {
  //       this.updatedData.gpsLocation = success;
  //       this.utils.stopLoader();
  //       if (action === "next") {
  //         this.next(status);
  //       } else {
  //         this.back();
  //       }
  //     })
  //     .catch((error) => {
  //       this.utils.stopLoader();
  //     });
  // }

  openAction() {
    this.openSheetAction.emit()
  }

  allowStartingObservation(){
    this.allowStart.emit();
  }

  startBtnAction(){
   if(!this.isStartBTNEnabled){
    let msg;
    this.translate.get(['FRMELEMENTS_MSG_FOR_NONTARGETED_USERS_QUESTIONNAIRE']).subscribe((translations) => {
      msg = translations['FRMELEMENTS_MSG_FOR_NONTARGETED_USERS_QUESTIONNAIRE'];
      // this.toast.openToast(msg,'','top');
    });
   } else{
     // TODO navigate to observation details page.
     this.startAction.emit();
   }
  }

}
