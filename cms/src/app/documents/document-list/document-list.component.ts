import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';
import { Contact } from '../../contacts/contact.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(
      'doc1', 'Test Document 1', 'This is the 1st document for testing.', 'https://test.net/doc1/'
    ),
    new Document(
      'doc2', 'Test Document 2', 'This is the 2nd document for testing.', 'https://test.net/doc2/'
    ),
    new Document(
      'doc3', 'Test Document 3', 'This is the 3rd document for testing.', 'https://test.net/doc3/'
    ),
    new Document(
      'doc4', 'Test Document 4', 'This is the 4th document for testing.', 'https://test.net/doc4/'
    ),
    new Document(
      'doc5', 'Test Document 5', 'This is the 5th document for testing.', 'https://test.net/doc5/'
    )
  ]
  
  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
