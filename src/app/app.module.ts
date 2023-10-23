import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { FilePath } from '@ionic-native/file-path/ngx';


import { Camera} from "@ionic-native/camera/ngx";
// import { Chooser } from "@ionic-native/chooser/ngx";
// import { FilePath } from "@ionic-native/file-path/ngx";
// import { ImagePicker } from '@ionic-native/image-picker/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx';

export function translateHttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports:[AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot(), 
    TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (translateHttpLoaderFactory),
      deps: [HttpClient]
    }
  }),HttpClientModule,
  SharedModule,
 ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private translate: TranslateService) {
    this.setDefaultLanguage();
    console.log('Onboarding Config');
    
  }

  private setDefaultLanguage() {
    this.translate.setDefaultLang('en');
  }
}
