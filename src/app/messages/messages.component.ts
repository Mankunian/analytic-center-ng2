import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { SharedService } from "../services/shared.service";
import { GlobalConfig } from "../global";
// import { Subscription } from "rxjs";
// import { RxStompService } from "@stomp/ng2-stompjs";
// import { SharedService } from "../services/shared.service";
// import { ErrorHandlerService } from "../services/error-handler.service";
// import { HttpService } from "../services/http.service";
// import { GlobalConfig } from "../global";


// eslint-disable-next-line prettier/prettier
@Component({
	selector: "app-messages",
	templateUrl: "./messages.component.html",
	styleUrls: ["./messages.component.scss"],
	providers: [MessageService],
})
export class MessagesComponent implements OnInit {
	public stompClient;
	public msg = [];
	public userInfo

	ngOnInit() { }

	constructor(private sharedService: SharedService) {
		this.initializeWebSocketConnection();
	}

	initializeWebSocketConnection() {
		if (sessionStorage.userInfo) {
			const userInfo = JSON.parse(sessionStorage.userInfo);
			const login = userInfo.login;
			const serverUrl = GlobalConfig.SOCKET_URL + login;
			const ws = new SockJS(serverUrl);
			this.stompClient = Stomp.over(ws);

			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const that = this;
			this.stompClient.connect({}, function (frame) {
				that.stompClient.subscribe('/topic/greetings', (message) => {
					console.log(JSON.parse(message.body));
				})


				that.stompClient.subscribe('/topic/slice-completion-info', (message) => {
					console.log(JSON.parse(message.body));
					that.showToast(message.body)
				})

				that.stompClient.subscribe('/user/queue/notifications', (message) => {
					console.log(JSON.parse(message.body));
				})
			})
		}



	}

	showToast(body) {
		this.sharedService.sendProgressBarList(body)
	}
}
