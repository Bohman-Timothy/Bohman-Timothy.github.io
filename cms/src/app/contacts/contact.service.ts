import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contacts: Contact[] = [];
  maxContactId: number;
  
  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    // return this.contacts.slice();

    this.http
      .get<Contact[]>(
        'https://wdd430-cms-a5ef4-default-rtdb.firebaseio.com/contacts.json'
      )
      .subscribe({
        // success method
        next: (contacts: Contact[] ) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          // sort the list of contacts
          this.contacts.sort((a, b) => {
            // Sort/compare method derived from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#sorting_array_of_objects
            
            // ignore differences in uppercase and lowercase
            const contactNameA: string = a.name.toUpperCase();
            const contactNameB: string = b.name.toUpperCase();
            if (contactNameA < contactNameB) {
              return -1;
            }
            if (contactNameA > contactNameB) {
              return 1;
            }

            // Contact names are equal
            return 0;
          });
          // emit the next contact list change event
          let contactsListClone = this.contacts.slice();
          this.contactListChangedEvent.next(contactsListClone);
        },
        // error method
        error: (error: any) => {
            console.log(error);
        }
      });
    return;
  }

  getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id === id);
  }

  getMaxId(): number {
    let maxId = 0;

    this.contacts.forEach (contact => {
      let currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    })

    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
        return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
        return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
        return;
    }

    let pos = this.contacts.indexOf(contact);
    if (pos < 0) {
        return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

  storeContacts() {
    let contactsJsonString = JSON.stringify(this.contacts);
    // const httpHeaders = this.httpHeaders.getRecipes();
    let httpHeaders: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf=8');
    this.http
      .put(
        'https://wdd430-cms-a5ef4-default-rtdb.firebaseio.com/contacts.json',
        contactsJsonString,
        {'headers': httpHeaders}
      )
      .subscribe(response => {
        console.log(response);
        let contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
      });
  }
}
