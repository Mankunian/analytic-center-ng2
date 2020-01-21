import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormArray, FormBuilder} from '@angular/forms';
import { GroupListService } from '../group-list.service';
import { GetSliceNumberService } from '../get-slice-number.service';
import { SliceNumber } from "../sliceNumber";

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
	styleUrls: ['./tab-menu.component.scss'],
	providers: [GetSliceNumberService, GroupListService]
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
  constructor(private getSliceNumberService: GetSliceNumberService, public getGroupListService: GroupListService, private formBuilder: FormBuilder,) {}
	
  ngOnInit() {
		this.groupListFormGroup = this.formBuilder.group({
			groupList: this.formBuilder.array([])
		});

		setTimeout((res) => {
			this.getGroupListService.getGroupList().subscribe((data)=>{
				
				this.groupList = data;
				this.groupList.forEach(element => {
					
					if (element.status == 2) {
						element.disabledStatus = true;
					}
					
				});
				
			})

		});
		

		this.getSliceNumberService.getSliceNumber().subscribe((data:SliceNumber) => {
			this.max = data.value
			
		});

		

	}
	
	getSliceNumber(){
		this.getSliceNumberService.getSliceNumber().subscribe((data:SliceNumber) => {
			this.max = data.value
		
		})
	}

	onChange(event){
		console.log(event.source);
		this.checkedGroupCodes = event.source.value.code;

		if (event.source._checked) {
			// console.log('true');
			this.checkedGroupList.push(this.checkedGroupCodes);
			console.log(this.checkedGroupCodes)
			console.log(this.checkedGroupList)
		} else {
			var a = this.checkedGroupList.indexOf(this.checkedGroupCodes)
			console.log(a)
			this.checkedGroupList.splice(a, 1)
			console.log(this.checkedGroupList)
		}		
	}

}
