import { Component } from '@angular/core';

import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent {
  contacts: Contact[] = [
    new Contact(
      0,
      "",
      "",
      "",
      "",
      null
    )
  ]
}
