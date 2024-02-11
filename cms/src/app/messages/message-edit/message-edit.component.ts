import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css',
})
export class MessageEditComponent {
  currentSender: string = '19';
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') msgTextInputRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor(private messageService: MessageService) {

  }

  onSendMessage() {
    const subjectInput = this.subjectInputRef.nativeElement.value;
    const msgTextInput = this.msgTextInputRef.nativeElement.value;
    const newMsg = new Message(
      this.messageService.getNextMsgId(),
      subjectInput,
      msgTextInput,
      this.currentSender
    );
    this.messageService.addMessage(newMsg);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
