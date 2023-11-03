// import { DatePipe } from '@angular/common';
import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { UtilServiceService } from '../../services/util.service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-type-input',
  templateUrl: './date-type-input.component.html',
  styleUrls: ['./date-type-input.component.scss'],
})
export class DateTypeInputComponent  implements OnInit {

  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() schoolId: string;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() submissionId:any;
  @Input() inputIndex :any;
  @Input() hideButton: boolean;
  @Input() enableQuestionReadOut: boolean;

  questionValid: boolean;
  currentDate: any;
  futureDate: number;
  calendarOpen : boolean = false;

  constructor(
    private utils: UtilServiceService,
    private datePipe: DatePipe
  ) {
    this.getFutureDate();

  }

  next(status?: string) {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    if (!this.data.validation.required) {
      this.data.isCompleted = true;
    }
    this.nextCallBack.emit(status);
  }

  captureTime(): void {
    const parseString = this.data.dateFormat;
    this.data.value = new Date(Date.now()).toISOString();
    this.checkForValidation();
  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

  canceled() {
  }

  ngOnInit() {
    const dateTime = new Date();
    this.data.validation.max = this.data.validation.max === "currentDate" ? new Date().toISOString().split('T')[0] : this.data.validation.max;
    this.data.validation.min = this.data.validation.min === "currentDate" ? new Date().toISOString().split('T')[0] : this.data.validation.min;
    this.checkForValidation();
    if(this.data?.dateFormat)this.data.dateFormat =  this.data?.dateFormat.replace("DD", "dd")
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
  }

  getFutureDate() {
    let currentDate = new Date();
    this.futureDate = currentDate.getFullYear() + 10
  }

  checkForValidation(): void {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.data.endTime = this.questionValid ? Date.now() : "";
    this.calendarPopover(false);
  }
  calendarPopover(isOpen : boolean){
    if(!this.data?.autoCapture){
      this.calendarOpen =  isOpen;
    }
  }

}
