import { Injectable } from "@angular/core";
import { ActionSheetController, Platform, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { FILE_EXTENSION_HEADERS } from "../constants/file-extensions";
declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  mediaType: string;
  texts: any;
  payload: any;
  actionSheetOpen: boolean = false;
  storagePath : any;

  constructor(
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private platform: Platform,
    private translate: TranslateService,
  ) {
    this.translate
      .get([
        "FRMELEMNTS_MSG_SELECT_IMAGE_SOURCE",
        "CANCEL",
        "FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE",
        "FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED",
        "FRMELEMNTS_MSG_ERROR_FILE_SIZE_LIMIT",
        "FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED",
        "FRMELEMENTS_LBL_CAMERA",
        "FRMELEMENTS_LBL_UPLOAD_IMAGE",
        "FRMELEMENTS_LBL_UPLOAD_FILE",
        "FRMELEMENTS_LBL_UPLOAD_VIDEO"
      ])
      .subscribe((data) => {
        this.texts = data;
      });
  }

// Evidence upload for survey and observation
  async evidenceUpload(path?:any) {
    const actionSheet = await this.actionSheetController.create({
      header: this.texts["FRMELEMNTS_MSG_SELECT_IMAGE_SOURCE"],
      cssClass: 'sb-popover',
      buttons: [
        // {
        //   text: this.texts["FRMELEMENTS_LBL_CAMERA"],
        //   icon: "camera",
        //   handler: () => {
        //     this.getFile('image/*','camera');
        //     return false;
        //   },
        // },
        {
          text: this.texts["FRMELEMENTS_LBL_UPLOAD_IMAGE"],
          icon: "cloud-upload",
          handler: () => {
            this.getFile('image/*');
            return false;
          },
        },
        {
          text: this.texts["FRMELEMENTS_LBL_UPLOAD_VIDEO"],
          icon: "videocam",
          handler: () => {
          this.getFile('video/*');
            return false;
          },
        },
        {
          text: this.texts["FRMELEMENTS_LBL_UPLOAD_FILE"],
          icon: "document",
          handler: () => {
            this.getFile('application/pdf');
            return false;
          },
        },
        {
          text: this.texts["CANCEL"],
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
    return actionSheet.onDidDismiss();
  }

  getFile(acceptType:string, capture?:string){
    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = acceptType;
    cameraInput.click();
    capture ? cameraInput.capture = capture :'';
    cameraInput.onchange = (event : any) => {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.size <= 50000000) {
        // const localPath = window.URL.createObjectURL(selectedFile);
        const reader = new FileReader();
        let newFileName =  this.createFileName(selectedFile.name)
          // key newFileName :e.target.result
        reader.onload = (e:any) => {
          const data = {
                        name: newFileName,
                        type: this.mimeType(newFileName),
                        isUploaded: false,
                        data:e.target.result,
                      };
                    this.presentToast(this.texts["FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED"], "success");
                    this.actionSheetController.dismiss(data);
        };
        reader.readAsDataURL(selectedFile);
      }else{
        this.presentToast(this.texts["FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED"], "danger");
      }
  };
  }
 
  async presentToast(text : string, color = "danger", duration = 3000) {
    const toast = await this.toastController.create({
      message: text,
      position: "top",
      duration: duration,
      color: color,
    });
    toast.present();
  }

  createFileName(name: string) {
    let d = new Date(),
      n = d.getTime(),
      extentsion = name.split(".").pop(),
      newFileName = n + "." + extentsion;
    return newFileName;
  }

  directoryPath(): string {
    if(this.actionSheetOpen && this.storagePath){
      return this.storagePath;
    }else
    if (this.platform.is("ios")) {
      return window.File.documentsDirectory;
    } else {
      return window.File.externalDataDirectory;
    }
  }

  mimeType(fileName : string) {
    let ext :any = fileName.split(".").pop();
    return FILE_EXTENSION_HEADERS[ext];
  }

  deleteFile(fileName : string) {
   // return this.file.removeFile(this.directoryPath(), fileName);
  }


}




