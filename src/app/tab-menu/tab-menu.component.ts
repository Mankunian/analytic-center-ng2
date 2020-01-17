import { Component, OnInit } from '@angular/core';
import { GetSliceNumberService } from '../get-slice-number.service';
import {FormControl} from '@angular/forms';
// import { HttpClient} from '@angular/common/http';
import { SliceNumber } from "../sliceNumber";



@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
	styleUrls: ['./tab-menu.component.scss'],
	providers: [GetSliceNumberService]
})
export class TabMenuComponent implements OnInit {

	sliceNumber: SliceNumber;

	dateFrom = new FormControl(new Date(1577859165 * 1000));
	dateTo = new FormControl(new Date());

	items =["Apple iPhone 7", "Huawei Mate 9", "Samsung Galaxy S7", "Motorola Moto Z","Apple iPhone 7", "Huawei Mate 9", "Samsung Galaxy S7", "Motorola Moto Z"];
	


  constructor(private getSliceNumberService: GetSliceNumberService) { }
	max: number;
  ngOnInit() {
		this.getSliceNumberService.getSliceNumber().subscribe((data:SliceNumber) => {
			// console.log(JSON.stringify(data.max))
			this.max = data.value
			console.log(this.max)
		})
	}
	
	getSliceNumber(){
		this.getSliceNumberService.getSliceNumber().subscribe((data:SliceNumber) => {
			// console.log(JSON.stringify(data.max))
			this.max = data.value
			console.log(this.max)
		})
	}

}
