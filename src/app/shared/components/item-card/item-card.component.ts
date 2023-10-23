import { Component,OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent  implements OnInit {


  ngOnInit() {

  }
  @Input() title: any;
  @Input() code: any;
  @Input() subTitle: any;
  @Input() description:any;
  @Input() case:any ={subTitle:'titleCase', description:'titleCase'}
  @Input() id: any;
  @Output() cardSelect = new EventEmitter();
  @Input() ellipsis:Boolean =false
  @Input() arrIndex:any;
  @Input() selectedEvidenceIndex:any;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
  }
  isNumber(val : boolean) {
    return typeof val === 'number';
  }
 
  programDetails(id : any){
    this.cardSelect.emit(id);
  }
}
