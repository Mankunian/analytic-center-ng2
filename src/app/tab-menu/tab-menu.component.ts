import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpService } from "../services/http.service";
import { SliceNumber } from "../sliceNumber";
// import { OrderSliceObj } from "../orderSliceObj";
import { TranslateService } from '@ngx-translate/core';
// import { Subscription } from 'stompjs';
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { TreeNode } from 'primeng/api/treenode';
import { FormatGridDataService } from '../services/format-grid-data.service';

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
	checkDeleted = false

	subscription: Subscription;
	groupListKaz: any;
	shared: any;
	disabledBtn = true;
	lang: string

	gridData: TreeNode[];

	dateFrom = new FormControl(new Date(1577859165 * 1000));
	dateTo = new FormControl(new Date());

	sliceNumber: SliceNumber;
	constructor(
		private httpService: HttpService,
		private formBuilder: FormBuilder,
		public translate: TranslateService,
		getShared: SharedService,
		private formatGridDataService: FormatGridDataService,
		private service: SharedService
	) {
		translate.addLangs(['ru', 'kaz', 'qaz']);
		translate.setDefaultLang('ru');

		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/ru|kaz|qaz/) ? browserLang : 'ru');

		this.subscription = getShared.subjGroupListKaz$.subscribe(value => {
			this.groupList = value;
			console.log(this.groupList)
			this.groupList.forEach(element => {
				if (element.status == 2) {
					element.disabledStatus = true;
				}
			});
		})

	}
	ngOnInit() {
		this.groupListFormGroup = this.formBuilder.group({
			groupList: this.formBuilder.array([])
		});
		setTimeout(() => {
			this.lang = "RU";
			this.httpService.getGroupList(this.lang).subscribe((data) => {

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

	getSliceNumber() {
		this.httpService.getSliceNumber().subscribe((data: SliceNumber) => {
			this.max = data.value
		})
	}

	onCheckedGroup(event) {
		this.disabledBtn = false;
		this.checkedGroups.push(event)
		this.checkedGroupCodes = event.source.value.code;



		if (event.source._checked) {
			this.checkedGroupList.push(this.checkedGroupCodes);
		} else {
			let a = this.checkedGroupList.indexOf(this.checkedGroupCodes)
			this.checkedGroupList.splice(a, 1)
		}

		if (this.checkedGroupList.length == 0) {
			this.disabledBtn = true;
		}
	}

	onTabSelectedEvent(event) {
		this.selected = event.index;
	}

	orderSlice() {
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
			console.log(data)
			this.service.sendOrderSliceList(data)
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
