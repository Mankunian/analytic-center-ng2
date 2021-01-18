import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
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


	ngOnInit() { }

	constructor() {
		this.initializeWebSocketConnection();
	}

	initializeWebSocketConnection() {
		const userInfo = JSON.parse(sessionStorage.userInfo);
		const username = userInfo.fullName;
		const serverUrl = 'http://18.138.17.74:8085/notifications/' + username;
		const ws = new SockJS(serverUrl);
		this.stompClient = Stomp.over(ws);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		this.stompClient.connect({}, function (frame) {
			that.stompClient.subscribe('/topic/greetings', (message) => {
				console.log(JSON.parse(message.body));
				// if (message.body) {
				// 	this.msg.push(message.body)
				// }
				// console.log(this.msg)
			})


			that.stompClient.subscribe('/topic/slice-completion-info', (message) => {
				console.log(JSON.parse(message.body));
				that.showToast(message.body)
				// if (message.body) {
				// 	this.msg.push(message.body)
				// }
			})

			that.stompClient.subscribe('/user/queue/notifications', (message) => {
				console.log(JSON.parse(message.body));
				// if (message.body) {
				// 	this.msg.push(message.body)
				// }
			})
		})
	}

	showToast(body) {
		console.log(body)
	}



}
