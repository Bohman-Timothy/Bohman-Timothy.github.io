import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  
  constructor(
       private contactService: ContactService,
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
        this.originalContact = this.contactService.getContact(id);

        if (!this.originalContact) {
          return;
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
        if (this.originalContact.group) {
          this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
        }
    }) 
  }

  onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    this.contact = new Contact(value.id, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
    if (this.editMode === true) {
      this.contactService.updateContact(this.originalContact, this.contact)
    } else {
      this.contactService.addContact(this.contact)
    }
    // route back to the '/contacts' URL
    this.router.navigate(['/contacts']);
  }

  onCancel() {
    // route back to the '/contacts' URL
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {// newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  // Drag-and-drop functionality included thanks to steps and code shared by Aaron Picker in the W08 Developer Forum
  onDrop(event: CdkDragDrop<Contact[]>) {
    if (event.previousContainer !== event.container) {
      const contactCopy = { ...event.item.data };
      const invalidGroupContact = this.isInvalidContact(contactCopy);
      if (invalidGroupContact){
        return;
      }
      this.groupContacts.push(contactCopy);
    }
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
 }
}
