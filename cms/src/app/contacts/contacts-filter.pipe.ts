import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts: Contact[], term): Contact[] {
    //   Create a new array to contain the filtered list of contacts

    let filteredContacts: Contact[] = [];
    if (term && term.length > 0) {
      filteredContacts = contacts.filter(
        (contact: Contact) =>
          contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (!filteredContacts) {
      return contacts;
    }
    return filteredContacts;
  }
}
