import { Component, OnInit } from "@angular/core";
import { GlobalConfig } from '../global';

import { HttpService } from "../services/http.service";
import { SharedService } from "../services/shared.service";
import { TranslateService } from "@ngx-translate/core";
import { ErrorHandlerService } from "../services/error-handler.service";

import { TabMenuComponent } from "../tab-menu/tab-menu.component";
import { MessagesComponent } from "../messages/messages.component";
import { ConfirmationService, MessageService } from 'primeng/api';

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
				this.getUserInfo(data)
				this.showToastMessage()
			}
		}, error => {
			this.errorHandler.alertError(error)
		})
	}

	showToastMessage() {
		let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
		this.messageService.add({ severity: 'info', summary: 'Добро Пожаловать', detail: userInfo.fullName });
	}

	getUserInfo(userInfo) {
		this.incomingUserInfo = JSON.parse(sessionStorage.getItem('userInfo'))
		this.fullNameUser = this.incomingUserInfo.fullName
		this.selectedTerritory = this.incomingUserInfo.orgCode
		if (this.selectedTerritory) {
			this.sharedService.sendTerrCode(this.selectedTerritory);
		}

		// let userId = userInfo.userId;
		// this.userId = userInfo.userId;
		// this.httpService.getUserInfoService(userId).subscribe((data: any) => {
		// 	console.log(data)
		// 	if (data.isChangePasswordRequired === true) {
		// 		this.displayBasic = true;
		// 	}
		// }, error => {
		// 	console.log(error);
		// 	this.errorHandler.alertError(error)
		// })
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

	// saveChangePass() {
	// 	this.disabledBtn = true;
	// 	let newPass = this.newPass;
	// 	let oldPass = this.currentPass;
	// 	let userId = this.userId;

	// 	this.httpService.changePassUserService(newPass, oldPass, userId).subscribe(data => {
	// 		console.log(data)
	// 		this.displayBasic = false;
	// 		this.messageService.add({ severity: 'success', summary: '200', detail: 'Пароль успешно изменен' });
	// 	}, error => {
	// 		console.log(error)
	// 		this.errorHandler.alertError(error)
	// 		this.currentPass = '';
	// 		this.newPass = '';
	// 		this.disabledBtn = false;
	// 	})
	// }
}
