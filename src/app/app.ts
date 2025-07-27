import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { EVENT_CHAT, EVENT_JOIN, EVENT_MESSAGE_RECEIVED } from './utils/constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'LetsConnect';

  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  socket = inject(Socket);
  isUserJoined = false;

  message = '';
  allMessages: { userData?: any; message?: string, type?: string }[] = [];

  constructor() { }

  ngOnInit() {
    this.socket.on(EVENT_MESSAGE_RECEIVED, (data: any) => {
      console.log("EVENT_MESSAGE_RECEIVED: ", data);
      this.allMessages.push({ userData: data.userData, message: data.message, type: 'message' });
      console.log("All Messages: ", this.allMessages);
    });
    this.socket.on(EVENT_CHAT, (data: string) => {
      console.log("EVENT_CHAT: ", data);
      this.allMessages.push({ userData: data, type: EVENT_CHAT });
      console.log("All Messages: ", this.allMessages);
    });

  }

  onLoginUser() {
    const userData = this.loginForm.value;
    if (this.loginForm.valid) {
      this.socket.emit(EVENT_JOIN, userData);
      this.isUserJoined = true;
      // this.allMessages.push({ ...userData, type: EVENT_JOIN });
    } else {
      alert('Plase fill all fields correctly');
    }
  }

  onMessageSend() {
    if (this.message.trim()) {
      const messageData = { userData: this.loginForm.value, message: this.message };
      this.message = '';
      this.socket.emit('message', messageData);
    }
  }
}
