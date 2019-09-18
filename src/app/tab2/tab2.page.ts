
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  messages: Message[];
  message: Message;

  // Chart fields
  graphDelimeter = 10;
  graphOptions = {
    responsive: true
  }
  graphTitle = "messages in stream";
  graphType = "bar";
  graphData = [{ data: [], label: 'happiness levels' }];
  graphLabels = [];
  graphLegend = true;


  constructor(private messageService: MessageService) {
    this.message = new Message();
    this.messages = [];
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
      });
      let obj = this.messageService.getGraphDataAndLabels(this.messages);
      this.graphData = obj.graphData;
      this.graphLabels = obj.graphLabels;
    });
  }
}
