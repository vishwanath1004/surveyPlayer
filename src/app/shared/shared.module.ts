import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { IonicModule } from '@ionic/angular';
import { DateTypeInputComponent } from './components/date-type-input/date-type-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageQuestionsComponent } from './components/page-questions/page-questions.component';
import { TextTypeInputComponent } from './components/text-type-input/text-type-input.component';
import { QuestionHeadingComponent } from './components/question-heading/question-heading.component';
import { HintComponent } from './components/hint/hint.component';
import { RadioTypeInputComponent } from './components/radio-type-input/radio-type-input.component';
import { MultipleTypeInputComponent } from './components/multiple-type-input/multiple-type-input.component';
import { MatrixTypeInputComponent } from './components/matrix-type-input/matrix-type-input.component';
import { EvidenceUploadComponent } from './components/evidence-upload/evidence-upload.component';
import { TranslateModule } from '@ngx-translate/core';
import { SliderTypeInputComponent } from './components/slider-type-input/slider-type-input.component';
import { RemarksComponent } from './components/remarks/remarks.component';
import { RemarksModalComponent } from './components/remarks-modal/remarks-modal.component';
import { FooterActionButtonsComponent } from './components/footer-action-buttons/footer-action-buttons.component';

@NgModule({
  declarations: [ItemCardComponent,DateTypeInputComponent,PageQuestionsComponent,TextTypeInputComponent,
    MultipleTypeInputComponent,
    QuestionHeadingComponent,
    HintComponent,
    MatrixTypeInputComponent,
    RadioTypeInputComponent,
    EvidenceUploadComponent,
    SliderTypeInputComponent,
    RemarksComponent,
    RemarksModalComponent,
    FooterActionButtonsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports:[ItemCardComponent,DateTypeInputComponent,PageQuestionsComponent,
    TextTypeInputComponent,
    QuestionHeadingComponent,
    MultipleTypeInputComponent,
    HintComponent,
    MatrixTypeInputComponent,
    RadioTypeInputComponent,
    EvidenceUploadComponent,
    SliderTypeInputComponent,
    RemarksComponent,
    RemarksModalComponent,
    FooterActionButtonsComponent],
  providers:[   
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
