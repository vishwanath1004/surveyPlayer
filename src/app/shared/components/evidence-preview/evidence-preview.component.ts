import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-evidence-preview',
  templateUrl: './evidence-preview.component.html',
  styleUrls: ['./evidence-preview.component.scss'],
})
export class EvidencePreviewComponent {
  @Input() mediaType: string;
  @Input() mediaUrl: any;
  videoFormats = ["mp4", "WMV", "WEBM", "flv", "avi", "3GP", "OGG","mov"];
  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
  ngOnInit() {  }
}
