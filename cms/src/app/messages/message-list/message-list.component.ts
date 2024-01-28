import { Component } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Message 1', 'First!', 'Norman'),
    new Message('2', 'Message 2', '2nd place finish.', 'Alice'),
    new Message('3', 'Message 3', 'Third time\'s the charm.', 'Calvin')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
