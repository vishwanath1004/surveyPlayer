import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RemarksModalComponent } from '../remarks-modal/remarks-modal.component';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.scss'],
})
export class RemarksComponent  implements OnInit {

  @Input() data: any;

  constructor(private modal: ModalController) { }


  async openUpdateRemarks() {
    const remarks = await this.modal.create({
      component: RemarksModalComponent,
      componentProps: { data: JSON.parse(JSON.stringify(this.data)) }
    });
    await remarks.present();
    const { data } = await remarks.onDidDismiss();
    if (data) {
      this.data.remarks = data;
    }

  }

  ngOnInit() {}

}
