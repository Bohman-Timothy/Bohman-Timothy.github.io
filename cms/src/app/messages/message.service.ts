import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];

  constructor() {
    this.messages = MOCKMESSAGES;
  }
  
  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }

  addMessage(message: Message) {
    this.messages.push(message)
    this.messageChangedEvent.emit(this.messages.slice());
  }

  // This function is based on a recommendation shared by JC Cox in the W05 Developer Forum
  getNextMsgId() {
    return (this.messages.length > 0) ? '' + (Number(this.messages[this.messages.length - 1].id) + 1) : '0';
  }
}