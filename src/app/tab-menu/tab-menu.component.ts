import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { HttpService } from "../services/http.service";
import { SliceNumber } from "../sliceNumber";
import { OrderSliceObj } from "../orderSliceObj";
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'app-tab-menu',
	templateUrl: './tab-menu.component.html',
	styleUrls: ['./tab-menu.component.scss'],
	providers: [HttpService]
})
export class TabMenuComponent implements OnInit {

	groupListFormGroup: FormGroup
	groupList: any;
	max: number;
	checkedGroupCodes: any;
	checkedGroupList: any = [];
	disabledStatus: boolean;
	orderSliceDone: boolean;
	selected = 0;
	checkedGroups: any = [];
	onTabSelectedIndex: number;
	preloaderByOrderSlice: boolean;

	dateFrom = new FormControl(new Date(1577859165 * 1000));
	dateTo = new FormControl(new Date());

	sliceNumber: SliceNumber;
	constructor(private httpService: HttpService, private formBuilder: FormBuilder, public translate: TranslateService) {
		translate.addLangs(['ru', 'kaz']);
		translate.setDefaultLang('ru');

		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/ru|kaz/) ? browserLang : 'ru');
	}

	ngOnInit() {
		this.groupListFormGroup = this.formBuilder.group({
			groupList: this.formBuilder.array([])
		});
		setTimeout(() => {
			this.httpService.getGroupList().subscribe((data) => {

				this.groupList = data;
				this.groupList.forEach(element => {
					if (element.status == 2) {
						element.disabledStatus = true;
					}
				});
			})
		});

		this.httpService.getSliceNumber().subscribe((data: SliceNumber) => {
			this.max = data.value
		});
	}

	refreshGridTable() {
		//Todo refresh grid 
		// this.httpService.getSlices(checkDeleted, groupCode, statusCode, year)
	}

	getSliceNumber() {
		this.httpService.getSliceNumber().subscribe((data: SliceNumber) => {
			this.max = data.value
		})
	}

	onCheckedGroup(event) {
		this.checkedGroups.push(event)
		this.checkedGroupCodes = event.source.value.code;

		if (event.source._checked) {
			this.checkedGroupList.push(this.checkedGroupCodes);
		} else {
			let a = this.checkedGroupList.indexOf(this.checkedGroupCodes)
			this.checkedGroupList.splice(a, 1)
		}
	}

	onTabSelectedEvent(event) {
		this.selected = event.index;
	}

	orderSlice(item: OrderSliceObj) {
		this.dateFrom.value.setHours(0)
		this.dateFrom.value.setMinutes(0)
		this.dateFrom.value.setSeconds(0)

		this.dateTo.value.setHours(0)
		this.dateTo.value.setMinutes(0)
		this.dateTo.value.setSeconds(0)

		let dateFrom = this.dateFrom.value,
			ddFrom = ("0" + dateFrom.getDate()).slice(-2),
			mmFrom = ("0" + (dateFrom.getMonth() + 1)).slice(-2),
			yyFrom = dateFrom.getFullYear();
		let dateFromInput = ddFrom + '.' + mmFrom + '.' + yyFrom;

		let dateTo = this.dateTo.value,
			ddTo = ("0" + dateTo.getDate()).slice(-2),
			mmTo = ("0" + (dateTo.getMonth() + 1)).slice(-2),
			yyTo = dateTo.getFullYear();
		let dateToInput = ddTo + '.' + mmTo + '.' + yyTo;

		let orderSliceObj = {
			startDate: dateFromInput,
			endDate: dateToInput,
			maxRecNum: this.max,
			groups: this.checkedGroupList,
		};

		this.httpService.postOrderSlice(orderSliceObj).subscribe((data) => {
			this.preloaderByOrderSlice = true;
			this.checkedGroups.forEach(element => {
				element.source._checked = false; // uncheck all selected value after response
			});
			this.checkedGroupList.length = 0; // clear checkbox array after response
			this.selected = 0; // transfer to Home Tab after response
			this.preloaderByOrderSlice = false;
		})

	}
}
