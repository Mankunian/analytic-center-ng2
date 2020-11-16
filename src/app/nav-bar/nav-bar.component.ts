import { Component, OnInit } from "@angular/core";
import { HttpService } from "../services/http.service";
import { SharedService } from "../services/shared.service";
import { TranslateService } from "@ngx-translate/core";
import { ErrorHandlerService } from "../services/error-handler.service";
import { TabMenuComponent } from "../tab-menu/tab-menu.component";

export interface Territory {
	code: string;
	name: string;
}

@Component({
	selector: "app-nav-bar",
	templateUrl: "./nav-bar.component.html",
	styleUrls: ["./nav-bar.component.scss"],
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
		public tabMenuComponent: TabMenuComponent
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
		console.log('permissions')
		this.httpService.getPermissionsByUserService().subscribe(data => {
			this.userInfo = data;
			if (this.userInfo) {
				console.log(this.userInfo)
				sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
				sessionStorage.setItem('permissionCodesList', JSON.stringify(this.userInfo.permissions))
				this.tabMenuComponent.getGroupList()
				this.getUserInfo()
			}
		})
	}

	getUserInfo() {
		this.incomingUserInfo = JSON.parse(sessionStorage.getItem('userInfo'))
		this.fullNameUser = this.incomingUserInfo.fullName
		this.selectedTerritory = this.incomingUserInfo.orgCode
		console.log("selectedTerritory ", this.selectedTerritory);
		if (this.selectedTerritory) {
			this.sharedService.sendTerrCode(this.selectedTerritory);
		}
	}

	getTerritory() {
		this.httpService.getTerritories().subscribe((data: Territory) => {
			console.log(data)
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
		let hostname = sessionStorage.hostname;
		console.log(hostname)
		// Internal ip
		let ipStart192 = hostname.startsWith('192')
		let ipStart10 = hostname.startsWith('10')
		if (ipStart192) {
			window.location.href = "http://192.168.210.69:8084"
		} else if (ipStart10) {
			window.location.href = "http://10.2.30.69:8084"
		} else {
			window.location.href = "http://localhost:4200/"
		}
		sessionStorage.clear()
		// window.location.href = 'http://192.168.210.69'
	}
}
