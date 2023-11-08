import { Injectable } from "@angular/core";
import { ActionSheetController, Platform, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { FILE_EXTENSION_HEADERS } from "../constants/file-extensions";

import { Camera, CameraOptions, MediaType, PictureSourceType } from "@awesome-cordova-plugins/camera/ngx";
import { Chooser } from "@awesome-cordova-plugins/chooser/ngx";
import { FilePath } from "@awesome-cordova-plugins/file-path/ngx";
import { File } from "@awesome-cordova-plugins/file/ngx";
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

File
declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  mediaType: string;
  texts: any;
  payload: any;
  actionSheetOpen: boolean = false;
  storagePath: any;

  constructor(

    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private chooser: Chooser,


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
  async evidenceUploadF(path?: any) {
    this.actionSheetOpen = true;
    this.storagePath = path;
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
            this.openFile();
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
      .then((imagePath) => {
        if (this.platform.is("android") && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          let newFilePath = imagePath;
          if (!newFilePath.includes("content://") && !newFilePath.includes("file://")) {
            newFilePath = "file://" + imagePath
          }
          this.checkForFileSizeRestriction(newFilePath).then(isValidFile => {
            if (isValidFile) {
              this.filePath
                .resolveNativePath(newFilePath)
                .then((filePath) => {
                  this.copyFile(filePath);
                })
                .catch(error => { })
            }
          }, error => { })
        } else {
          this.checkForFileSizeRestriction(imagePath).then(isValidFile => {
            if (isValidFile) {
              this.copyFile(imagePath);
            }
          })
        }
      })
      .catch((err) => {
        if (err !== "No Image Selected") {
          this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
        }
      });
  }

  writeFileToPrivateFolder(filePath: string) {
    this.file.resolveLocalFilesystemUrl(filePath).then(success => {
      success.getMetadata((metadata) => {
        if (metadata.size > 50000000) {
          this.presentToast(this.texts["FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED"], 'danger', 5000);
          return
        } else {
          let path = filePath.substr(0, filePath.lastIndexOf("/") + 1);
          let currentName: any = filePath.split("/").pop();
          this.file.readAsArrayBuffer(path, currentName).then(success => {
            const pathToWrite = this.directoryPath();
            const newFileName = this.createFileName(currentName)
            this.file.writeFile(pathToWrite, newFileName, success).then(async fileWrite => {
              const data = {
                name: newFileName,
                type: this.mimeType(newFileName),
                isUploaded: false,
                url: "",
              };
              // await this.loader.stopLoader();
              this.presentToast(this.texts["FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED"], "success");
              this.actionSheetOpen ? this.actionSheetController.dismiss(data) : this.payload.push(data);
            }).catch(error => {
              this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
            })
          }).catch(error => {
            this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
          })
        }
      })
    }).catch(error => { })
  }

  checkForFileSizeRestriction(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.filePath.resolveNativePath(filePath).then(fileData => {
        this.file.resolveLocalFilesystemUrl(fileData).then(success => {
          success.getMetadata((metadata) => {
            if (metadata.size > 50000000) {
              this.presentToast(this.texts["FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED"], 'danger', 5000);
              reject(false)
            } else {
              resolve(success)
            }
          })
        }).catch(error => {
          reject(false)
        })
      }).catch(error => {
        reject(false)
      })
    })
  }

  copyFileToLocalDir(namePath: string, currentName: string, newFileName: string, completeFilePath: any) {
    this.file.copyFile(namePath, currentName, this.directoryPath(), newFileName).then(
      (success) => {
        const data = {
          name: newFileName,
          type: this.mimeType(newFileName),
          isUploaded: false,
          url: "",
        };
        this.presentToast(this.texts["FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED"], "success");
        this.actionSheetOpen ? this.actionSheetController.dismiss(data) : this.payload.push(data);
      },
      (error) => {
        this.writeFileToPrivateFolder(completeFilePath);
      }
    );
  }

  copyFile(filePath: any) {
    let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
    let currentName = filePath.split("/").pop();
    currentName = currentName.split("?")[0];
    this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName), filePath);
  }
  async openFile(path?: any) {
    try {
      const file: any = await this.chooser.getFile();
      let sizeOftheFile: number = file.data.length
      if (sizeOftheFile > 50000000) {
        this.presentToast(this.texts["FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED"]);
        this.actionSheetOpen ? this.actionSheetController.dismiss() : '';
      } else {
        const pathToWrite = path ? path : this.directoryPath();
        const newFileName = this.createFileName(file.name)
        const writtenFile = await this.file.writeFile(pathToWrite, newFileName, file.data.buffer)
        if (writtenFile.isFile) {
          const data = {
            name: newFileName,
            type: this.mimeType(newFileName),
            isUploaded: false,
            url: "",
          };
          this.presentToast(this.texts["FRMELEMNTS_MSG_SUCCESSFULLY_ATTACHED"], "success");
          this.actionSheetOpen ? this.actionSheetController.dismiss(data) : this.payload.push(data);
        }
      }

    } catch (error) {
      if (error == "OutOfMemory") {
        this.presentToast(this.texts["FRMELEMNTS_LBL_FILE_SIZE_EXCEEDED"]);
      } else {
        this.presentToast(this.texts["FRMELEMNTS_MSG_ERROR_WHILE_STORING_FILE"]);
      }
    }
  }

  async presentToast(text: string, color = "danger", duration = 3000) {
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
    if (this.actionSheetOpen && this.storagePath) {
      return this.storagePath;
    } else
      if (this.platform.is("ios")) {
        return this.file.documentsDirectory;
      } else {
        return this.file.externalDataDirectory;
      }
  }

  mimeType(fileName: string) {
    let ext: any = fileName.split(".").pop();
    return FILE_EXTENSION_HEADERS[ext];
  }




}




