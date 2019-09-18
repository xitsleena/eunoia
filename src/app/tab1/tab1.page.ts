import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message';
    
declare var require: any;
const Sentiment = require('sentiment');

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('scrollBottom', {read: "scrollBottom", static: false}) private scrollBottom: ElementRef;

  sentiment = new Sentiment();
  messages: Message[];
  message: Message;

  threshold: number;

  constructor(private messageService: MessageService, private alertController: AlertController) {
    this.message = new Message();
    this.messages = [];
    this.threshold = 0; // for happiness level to post 
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getMessages();
  }

  getMessages() {
    this.messageService.getMessages().subscribe(data => {
      this.messages = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Message;
      })
      this.messages.sort((message1, message2) => ((message1.dateCreated < message2.dateCreated) ? 1 : -1));
    });
  }

  formatDate(newDate) {
    const date = newDate.slice(0, newDate.indexOf("T"));
    const time = newDate.slice(newDate.indexOf("T") + 1, newDate.indexOf("."));
    return date + " " + time;
  }

  createMessage() {
    this.message.dateCreated = this.formatDate(new Date().toISOString());
    this.message.score = this.sentiment.analyze(this.message.message).comparative;
    if (this.message.score > this.threshold) {
      this.messageService.createMessage(this.message);
      this.getMessages();
      this.message = new Message(); // resets message
    }
    else {
      this.alertController.create({
        header: "sorry!",
        subHeader: "thank you for your thoughts",
        message: "the sentiment stream only accepts messages with happiness levels above " + this.threshold.toString(),
        buttons: ["okay"]
      }).then(alert => alert.present());
    }
  }
}


