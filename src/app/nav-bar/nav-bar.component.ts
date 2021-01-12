import { Component, OnInit } from "@angular/core";
import { HttpService } from "../services/http.service";
import { SharedService } from "../services/shared.service";
import { TranslateService } from "@ngx-translate/core";
import { ErrorHandlerService } from "../services/error-handler.service";
import { TabMenuComponent } from "../tab-menu/tab-menu.component";
import { GlobalConfig } from '../global';
import { MessageService } from "primeng/api";

export interface Territory {
	code: string;
	name: string;
}

@Component({
	selector: "app-nav-bar",
	templateUrl: "./nav-bar.component.html",
	styleUrls: ["./nav-bar.component.scss"],
	providers: [MessageService]

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


	constructor(
		private httpService: HttpService,
		private sharedService: SharedService,
		public translate: TranslateService,
		public errorHandler: ErrorHandlerService,
		public tabMenuComponent: TabMenuComponent,
		private messageService: MessageService
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
				// console.log(this.userInfo)
				sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
				sessionStorage.setItem('permissionCodesList', JSON.stringify(this.userInfo.permissions))
				this.tabMenuComponent.getGroupList()
				this.getUserInfo()
				this.showToastMessage()
			}
		}, error => {
			this.errorHandler.alertError(error)
		})
	}

	showToastMessage() {
		// let username = sessionStorage.getItem('userInfo');
		let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
		console.log(userInfo)
		this.messageService.add({ severity: 'info', summary: 'Добро Пожаловать', detail: userInfo.fullName });
	}

	getUserInfo() {
		this.incomingUserInfo = JSON.parse(sessionStorage.getItem('userInfo'))
		this.fullNameUser = this.incomingUserInfo.fullName
		this.selectedTerritory = this.incomingUserInfo.orgCode
		// console.log("selectedTerritory ", this.selectedTerritory);
		if (this.selectedTerritory) {
			this.sharedService.sendTerrCode(this.selectedTerritory);
		}
	}

	getTerritory() {
		this.httpService.getTerritories().subscribe((data: Territory) => {
			// console.log(data)
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
}
