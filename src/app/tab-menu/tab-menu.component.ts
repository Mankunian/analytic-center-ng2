import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormArray, FormBuilder} from '@angular/forms';
import { HttpService } from "../services/http.service";
import { SliceNumber } from "../sliceNumber";

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
	styleUrls: ['./tab-menu.component.scss'],
	providers: [HttpService]
})
export class TabMenuComponent implements OnInit {

	groupListFormGroup : FormGroup
	groupList:any;
	max: number;
	checkedGroupCodes: any;
	checkedGroupList: any = [];
	disabledStatus: boolean;

	dateFrom = new FormControl(new Date(1577859165 * 1000));
	dateTo = new FormControl(new Date());

	sliceNumber: SliceNumber;
  constructor(private httpService: HttpService,  private formBuilder: FormBuilder,) {}
	
  ngOnInit() {
		this.groupListFormGroup = this.formBuilder.group({
			groupList: this.formBuilder.array([])
		});

		setTimeout((res) => {
			this.httpService.getGroupList().subscribe((data)=>{
				
				this.groupList = data;
				this.groupList.forEach(element => {
					
					if (element.status == 2) {
						element.disabledStatus = true;
					}
					
				});
				
			})

		});
		
		this.httpService.getSliceNumber().subscribe((data:SliceNumber) => {
			this.max = data.value
			
		});
	}
	
	getSliceNumber(){
		this.httpService.getSliceNumber().subscribe((data:SliceNumber) => {
			this.max = data.value
		})
	}

	onCheckedGroup(event){
		this.checkedGroupCodes = event.source.value.code;

		if (event.source._checked) {
			this.checkedGroupList.push(this.checkedGroupCodes);
		} else {
			let a = this.checkedGroupList.indexOf(this.checkedGroupCodes)
			this.checkedGroupList.splice(a, 1)
		}		
		console.log(this.checkedGroupList)
	}

	orderSlice(){
		this.dateFrom.value.setHours(0)
		this.dateFrom.value.setMinutes(0)
		this.dateFrom.value.setSeconds(0)

		this.dateTo.value.setHours(0)
		this.dateTo.value.setMinutes(0)
		this.dateTo.value.setSeconds(0)

		const dateFromTimestamp = this.dateFrom.value.getTime() / 1000;
		const dateToTimestamp = this.dateTo.value.getTime() / 1000 | 0;


		let objForOrderSlice = {
			startDate : dateFromTimestamp,
			endDate   : dateToTimestamp,
			maxRecNum : this.max,
			groups    : this.checkedGroupList,
		};
		console.log(objForOrderSlice)


	}

}
