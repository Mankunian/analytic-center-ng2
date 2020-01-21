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
				console.log(data)
				this.groupList = data;
				this.groupList.forEach(element => {
					console.log(element.status);
					if (element.status == 2) {
						element.disabledStatus = true;
					}
					
				});
				console.log(this.groupList)
			})

		});
		

		this.getSliceNumberService.getSliceNumber().subscribe((data:SliceNumber) => {
			this.max = data.value
			console.log(this.max)
		});

		

	}
	
	getSliceNumber(){
		this.getSliceNumberService.getSliceNumber().subscribe((data:SliceNumber) => {
			this.max = data.value
			console.log(this.max)
		})
	}

	onChange(event){
		console.log(event.source);
		this.checkedGroupCodes = event.source.value.code;

		if (event.source._checked) {
			console.log('true');
			this.checkedGroupList.push(this.checkedGroupCodes);
			console.log(this.checkedGroupList)
		} else {
			console.log('false');
			this.checkedGroupList.splice(this.checkedGroupCodes)
		}

		console.log(this.checkedGroupList)
		
		// push only it has uniqe id
		// if (this.checkedGroupList.indexOf(this.checkedGroupCodes) === -1) {
		// 	this.checkedGroupList.push(this.checkedGroupCodes);
		// 	console.log(this.checkedGroupList)
		// }

		
	}

}
