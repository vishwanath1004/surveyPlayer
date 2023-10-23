import { Component, OnInit,Input } from '@angular/core';
import { AttachmentService } from '../../services/attachment.service';

// import { File } from '@ionic-native/file/ngx';
// import { FILE_EXTENSION_HEADERS } from '../../constants/file-extensions';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
// import { Platform } from '@ionic/angular';



declare let cordova: any;

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
  // isIos: boolean = this.platform.is("ios");
  interval : string;
  timeLeft: number = 0;
  minutes: number = 0;
  seconds: number = 0;

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
    // this.createImageFromName(data["fileName"]);
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
    // private file: File,
    // private platform: Platform,
    // private fileOpener:FileOpener,
    private attachmentService :AttachmentService 
    ) { 
    // this.isIos = this.platform.is("ios") ? true : false;
    // if (this.isIos) {
    //   this.file
    //     .checkDir(this.file.documentsDirectory, "images")
    //     .then((success : any) => { })
    //     .catch((err : any) => {
    //       this.file
    //         .createDir(cordova.file.documentsDirectory, "images", false)
    //         .then(
    //           (success : any) => { },
    //           (error : any) => { }
    //         );
    //     });
    // } else {
    //   this.file
    //     .checkDir(this.file.externalDataDirectory, "images")
    //     .then((success : any) => { })
    //     .catch((err : any) => {
    //       this.file
    //         .createDir(cordova.file.externalDataDirectory, "images", false)
    //         .then(
    //           (success : any) => { },
    //           (error : any) => { }
    //         );
    //     });
    // }
  }

  ngOnInit() {
    // this.appFolderPath = this.isIos
    // ? cordova.file.documentsDirectory + "images"
    // : cordova.file.externalDataDirectory + "images";
  }

  async openActionSheet() {
    console.log("openActionSheet");
    this.attachmentService.evidenceUpload(this.appFolderPath).then((data:any) =>{
      if(data.data){
        if(data.data.multiple &&data.data.imageData ){
          for (const image of data.data.imageData) {
            this.checkForLocalFolder(image);
          }
        }else {
        // this.pushToFileList(data.data.name);
        }
      }
    })
    }

  
    checkRecordMediaPermission(){}
    deleteImageAlert(index : number){}
    // previewFile(fileName : any, extension :any) {
    //   this.fileOpener
    //     .open(
    //       this.appFolderPath + "/" + fileName,
    //       FILE_EXTENSION_HEADERS[extension]
    //     )
    //     .then(() => console.log("File is opened"))
    //     .catch((e : any) => {
    //      // this.toast.openToast("No file readers available")
    //     });
    // }
    stopRecord(){}
    checkForLocalFolder(imagePath : any) {
      let currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
      let currentPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
      // if (this.isIos) {
      //   this.file
      //     .checkDir(this.file.documentsDirectory, "images")
      //     .then((success) => {
      //       this.copyFileToLocalDir(currentPath, currentName);
      //     })
      //     .catch((err) => {
      //       this.file
      //         .createDir(cordova.file.documentsDirectory, "images", false)
      //         .then(
      //           (success) => {
      //             this.copyFileToLocalDir(currentPath, currentName);
      //           },
      //           (error) => { }
      //         );
      //     });
      // } else {
      //   this.file
      //     .checkDir(this.file.externalDataDirectory, "images")
      //     .then((success) => {
      //       this.copyFileToLocalDir(currentPath, currentName);
      //     })
      //     .catch((err) => {
      //       this.file
      //         .createDir(cordova.file.externalDataDirectory, "images", false)
      //         .then(
      //           (success) => {
      //             this.copyFileToLocalDir(currentPath, currentName);
      //           },
      //           (error) => { }
      //         );
      //     });
      // }
    }

    getExtensionFromName(fileName : string) {
      let splitString = fileName.split(".");
      let extension = splitString[splitString.length - 1];
      return extension;
    }
  // createImageFromName(imageList : any) {
  //   this.isIos = this.platform.is("ios") ? true : false;
  //   this.appFolderPath = this.isIos
  //     ? cordova.file.documentsDirectory + "images"
  //     : cordova.file.externalDataDirectory + "images";
  //   for (const image of imageList) {
  //     this.file
  //       .checkFile(this.appFolderPath + "/", image)
  //       .then((response) => {
  //         this.imageList.push({
  //           data: "",
  //           imageName: image,
  //           extension: this.getExtensionFromName(image),
  //         });
  //       })
  //       .catch((error) => {
  //         this.imageList.push(image);
  //       });
  //   }
  // }

  // createFileName(filename : any) {
  //   let d = new Date(),
  //     n = d.getTime(),
  //     extension= filename.split('.').pop(),
  //     newFileName = n + "." + extension;
  //   return newFileName;
  // }

  // copyFileToLocalDir(namePath: any, currentName: any) {

  //   let newName = this.createFileName(currentName);
  //   this.file
  //     .copyFile(namePath, currentName, this.appFolderPath, newName)
  //     .then(
  //       (success) => {
  //         this.pushToFileList(newName);
  //       },
  //       (error) => { }
  //     );
  // }

  // pushToFileList(fileName: any) {
  //   this.file
  //     .checkFile(this.appFolderPath + "/", fileName)
  //     .then((response) => {
  //       this.imageList.push({
  //         data: "",
  //         imageName: fileName,
  //         extension: this.getExtensionFromName(fileName),
  //       });
  //       this.setLocalDatas(fileName);

  //     })
  // }

  setLocalDatas(fileName: any) {
    this.datas.fileName.push(fileName);
  }

}
