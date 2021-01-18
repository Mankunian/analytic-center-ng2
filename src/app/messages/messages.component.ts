// import { Component, OnDestroy, OnInit } from "@angular/core";
// import { RxStompService } from "@stomp/ng2-stompjs";
// import { Stomp } from "@stomp/stompjs";
// import { Subscription } from "rxjs";
// import { MessageService } from "primeng/api";
// import * as SockJS from "sockjs-client";

// import { Message, Stomp } from "@stomp/stompjs";


import { Component, OnDestroy, OnInit } from "@angular/core";
import { Client, Message, Stomp } from "@stomp/stompjs";
import { Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { RxStompService } from "@stomp/ng2-stompjs";
import { SharedService } from "../services/shared.service";
import { ErrorHandlerService } from "../services/error-handler.service";
import { HttpService } from "../services/http.service";
import { GlobalConfig } from "../global";
import * as SockJS from "sockjs-client";


// eslint-disable-next-line prettier/prettier
@Component({
	selector: "app-messages",
	templateUrl: "./messages.component.html",
	styleUrls: ["./messages.component.scss"],
	providers: [MessageService],
})
export class MessagesComponent implements OnInit {
	public receivedMessages: string[] = [];
	private topicSubscription: Subscription;
	private subscription: Subscription;
	private terrCode;
	private authUser = GlobalConfig.BASE_AUTH_USER;
	private users;
	stompClient: any = null;


	constructor(
		// private rxStompService: RxStompService,
		public shared: SharedService,
		// private messageService: MessageService,
		// private http: HttpService,
		// private errorHandler: ErrorHandlerService
	) { }

	ngOnInit() {
		/*
			Создаем websocket-соединение, используем библиотеку stompjs для работы по протоколу STOMP,
			также используем библиотеку sockjs для обеспечения для поддержки функционала в браузерах
			неподдерживающих websocket и для пользователей работающих через прокси
		*/
		this.connect();
		// this.subscribe()
	}

	connect() {
		const userInfo = JSON.parse(sessionStorage.userInfo);
		const username = userInfo.fullName;
		const socket = new SockJS('http://18.138.17.74:8085/notifications/' + username);
		const stompClient = Stomp.over(socket);

		console.log(stompClient)



		stompClient.connect({}, function (frame) {
			console.log(frame)
			//Проверка связи
			stompClient.subscribe('/topic/greetings', function (message) {
				console.log(JSON.parse(message.body));
				let body = message.body;
				this.shared.getWsGreetings(body)
			});


			//Канал для получения данных о проценте формирования срезов
			stompClient.subscribe('/topic/slice-completion-info', function (message) {
				console.log(JSON.parse(message.body));
			});

			//Канал для получения индивидуальных сообщений
			stompClient.subscribe('/user/queue/notifications', function (message) {
				console.log(JSON.parse(message.body));
			});

			//Если хотим получить приветственное уведомление вызываем сервис sayHello, которому передаем sessionKey
			stompClient.send('/app/hello', {}, JSON.stringify({ name: username }));

		})
	}
}
