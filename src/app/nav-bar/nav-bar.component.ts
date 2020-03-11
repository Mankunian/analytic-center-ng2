import { Component, OnInit, Injectable } from '@angular/core';
import { HttpService } from "../services/http.service";
import { SharedService } from '../services/shared.service';
import { TranslateService } from '@ngx-translate/core';

export interface Territory {
	code: string;
	name: string;
}

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
	public territoryList: any = [];
	public selectedTerritory: any;
	public terrValue: string;
	public lang: string;

	constructor(
		private http: HttpService,
		private service: SharedService,
		public translate: TranslateService
	) {
		translate.setDefaultLang('ru');
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/ru|kaz/) ? browserLang : 'ru');
	}

	changeLang(lang) {
		console.log(lang)
		this.http.changeLang(lang)

		this.http.getTerritories().subscribe((territories) => {
			this.territoryList = territories;
		})

		this.http.getGroupList().subscribe((groupList) => {
			this.service.sendGroupListLang(groupList)
		})

		this.http.getSliceGroups().then((gridData) => {
			this.service.sendSliceGroupLang(gridData)
		})
	}

	ngOnInit() {
		this.http.getTerritories().subscribe((data: Territory) => {
			this.territoryList = data;
			console.log("NavBarComponent -> ngOnInit -> this.territoryList", this.territoryList)
		})
		this.selectedTerritory = '19000090';
		this.service.sendTerrCode(this.selectedTerritory)
	}

	selectedTerr(selectedTerr) {
		this.selectedTerritory = selectedTerr;
		this.service.sendTerrCode(this.selectedTerritory)
	}

}
