import { Component, OnDestroy, OnInit } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { Message, Stomp } from "@stomp/stompjs";
import { Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { SharedService } from "../services/shared.service";
import { HttpService } from "../services/http.service";
import { GlobalConfig } from "../global";
import { ErrorHandlerService } from "../services/error-handler.service";
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
		public shared: SharedService,
		private rxStompService: RxStompService,
		private messageService: MessageService,
		private http: HttpService,
		private errorHandler: ErrorHandlerService
	) { }

	ngOnInit() {
		/*
			Создаем websocket-соединение, используем библиотеку stompjs для работы по протоколу STOMP,
			также используем библиотеку sockjs для обеспечения для поддержки функционала в браузерах
			неподдерживающих websocket и для пользователей работающих через прокси
		*/
		this.connect();
		// this.subscribe(this.authUser);
	}

	connect() {
		const userInfo = JSON.parse(sessionStorage.userInfo);
		const username = userInfo.fullName;
		const socket = new SockJS('http://18.138.17.74:8085/notifications/' + username);
		const stompClient = Stomp.over(socket);


		stompClient.connect({}, function (frame) {
			//Проверка связи
			stompClient.subscribe('/topic/greetings', function (message) {
				console.log("received greetings: " + message);
			});

			//Канал для получения данных о проценте формирования срезов
			stompClient.subscribe('/topic/slice-completion-info', function (message) {
				console.log("received slice completion info: " + message);
			});

			//Канал для получения индивидуальных сообщений
			stompClient.subscribe('/user/queue/notifications', function (message) {
				console.log("received private: " + message);
			});

			//Если хотим получить приветственное уведомление вызываем сервис sayHello, которому передаем sessionKey
			stompClient.send('/app/hello', {}, JSON.stringify({ name: username }));
		})
	}












	// ngOnDestroy() {
	// 	this.topicSubscription.unsubscribe();
	// }

	// addSingle(message) {
	// 	// this.messageService.add({ severity: "info", summary: "Info Message", detail: message });
	// }

	// subscribe(authUser?) {
	// 	//Подписка на уведомления для всех пользователей, по этому каналу будут приходить
	// 	//рассылки общего характера предназначенный для всех пользователей
	// 	this.topicSubscription = this.rxStompService
	// 		.watch("/topic/notifications", { sessionKey: authUser })
	// 		.subscribe((message: Message) => {
	// 			console.log("received public: ", message.body);
	// 			this.addSingle(message.body);
	// 		});

	// 	this.topicSubscription = this.rxStompService
	// 		.watch("/topic/sliceCompletion", { sessionKey: authUser })
	// 		.subscribe((message: Message) => {
	// 			// console.log("slices: ", message.body);
	// 			this.shared.sendProgressBarList(JSON.parse(message.body));
	// 		});

	// 	//Подписка на индивидуальные уведомления, по этому каналу будут приходить уведомдения,
	// 	//пероснально для пользователя, зависящие от того какие у пользователя права
	// 	this.topicSubscription = this.rxStompService
	// 		.watch("/user/queue/notifications", { sessionKey: authUser })
	// 		.subscribe((message: Message) => {
	// 			console.log("received private: ", message.body);
	// 			this.addSingle(message.body);
	// 		});

	// 	//Если хотим получить приветственное уведомление вызываем сервис sayHello, которому передаем sessionKey
	// 	// this.rxStompService.publish({ destination: '/app/sayHello', headers: { sessionKey: authUser }, body: "Hello, STOMP" });
	// 	this.rxStompService.publish({ destination: "/app/sayHello", body: "Hello world" });
	// }

	// clear() {
	// 	this.messageService.clear();
	// }
}
