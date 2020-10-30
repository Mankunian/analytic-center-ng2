import { Component, OnDestroy, OnInit } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { Message } from "@stomp/stompjs";
import { Subscription } from "rxjs";
import { MessageService } from "primeng/api";
import { SharedService } from "../services/shared.service";
import { HttpService } from "../services/http.service";
import { GlobalConfig } from "../global";
import { ErrorHandlerService } from "../services/error-handler.service";

// eslint-disable-next-line prettier/prettier
@Component({
	selector: "app-messages",
	templateUrl: "./messages.component.html",
	styleUrls: ["./messages.component.scss"],
	providers: [MessageService],
})
export class MessagesComponent implements OnInit, OnDestroy {
	public receivedMessages: string[] = [];
	private topicSubscription: Subscription;
	private subscription: Subscription;
	private terrCode;
	private authUser = GlobalConfig.BASE_AUTH_USER;
	private users;

	constructor(
		private rxStompService: RxStompService,
		private messageService: MessageService,
		public shared: SharedService,
		private http: HttpService,
		private errorHandler: ErrorHandlerService
	) { }

	ngOnInit() {
		this.http.getUsers().subscribe(
			successData => {
				this.users = successData;
			},
			error => {
				this.errorHandler.alertError(error);
			},
			() => {
				// when complete
				this.subscription = this.shared.subjTerrCode$.subscribe(userRole => {
					this.terrCode = userRole;
					this.users.forEach(element => {
						if (element[this.terrCode] != undefined) {
							this.authUser = element[this.terrCode];
							this.topicSubscription.unsubscribe();
							this.rxStompService.deactivate();
							this.rxStompService.configure({ connectHeaders: { sessionKey: this.authUser } });
							this.rxStompService.activate();
							this.subscribe(this.authUser);
						}
					});
				});
			}
		);
		this.subscribe(this.authUser);
	}

	ngOnDestroy() {
		this.topicSubscription.unsubscribe();
	}

	addSingle(message) {
		this.messageService.add({ severity: "info", summary: "Info Message", detail: message });
	}

	subscribe(authUser?) {
		//Подписка на уведомления для всех пользователей, по этому каналу будут приходить
		//рассылки общего характера предназначенный для всех пользователей
		this.topicSubscription = this.rxStompService
			.watch("/topic/notifications", { sessionKey: authUser })
			.subscribe((message: Message) => {
				console.log("received public: ", message.body);
				this.addSingle(message.body);
			});

		this.topicSubscription = this.rxStompService
			.watch("/topic/sliceCompletion", { sessionKey: authUser })
			.subscribe((message: Message) => {
				// console.log("slices: ", message.body);
				this.shared.sendProgressBarList(JSON.parse(message.body));
			});

		//Подписка на индивидуальные уведомления, по этому каналу будут приходить уведомдения,
		//пероснально для пользователя, зависящие от того какие у пользователя права
		this.topicSubscription = this.rxStompService
			.watch("/user/queue/notifications", { sessionKey: authUser })
			.subscribe((message: Message) => {
				console.log("received private: ", message.body);
				this.addSingle(message.body);
			});

		//Если хотим получить приветственное уведомление вызываем сервис sayHello, которому передаем sessionKey
		// this.rxStompService.publish({ destination: '/app/sayHello', headers: { sessionKey: authUser }, body: "Hello, STOMP" });
		this.rxStompService.publish({ destination: "/app/sayHello", body: "Hello world" });
	}

	clear() {
		this.messageService.clear();
	}
}
