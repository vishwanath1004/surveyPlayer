import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SurveyDetailsComponent } from '../survey-details/survey-details.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [HomePage,SurveyDetailsComponent],
  exports:[SurveyDetailsComponent]
})
export class HomePageModule {}
