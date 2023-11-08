import { Component, OnInit,Input } from '@angular/core';
import { AttachmentService } from '../../services/attachment.service';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

@Component({
  selector: 'app-evidence-upload',
  templateUrl: './evidence-upload.component.html',
  styleUrls: ['./evidence-upload.component.scss'],
})
export class EvidenceUploadComponent  implements OnInit {
  recording: boolean = false;
  filesPath: string;
  fileName: string;
  audioList: any[] = [];
  interval : string;
  timeLeft: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  path : string;
  text: string;
  datas : any;
  appFolderPath: string;
  videoFormats = ["mp4", "WMV", "WEBM", "flv", "avi", "3GP", "OGG","mov"];
  audioFormats = ["AIF", "cda", "mpa", "ogg", "wav", "wma", "mp3"];
  pptFormats = ["ppt", "pptx", "pps", "ppsx"];
  wordFormats = ["docx", "doc", "docm", "dotx"];
  imageFormats = ["jpg", "png", "jpeg"];
  pdfFormats = ["pdf"];
  spreadSheetFormats = ["xls", "xlsx"];

  @Input()
  set data(data :any) {
    this.datas = data;
    this.createImageFromName(data["fileName"]);
  }

  get name() {
    return true;
  }
  @Input() evidenceId: any;
  @Input() schoolId: string;
  @Input() submissionId: any;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;

  imageList: Array<any> = [];
  imageNameCounter: number = 0;
  localEvidenceImageList: any;

  constructor( 
    private attachmentService :AttachmentService,
    private alertCtrl :AlertController,
    private translate : TranslateService,
    private file : File,
    private platform : Platform,
    private fileOpener: FileOpener
    ) { }

  ngOnInit() {
    this.path = this.platform.is("ios") ? this.file.documentsDirectory : this.file.externalDataDirectory;
    this.imageList =[];
    this.createImageFromName(this.datas["fileName"]);
  }

  async openActionSheet() {
    this.attachmentService.evidenceUploadF(this.appFolderPath).then((data:any) =>{
      if(data.data){
      this.imageList.push(data.data);
      this.setLocalDatas(data.data);
      }
    })
    }

    stopRecord(){}
    getExtensionFromName(fileName : string) {
      let splitString = fileName.split(".");
      let extension = splitString[splitString.length - 1];
      return extension;
    }
  setLocalDatas(fileName: any) {
    this.datas.fileName.push(fileName);
  }
  createImageFromName(imageList : any) {
    for (const image of imageList) {
          this.imageList.push(image);
        }
    }

    removeImgFromList(index : number): void {
      this.datas.fileName.splice(index, 1);
      this.imageList =[];
      this.createImageFromName(this.datas["fileName"]);
    }
  
    async deleteImageAlert(index :number) {
      let translateObject :any;
      this.translate
        .get([
          "FRMELEMNTS_LBL_COFIRM_DELETE",
          "FRMELEMNTS_LBL_NO",
          "FRMELEMNTS_LBL_YES",
        ])
        .subscribe((translations) => {
          translateObject = translations;
        });
      let alert = await this.alertCtrl.create({
        // header: translateObject["FRMELEMNTS_LBL_COFIRM_DELETE"],
        message: translateObject["FRMELEMNTS_LBL_COFIRM_DELETE"],
        cssClass:'central-alert',
        buttons: [
          {
            text: translateObject["FRMELEMNTS_LBL_NO"],
            role: "cancel",
            handler: () => { },
          },
          {
            text: translateObject["FRMELEMNTS_LBL_YES"],
            handler: () => {
              this.removeImgFromList(index);
            },
          },
        ],
      });
      await alert.present();
    }
    openFile(attachment :any) {
      this.fileOpener.open(this.path + '/' + attachment.name, attachment.type)
        .then(() => { console.log('File is opened'); })
        .catch(e => {
          // this.toast.showMessage(e.message,'danger');
        });
    }
  }
