import { Component, OnInit, Injectable } from '@angular/core';
import { HttpService } from "../services/http.service";
import { SharedService } from '../services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { SlicesGridDataService } from '../services/slices-grid-data.service';

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
	territoryList: any = [];
	selectedTerritory: any;
	public terrValue: string;

	constructor(private http: HttpService, private service: SharedService, public translate: TranslateService, private gridService: SlicesGridDataService) {
		// translate.addLangs(['ru', 'kaz']);
		translate.setDefaultLang('ru');

		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/ru|kaz/) ? browserLang : 'ru');
	}

	changeToKz(lang) {
		console.log(lang)
		if (lang == 'KZ') {
			this.http.getGroupListKz().subscribe((groupListKaz) => {
				this.service.sendGroupListLang(groupListKaz)
			})

			this.http.getTerritoriesKz().subscribe((territoriesKaz) => {
				this.territoryList = territoriesKaz;
			})

			// this.gridService.getSliceGroupsKaz().then((gridData) => {
			// 	console.log(gridData)
			// 	// this.gridData = this.formatGridData(gridData)['data']
			// 	this.service.sendSliceGroupKaz(gridData)
			// })
		}
		if (lang == 'RU') {
			this.http.getGroupList().subscribe((groupListRu) => {
				this.service.sendGroupListLang(groupListRu)
			})

			this.http.getTerritories().subscribe((territoryRu) => {
				this.territoryList = territoryRu
			})

			this.gridService.getSliceGroups().then((gridData) => {
				console.log(gridData)
				// this.gridData = this.formatGridData(gridData)['data']
				this.service.sendSliceGroupKaz(gridData)
			})
		}
	}

	ngOnInit() {
		this.http.getTerritories().subscribe((data: Territory) => {
			this.territoryList = data;
		})
		this.selectedTerritory = '19000090';
		this.service.sendTerrCode(this.selectedTerritory)
	}

	selectedTerr(selectedTerr) {
		this.selectedTerritory = selectedTerr;
		this.service.sendTerrCode(this.selectedTerritory)
	}

}
