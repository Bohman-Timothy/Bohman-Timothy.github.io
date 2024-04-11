import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';

// Use an environment variable for the URL string to connect to the database
const dotEnv = require('dotenv').config();
const uri = process.env.DB_URL;

@Injectable({
  providedIn: 'root',
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
    this.http.get<Document[]>(uri + '/documents').subscribe({
      // success method
      next: (documents: Document[]) => {
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
      },
    });
    return;
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
  }

  getMaxId(): number {
    let maxId = 0;

    this.documents.forEach((document) => {
      let currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    // make sure id of the new Document is empty
    newDocument.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(
        uri + '/documents',
        newDocument,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update database
    this.http
      .put(uri + '/documents/' + originalDocument.id, newDocument, {
        headers: headers,
      })
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex((d) => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http
      .delete(uri + '/documents/' + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      });
  }

  sortAndSend() {
    let documentsJsonString = JSON.stringify(this.documents);
    // const httpHeaders = this.httpHeaders.getRecipes();
    let httpHeaders: HttpHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf=8'
    );
    this.http
      .put(uri + 'documents.json', documentsJsonString, {
        headers: httpHeaders,
      })
      .subscribe((response) => {
        console.log(response);
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
      });
  }
}
