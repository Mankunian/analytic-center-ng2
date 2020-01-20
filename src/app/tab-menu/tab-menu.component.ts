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

	dateFrom = new FormControl(new Date(1577859165 * 1000));
	dateTo = new FormControl(new Date());

	// items =[ {"name": "Apple iPhone 7" }, {"name": "Huawei Mate 9"}, {"name": "Samsung Galaxy S7"}];
	

	sliceNumber: SliceNumber;
  constructor(private getSliceNumberService: GetSliceNumberService, public getGroupListService: GroupListService, private formBuilder: FormBuilder,) {}
	
  ngOnInit() {
		this.groupListFormGroup = this.formBuilder.group({
			groupList: this.formBuilder.array([])
		});

		setTimeout((res) => {
			// this.groupList = [{"name": "group1"}, {"name": "group2"}]
			this.getGroupListService.getGroupList().subscribe((data)=>{
				console.log(data)
				this.groupList = data;
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

}
