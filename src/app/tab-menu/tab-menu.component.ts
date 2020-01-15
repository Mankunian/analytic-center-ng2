import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';



@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnInit {

	items =["Apple iPhone 7", "Huawei Mate 9", "Samsung Galaxy S7", "Motorola Moto Z","Apple iPhone 7", "Huawei Mate 9", "Samsung Galaxy S7", "Motorola Moto Z"];

	handleClick() {
		//execute action
		console.log('refresh table')
	}

	date3: Date;
  constructor() { }

  ngOnInit() {
  }

}
