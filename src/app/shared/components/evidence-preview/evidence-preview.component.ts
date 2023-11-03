import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-evidence-preview',
  templateUrl: './evidence-preview.component.html',
  styleUrls: ['./evidence-preview.component.scss'],
})
export class EvidencePreviewComponent {
  @Input() mediaType: string;
  @Input() mediaUrl: any;
  src="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  safeUrl: SafeResourceUrl;
  videoFormats = ["mp4", "WMV", "WEBM", "flv", "avi", "3GP", "OGG","mov"];
  constructor(private modalController: ModalController,
    private sanitizer: DomSanitizer,
    private inAppBrowser: InAppBrowser) {}

  dismiss() {
    this.modalController.dismiss();
  }
  ngOnInit() {  }
}
