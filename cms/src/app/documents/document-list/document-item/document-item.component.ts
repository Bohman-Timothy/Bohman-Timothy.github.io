import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Document } from '../../document.model';

@Component({
  selector: 'cms-document-item',
  templateUrl: './document-item.component.html',
  styleUrl: './document-item.component.css'
})
export class DocumentItemComponent {
  @Input() document: Document;
  @Output() documentSelected = new EventEmitter<void>();
  id: String;
  
  constructor(private route: ActivatedRoute) { }

  onSelected() {
    this.documentSelected.emit();
  }
}
