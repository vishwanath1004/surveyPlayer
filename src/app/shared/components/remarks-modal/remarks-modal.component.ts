import { Component, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-remarks-modal',
  templateUrl: './remarks-modal.component.html',
  styleUrls: ['./remarks-modal.component.scss'],
})
export class RemarksModalComponent  {

  @ViewChild('remarkInput',  {static: false}) remarkInput : any;
  hideBack : any;
  @Input() data: any;
  @Input() button: string;
  @Input() required: boolean;

  constructor(private modal: ModalController) {}


  close(): void {
    this.modal.dismiss();
  }

  update(): void {
    this.modal.dismiss(this.data.remarks);
  }

  ngAfterViewChecked() {
    this.remarkInput.setFocus();
  }


}
