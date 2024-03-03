import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit {

  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe (
      (params: Params) => {
        let id = params.id;
        if (!id) {
          this.editMode = false;
          return;
        }
        this.originalDocument = this.documentService.getDocument(id);
  
        if (!this.originalDocument) {
          return;
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
    }) 
 }
 
  onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    this.document = new Document(value.id, value.name, value.description, value.url);
    if (this.editMode === true) {
      this.documentService.updateDocument(this.originalDocument, this.document)
    } else {
      this.documentService.addDocument(this.document)
    }
    // route back to the '/documents' URL
    this.router.navigate(['/documents']);
 }

  onCancel() {
    // route back to the '/documents' URL
    this.router.navigate(['/documents']);
  }
}
