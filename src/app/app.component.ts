import { Component } from '@angular/core';
// import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Stomp } from 'stompjs/lib/stomp.js';
import AbstractXHRObject from 'sockjs-client/lib/transport/browser/abstract-xhr';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'analytic-center2';
  
  greetings: string[] = [];
  showConversation = false;
  stompClient: any;
  name: string;
  disabled: boolean;

  constructor() { }
  
  connect() {
    //connect to stomp where stomp endpoint is exposed
    // let ws = new SockJS(http://localhost:8080/greeting);
    // let socket = new WebSocket("ws://18.140.232.52:8081/notifications");      
    // let socket = new SockJS('https://anal-centre.tk:8081/notifications');
    // this.stompClient = Stomp.over(socket);

    let socket = new SockJS('http://anal-centre.tk:8081/notifications');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({ sessionKey: "user0" }, function (frame) {

      //Функция обратного вызова,которая запускается после успешного соединения
      //Для продуктива необходимо обрабатывать также и неуспешное соединение, чтобы
      //уведомить пользователя о том, что он не получит уведомлений

      //Подписка на уведомления для всех пользователей, по этому каналу будут приходить
      //данные касательно процента формирования срезов
      this.stompClient.subscribe('/topic/sliceCompletion', function(message) {
          console.log("received slice completion info: "  + message);
      });

      //Подписка на уведомления для всех пользователей, по этому каналу будут приходить
      //рассылки общего характера предназначенный для всех пользователей
      this.stompClient.subscribe('/topic/notifications', function(message) {
          console.log("received public: "  + message);
      });

      //Подписака на индивидуальные уведомления, по этому каналу будут приходить уведомдения,
      //пероснально для пользователя, зависящие от того какие у пользователя права
      this.stompClient.subscribe('/user/queue/notifications', function(message) {
          console.log("received private: "  + message);
      });

      //Если хотим получить приветственное уведомление вызываем сервис sayHello, которому передаем sessionKey
      // stompClient.send('/app/sayHello', {}, 'Hello everybody!');
    }, function(error) {
      alert("STOMP error " + error);
    });
  }

  disconnect() {
    this.stompClient.disconnect();
    // if (this.stompClient != null) {
    //   this.stompClient.ws.close();
    // }
    // this.setConnected(false);
    console.log("Disconnected");
  }

  sendName() {
    let data = JSON.stringify({
      'name' : this.name
    })
    this.stompClient.send("/app/message", {}, data);
  }

  showGreeting(message) {
    this.showConversation = true;
    this.greetings.push(message)
  }

  setConnected(connected) {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }
}
