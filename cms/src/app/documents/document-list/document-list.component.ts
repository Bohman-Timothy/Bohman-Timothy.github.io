import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';
import { Contact } from '../../contacts/contact.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  documents: Document[] = []
  
  constructor(private documentService: DocumentService) {

  }

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
  }

  onSelectedDocument(document: Document) {
    this.documentService.documentSelectedEvent.emit(document);
  }
}
