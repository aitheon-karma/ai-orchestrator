import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ai-expand-button',
  templateUrl: './expand-button.component.html',
  styleUrls: ['./expand-button.component.scss']
})
export class ExpandButtonComponent implements OnInit {
  @Input() expanded: boolean;
  // @Output('onCancel') onCancel: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}
