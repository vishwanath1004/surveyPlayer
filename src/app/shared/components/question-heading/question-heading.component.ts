import { Component,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HintComponent } from '../hint/hint.component';

@Component({
  selector: 'app-question-heading',
  templateUrl: './question-heading.component.html',
  styleUrls: ['./question-heading.component.scss'],
})
export class QuestionHeadingComponent  {
  text: string;
  @Input() data :any;
  @Input() inputIndex : number;
  @Input() enableQuestionReadOut: boolean;
  showQuestionNumber = false;
  play = false;

  
  constructor( private modalCtrl: ModalController) { }

  async openHint(hint:any) {
    let hintModal = await this.modalCtrl.create({
      component: HintComponent,
      componentProps: {
        hint,
      },
    });
    hintModal.present();
  }
}
