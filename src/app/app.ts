import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { EVENT_CHAT, EVENT_JOIN, EVENT_MESSAGE_RECEIVED } from './utils/constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'LetsConnect';

  socket = inject(Socket);
  isUserJoined = false;
  userName = '';
  message = '';
  allMessages: { userName?: string; message: string, type?: string }[] = [];

  constructor() { }

  ngOnInit() {
    this.socket.on(EVENT_MESSAGE_RECEIVED, (data: { userName: string; message: string }) => {
      this.allMessages.push({...data, type: 'message' });
    });
    this.socket.on(EVENT_CHAT, (data: string) => {
      this.allMessages.push({message: data, type: EVENT_CHAT });
    });
    
  }

  onUserJoin() {
    if (this.userName.trim()) {
      this.socket.emit(EVENT_JOIN, this.userName);
      this.isUserJoined = true;
    }
  }

  onMessageSend() {
    if (this.message.trim()) {
      const messageData = { userName: this.userName, message: this.message };
      this.message = '';
      this.socket.emit('message', messageData);
    }
  }
}
