import { Component, OnInit, Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";
import { SharedService } from "../services/shared.service";
import { TranslateService } from "@ngx-translate/core";
import { ErrorHandlerService } from "../services/error-handler.service";

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
	public selectedTerritory: any;
	public terrValue: string;
	public lang: string;
	public incomingUserInfo: any;

	constructor(
		private httpService: HttpService,
		private sharedService: SharedService,
		public translate: TranslateService,
		public errorHandler: ErrorHandlerService
	) {
		translate.setDefaultLang("ru");
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/ru|kaz/) ? browserLang : "ru");
	}

	ngOnInit() {
		this.getTerritory()
		if (sessionStorage.userInfo) {
			this.incomingUserInfo = JSON.parse(sessionStorage.getItem('userInfo'))
			this.selectedTerritory = this.incomingUserInfo.orgCode
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

		this.httpService.getTerritories().subscribe(
			territories => {
				this.territoryList = territories;
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);

		// this.httpService.getGroupList().subscribe(
		// 	groupList => {
		// 		this.sharedService.sendGroupListLang(groupList);
		// 	},
		// 	error => {
		// 		this.errorHandler.alertError(error);
		// 	}
		// );

		this.httpService.getSliceGroups().then(
			gridData => {
				this.sharedService.sendSliceGroupLang(gridData);
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}
}
