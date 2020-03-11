import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxStompService} from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SharedService } from '../services/shared.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [MessageService]
})
export class MessagesComponent implements OnInit, OnDestroy {
  public receivedMessages: string[] = [];
  private topicSubscription: Subscription;
  private subscription: Subscription;
  private terrCode: any;
  private auth = { sessionKey: 'user0' }
  private users;

  constructor(
    private rxStompService: RxStompService,
    private messageService: MessageService,
    private shared: SharedService,
    private http: HttpService,
  ) {
    this.subscription = shared.subjTerrCode$.subscribe(val => {
			this.terrCode = val;
      console.log("TreeTableComponent -> this.terrCode", this.terrCode)
    })
    this.http.getUsers().subscribe((users) => {
      this.users = users
      console.log("MessagesComponent -> this.users", this.users)
		})
  }

  ngOnInit() {
    //Подписка на уведомления для всех пользователей, по этому каналу будут приходить
    //рассылки общего характера предназначенный для всех пользователей
    this.topicSubscription = this.rxStompService.watch('/topic/notifications', this.auth).subscribe((message: Message) => {
      console.log("received public: ", message.body)
      this.receivedMessages.push(message.body);
    });
    
    this.topicSubscription = this.rxStompService.watch('/topic/sliceCompletion', this.auth).subscribe((message: Message) => {
      console.log("slices: ", message.body)
      this.addSingle(message.body)
    });

    //Подписка на индивидуальные уведомления, по этому каналу будут приходить уведомдения,
    //пероснально для пользователя, зависящие от того какие у пользователя права
    this.topicSubscription = this.rxStompService.watch('/user/queue/notifications', this.auth).subscribe((message: Message) => {
      console.log("received private: ", message.body)
      this.receivedMessages.push(message.body);
    });
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

  addSingle(message) {
    this.messageService.add({severity:'info', summary:'Info Message', detail: message});
  }
    
  addMultiple(messages) {
    this.messageService.addAll([
      { severity: 'success', summary: 'Service Message', detail: 'Via MessageService' },
      { severity: 'info', summary: 'Info Message', detail: 'Via MessageService' }
    ]);
  }
    
  clear() {
    this.messageService.clear();
  }
}