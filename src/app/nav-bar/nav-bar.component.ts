import { Component, OnInit } from "@angular/core";
import { GlobalConfig } from '../global';
import { HttpService } from "../services/http.service";
import { SharedService } from "../services/shared.service";
import { TranslateService } from "@ngx-translate/core";
import { ErrorHandlerService } from "../services/error-handler.service";
import { TabMenuComponent } from "../tab-menu/tab-menu.component";
import { MessagesComponent } from "../messages/messages.component";
import { ConfirmationService, MessageService } from 'primeng/api';
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

export interface Territory {
	code: string;
	name: string;
}

@Component({
	selector: "app-nav-bar",
	templateUrl: "./nav-bar.component.html",
	styleUrls: ["./nav-bar.component.scss"],
	providers: [MessageService, ConfirmationService]

})
export class NavBarComponent implements OnInit {
	public territoryList: any = [];
	public terrValue: string;
	public lang: string;
	public incomingUserInfo: any;
	public selectedTerritory: any;
	userInfo: any;
	fullNameUser: any;
	showMyContainer = false;
	displayBasic: boolean;
	newPass: string;
	currentPass: string;
	userId: any;
	disabledBtn: boolean;

	public stompClient;
	public msg = [];

	constructor(
		private httpService: HttpService,
		private sharedService: SharedService,
		public translate: TranslateService,
		public errorHandler: ErrorHandlerService,
		public tabMenuComponent: TabMenuComponent,
		public messageComponent: MessagesComponent,
		private messageService: MessageService,
		private confirmationService: ConfirmationService
	) {
		translate.setDefaultLang("ru");
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/ru|kaz/) ? browserLang : "ru");
	}

	ngOnInit() {
		this.getPermissionsByCurrentUser()
		if (sessionStorage.tokenIsValid) {
			this.getTerritory()
		}
	}

	getPermissionsByCurrentUser() {
		this.httpService.getPermissionsByUserService().subscribe(data => {
			this.userInfo = data;
			if (this.userInfo) {
				sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
				sessionStorage.setItem('permissionCodesList', JSON.stringify(this.userInfo.permissions))
				this.tabMenuComponent.getGroupList()
				this.getUserInfo();
				this.showToastMessage();
				this.initializeWebSocketConnection();
			}
		}, error => {
			this.errorHandler.alertError(error)
		})
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

	showToastMessage() {
		let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
		this.messageService.add({ severity: 'info', summary: 'Добро Пожаловать', detail: userInfo.fullName });
	}

	getUserInfo() {
		this.incomingUserInfo = JSON.parse(sessionStorage.getItem('userInfo'))
		this.fullNameUser = this.incomingUserInfo.fullName
		this.selectedTerritory = this.incomingUserInfo.orgCode
		if (this.selectedTerritory) {
			this.sharedService.sendTerrCode(this.selectedTerritory);
		}
	}


	getTerritory() {
		this.httpService.getTerritories().subscribe((data: Territory) => {
			this.territoryList = data;
		}, error => {
			this.errorHandler.alertError(error);
		});
	}

	changeLang(lang: string) {
		this.sharedService.changeLangService(lang);
		this.getTerritory()
		this.getSliceGroups()
	}

	getSliceGroups() {
		this.httpService.getSliceGroups().then(gridData => {
			this.sharedService.sendSliceGroupLang(gridData);
		},
			error => {
				this.errorHandler.alertError(error);
			});
	}

	logOut() {
		sessionStorage.clear()
		window.location.href = GlobalConfig.ADMIN_PAGE
	}

	cancelDialog() {
		this.displayBasic = false;
	}
}
