import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilServiceService } from '../../services/util.service.service';
import { HintComponent } from '../hint/hint.component';

@Component({
  selector: 'app-radio-type-input',
  templateUrl: './radio-type-input.component.html',
  styleUrls: ['./radio-type-input.component.scss'],
})
export class RadioTypeInputComponent implements OnInit {
  @Input() inputIndex :number ;
  @Input() data:any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() hideButton: boolean;
  @Input() schoolId: string;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() submissionId: any;
  @Input() enableQuestionReadOut: boolean;

  color: string = 'light';
  isComplete: boolean;

  constructor(
    private utils: UtilServiceService, 
    private modalCtrl:ModalController
    // private hintService: HintProvider
    ) {


  }

  ngOnInit() {
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
    if(!this.data.validation.required) {
      this.data.isCompleted = true;
    }
    

  }

  // updateData(event : Event){
  //   this.data.fileName = [...this.data.fileName]
  // }
  next(status?:any) {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit();
  }

  checkForValidation(): void {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.data.endTime = this.data.isCompleted ? Date.now() : "";
  }

  async openHint(hint : any){
    let hintModal = await this.modalCtrl.create({
      component: HintComponent,
      componentProps: {
        hint,
      },
    });
    hintModal.present();
  
  }

  checkForCompletion() {
    
  }

}
