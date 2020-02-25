import { Component, OnInit } from '@angular/core';
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
	territoryList: any = [];
	selectedTerritory: any;
	public terrValue: string;

	constructor(private http: HttpService, private service: SharedService, public translate: TranslateService) {
		translate.addLangs(['ru', 'kaz']);
		translate.setDefaultLang('ru');

		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/ru|kaz/) ? browserLang : 'ru');
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
