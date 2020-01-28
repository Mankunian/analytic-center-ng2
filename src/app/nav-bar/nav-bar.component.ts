import { Component, OnInit } from '@angular/core';
import { HttpService } from "../services/http.service";

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

  constructor(private http: HttpService) {}

  ngOnInit() {
		this.selectedTerritory = '19000090';

		this.http.getTerritories().subscribe((data:Territory)=>{
			this.territoryList = data;
		})
	}
	
	selectedTerr(selectedTerr){
		console.log(selectedTerr)
		this.selectedTerritory =  selectedTerr;
	}

}
