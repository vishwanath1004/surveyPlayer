import { Injectable } from "@angular/core";
import { Camera, CameraOptions, MediaType, PictureSourceType } from "@ionic-native/camera/ngx";
// import { Chooser } from "@ionic-native/chooser/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
// import { File } from "@ionic-native/file/ngx";
import { ActionSheetController, Platform, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
// import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { FILE_EXTENSION_HEADERS } from "../constants/file-extensions";

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
    private camera: Camera,
    // private file: File,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private platform: Platform,
    // private filePath: FilePath,
    // private chooser: Chooser,
    private translate: TranslateService,
    // private imgPicker: ImagePicker,

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
        console.log( this.texts," this.texts");
      });
  }

// Evidence upload for survey and observation
  async evidenceUpload(path?:any) {
    // this.actionSheetOpen = true;
    // this.storagePath = path;
    const actionSheet = await this.actionSheetController.create({
      header: this.texts["FRMELEMNTS_MSG_SELECT_IMAGE_SOURCE"],
      cssClass: 'sb-popover',
      buttons: [
        {
          text: this.texts["FRMELEMENTS_LBL_CAMERA"],
          icon: "camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
            return false;
          },
        },
        {
          text: this.texts["FRMELEMENTS_LBL_UPLOAD_IMAGE"],
          icon: "cloud-upload",
          handler: () => {
             this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.MediaType.PICTURE);
            return false;
          },
        },
        {
          text: this.texts["FRMELEMENTS_LBL_UPLOAD_VIDEO"],
          icon: "videocam",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.MediaType.VIDEO);
            return false;
          },
        },
        {
          text: this.texts["FRMELEMENTS_LBL_UPLOAD_FILE"],
          icon: "document",
          handler: () => {
            // this.openFile();
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
  takePicture(sourceType: PictureSourceType, mediaType: MediaType = this.camera.MediaType.ALLMEDIA) {
    var options: CameraOptions = {
      quality: 20,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      mediaType: mediaType,
      destinationType: this.camera.DestinationType.FILE_URI
    };

    this.camera
      .getPicture(options)
      .then((imagePath :any) => {
        if (this.platform.is("android") && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          let newFilePath = imagePath;
          if (!newFilePath.includes("content://") && !newFilePath.includes("file://")) {
            newFilePath = "file://" + imagePath
          }
          console.log(newFilePath,"newFilePath")
            this.checkForFileSizeRestriction(newFilePath).then(isValidFile => {
              if (isValidFile) {
                // this.filePath
                //   .resolveNativePath(newFilePath)
                //   .then((filePath:any) => {
                //     // this.copyFile(filePath);
                //   })
                //   .catch((error:any) => { })
              }
            })
        } else {
          // this.checkForFileSizeRestriction(imagePath).then(isValidFile => {
          //   if (isValidFile) {
          //     this.copyFile(imagePath);
          //   }
          // })
        }
      })
      .catch((err:any) => {
        if (err !== "No Image Selected") {
          this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
        }
      });
  }

  // writeFileToPrivateFolder(filePath :any) {
  //   this.checkForFileSizeRestriction(filePath).then(isValidFile => {
  //     if (isValidFile) {
  //       // this.loader.startLoader();
  //       let path = filePath.substr(0, filePath.lastIndexOf("/") + 1);
  //       let currentName = filePath.split("/").pop();
  //       this.file.readAsArrayBuffer(path, currentName).then((success :any) => {
  //         const pathToWrite = this.directoryPath();
  //         const newFileName = this.createFileName(currentName)
  //         this.file.writeFile(pathToWrite, newFileName, success).then(async (fileWrite:any) => {
  //           const data = {
  //             name: newFileName,
  //             type: this.mimeType(newFileName),
  //             isUploaded: false,
  //             url: "",
  //           };
  //           // await this.loader.stopLoader();
  //           this.presentToast(this.texts["FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED"], "success");
  //           this.actionSheetOpen ? this.actionSheetController.dismiss(data) : this.payload.push(data);
  //         }).catch((error :any) => {
  //           // this.loader.stopLoader();
  //           this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
  //         })
  //       }).catch((error :any) => {
  //       //   this.loader.stopLoader();
  //         this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
  //       })
  //     }
  //   }).catch(error => { })
  // }

  checkForFileSizeRestriction(filePath : any): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      // this.filePath.resolveNativePath(filePath).then((fileData:any) =>{
      // // this.file.resolveLocalFilesystemUrl(fileData).then((success:any) => {
      // //   success.getMetadata((metadata : any) => {
      // //     if (metadata.size >500000) {
      // //       this.presentToast(this.texts["FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED"],'danger', 5000);
      // //       reject(false)
      // //     } else  {
      // //       resolve(true)
      // //     }
      // //   })
      // // }).catch((error:any) => {
      // //   reject(false)
      // // })
      // }).catch((error:any) => {
      //   reject(false)
      // })
    })
  }

  // copyFileToLocalDir(namePath : string, currentName : string, newFileName : string, completeFilePath : string) {
  //   this.file.copyFile(namePath, currentName, this.directoryPath(), newFileName).then(
  //     (success : any) => {
  //       const data = {
  //         name: newFileName,
  //         type: this.mimeType(newFileName),
  //         isUploaded: false,
  //         url: "",
  //       };
  //       this.presentToast(this.texts["FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED"], "success");
  //       this.actionSheetOpen ? this.actionSheetController.dismiss(data) : this.payload.push(data);
  //     },
  //     (error : any) => {
  //       this.writeFileToPrivateFolder(completeFilePath);
  //       // this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
  //     }
  //   );
  // }

  async presentToast(text : string, color = "danger", duration = 3000) {
    const toast = await this.toastController.create({
      message: text,
      position: "top",
      duration: duration,
      color: color,
    });
    toast.present();
  }

  // async openFile(path?: string) {
  //   try {
  //     const file :any = await this.chooser.getFile('application/pdf');
  //     let sizeOftheFile: number = file.data.length
  //     if (sizeOftheFile > 50000) {
  //       this.presentToast(this.texts["FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED"]);
  //       this.actionSheetOpen ?  this.actionSheetController.dismiss() :'';
  //     } else {
  //       const pathToWrite = path ? path :this.directoryPath();
  //       const newFileName = this.createFileName(file.name)
  //       const writtenFile = await this.file.writeFile(pathToWrite, newFileName, file.data.buffer)
  //       if (writtenFile.isFile) {
  //         const data = {
  //           name: newFileName,
  //           type: this.mimeType(newFileName),
  //           isUploaded: false,
  //           url: "",
  //         };
  //         this.presentToast(this.texts["FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED"], "success");
  //         this.actionSheetOpen ? this.actionSheetController.dismiss(data) : this.payload.push(data);
  //       }
  //     }

  //   } catch (error) {
  //     if(error == "OutOfMemory"){
  //       this.presentToast(this.texts["FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED"]);
  //     }else{
  //       this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
  //     }
  //   }
  // }

  // copyFile(filePath: any) {
  //   let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
  //   let currentName = filePath.split("/").pop();
  //   currentName = currentName.split("?")[0];
  //   this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName), filePath);
  // }

  createFileName(name: string) {
    let d = new Date(),
      n = d.getTime(),
      extentsion = name.split(".").pop(),
      newFileName = n + "." + extentsion;
    return newFileName;
  }

  // directoryPath(): string {
  //   if(this.actionSheetOpen && this.storagePath){
  //     return this.storagePath;
  //   }else
  //   if (this.platform.is("ios")) {
  //     return this.file.documentsDirectory;
  //   } else {
  //     return this.file.externalDataDirectory;
  //   }
  // }

  mimeType(fileName : string) {
    let ext :any = fileName.split(".").pop();
    return FILE_EXTENSION_HEADERS[ext];
  }

  deleteFile(fileName : string) {
   // return this.file.removeFile(this.directoryPath(), fileName);
  }

  async openAttachmentSource(type : string, payload : string) {
    let data: any = '';
    this.actionSheetOpen = false;
    this.payload = payload;
    switch (type) {
      case 'openCamera':
        // this.takePicture(this.camera.PictureSourceType.CAMERA);
        break;
      case 'openGallery':
        // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        break;
      case 'openImage':
        // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.MediaType.PICTURE);
        break;
      case 'openVideo':
        // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.MediaType.VIDEO);
        break;
      case 'openFiles':
        // this.openFile();
        break;
    }
  }
  // openLocalLibrary(): void {
  //   const options: ImagePickerOptions = {
  //     maximumImagesCount: 50,
  //     quality: 10,
  //   };
  //   this.imgPicker.getPictures(options).then((imageData : string) => {
  //     for (const image of imageData) {
  //       this.actionSheetController.dismiss({imageData, multiple:true});
  //     }
  //   }).catch((err : any) => {
  //     console.log(err)
  //   });
  // }
  // async openAllFile(path? : string) {
  //   try {
  //     const file : any = await this.chooser.getFile();
  //     let sizeOftheFile: number = file.data.length
  //     if (sizeOftheFile > 50000) {
  //       this.actionSheetController.dismiss();
  //       this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_FILE_SIZE_LIMIT"]);
  //     } else {
  //       const pathToWrite = path ? path :this.directoryPath();
  //       const newFileName = this.createFileName(file.name)
  //       const writtenFile = await this.file.writeFile(pathToWrite, newFileName, file.data.buffer)
  //       if (writtenFile.isFile) {
  //         const data = {
  //           name: newFileName,
  //           type: this.mimeType(newFileName),
  //           isUploaded: false,
  //           url: "",
  //         };
  //         this.presentToast(this.texts["FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED"], "success");
  //         this.actionSheetOpen ? this.actionSheetController.dismiss(data) : this.payload.push(data);
  //       }
  //     }

  //   } catch (error) {
  //     this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
  //   }
  // }
}




