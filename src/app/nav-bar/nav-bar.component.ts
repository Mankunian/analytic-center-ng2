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
	territoryList: any = []
	// foods: Food[] = [
  //   {value: 'steak-0', viewValue: 'Steak'},
  //   {value: 'pizza-1', viewValue: 'Pizza'},
  //   {value: 'tacos-2', viewValue: 'Tacos'}
  // ];
	
  constructor(private http: HttpService) {
		this.http.getTerritories().subscribe((data:Territory)=>{
			console.log(data)
			this.territoryList = data;
		})
	}

  ngOnInit() {
  }

}
