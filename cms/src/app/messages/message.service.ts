import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
  }
  
  getMessages(): Message[] {;
    this.http
      .get<Message[]>(
        'https://wdd430-cms-a5ef4-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe({
        // success method
        next: (messages: Message[] ) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          // emit the next message list change event
          let messagesListClone = this.messages.slice();
          this.messageChangedEvent.next(messagesListClone);
        },
        // error method
        error: (error: any) => {
            console.log(error);
        }
      });
    return;
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }

  getMaxId(): number {
    let maxId = 0;

    this.messages.forEach (message => {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    })

    return maxId;
  }

  addMessage(message: Message) {
    this.messages.push(message)
    this.storeMessages();
  }

  // This function is based on a recommendation shared by JC Cox in the W05 Developer Forum
  getNextMsgId() {
    return (this.messages.length > 0) ? '' + (Number(this.messages[this.messages.length - 1].id) + 1) : '0';
  }

  storeMessages() {
    let messagesJsonString = JSON.stringify(this.messages);
    // const httpHeaders = this.httpHeaders.getRecipes();
    let httpHeaders: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json; charset=utf=8');
    this.http
      .put(
        'https://wdd430-cms-a5ef4-default-rtdb.firebaseio.com/messages.json',
        messagesJsonString,
        {'headers': httpHeaders}
      )
      .subscribe(response => {
        console.log(response);
        let messagesListClone = this.messages.slice();
        this.messageChangedEvent.next(messagesListClone);
      });
  }
}
