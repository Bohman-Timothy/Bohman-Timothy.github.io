import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    this.http
      .get<Document[]>(
        'https://wdd430-cms-a5ef4-default-rtdb.firebaseio.com/documents.json'
      )
      .subscribe({
        // success method
        next: (documents: Document[] ) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          // sort the list of documents
          this.documents.sort((a, b) => {
            // Sort/compare method derived from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#sorting_array_of_objects
            
            // ignore differences in uppercase and lowercase
            const documentNameA: string = a.name.toUpperCase();
            const documentNameB: string = b.name.toUpperCase();
            if (documentNameA < documentNameB) {
              return -1;
            }
            if (documentNameA > documentNameB) {
              return 1;
            }

            // Document names are equal
            return 0;
          });
          // emit the next document list change event
          let documentsListClone = this.documents.slice();
          this.documentListChangedEvent.next(documentsListClone);
        },
        // error method
        error: (error: any) => {
            console.log(error);
        }
      });
    return;
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
  }

  getMaxId(): number {
    let maxId = 0;

    this.documents.forEach (document => {
      let currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    })

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
        return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
        return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
        return;
    }

    let pos = this.documents.indexOf(document);
    if (pos < 0) {
        return;
    }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  storeDocuments() {
    let documentsJsonString = JSON.stringify(this.documents);
    // const httpHeaders = this.httpHeaders.getRecipes();
    let httpHeaders: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf=8');
    this.http
      .put(
        'https://wdd430-cms-a5ef4-default-rtdb.firebaseio.com/documents.json',
        documentsJsonString,
        {'headers': httpHeaders}
      )
      .subscribe(response => {
        console.log(response);
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
      });
  }
}
