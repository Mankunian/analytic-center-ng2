import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { HttpService } from "../services/http.service";
import { MatDialog } from '@angular/material/dialog';
import { ReportsModalComponent, ReportsModalContentComponent } from "../reports-modal/reports-modal.component";
import { SliceOperationsModalComponent, SliceOperationsModalContentComponent } from "src/app/slice-operations-modal/slice-operations-modal.component";
import { FormatGridDataService } from '../services/format-grid-data.service';
import { SharedService } from "../services/shared.service";
import { Subscription } from 'rxjs';

// import { ProgressbarService } from '../services/progressbar.service';

@Component({
	selector: 'app-tree-table',
	templateUrl: './tree-table.component.html',
	styleUrls: ['./tree-table.component.scss'],
	providers: [SliceOperationsModalComponent, ReportsModalComponent]
})
export class TreeTableComponent implements OnInit {

	stompClient = null;
	progress = 0;

	subscription: Subscription;
	terrCode: unknown;
	gridData: TreeNode[];
	cols: any[];
	loader: boolean;
	childrenNode: TreeNode[];
	@Input() checkDeleted: any;
	period: any;
	sliceId: any;
	historyList: Record<string, any>;
	showTimeline: boolean;
	expandedGroupCodes: any;
	expandedGroupCodeList: any = [];
	expandedStatusList: any = [];
	groupCode: any;
	statusCode: any;
	year: any;
	statusData: any;

	constructor(
		public reportsModalInstance: ReportsModalComponent,
		private httpService: HttpService,
		private formatGridDataService: FormatGridDataService,
		public dialogOperSlice: MatDialog,
		public reportsModal: MatDialog,
		public dialog: SliceOperationsModalComponent,
		shared: SharedService,
		// progressbarService: ProgressbarService
	) {
		this.subscription = shared.subjTerrCode$.subscribe(val => {
			this.terrCode = val;
		})

		this.subscription = shared.subjSliceGroupLang$.subscribe(sliceGroup => {
			// console.log(sliceGroup)
			this.gridData = this.formatGridDataService.formatGridData(sliceGroup, true)['data']
		})

		this.subscription = shared.subjOrderSliceData$.subscribe(orderSliceList => {
			console.log(orderSliceList)
			this.refreshGridTableFromOrder(orderSliceList)
		})

		this.subscription = shared.subjProgressbarWs$.subscribe(progressbarList => {
			console.log(progressbarList)
			console.log(this.gridData)
			// this.gridData.forEach(function (gridData, key) {
			// 	gridData.children.forEach(function (children, key) {
			// 		if (children.data.code == '0') {
			// 			console.log(true)
			// 		}
			// 	})
			// })
		})

	}

	ngOnInit() {
		// progressBar
		let interval = setInterval(() => {
			this.progress = 75;
			if (this.progress >= 100) {
				this.progress = 100;
				// this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Process Completed' });
				clearInterval(interval);
			}
		}, 5000);
		// progressBar

		this.loader = true
		this.httpService.getSliceGroups(this.checkDeleted).then((gridData) => {
			this.gridData = this.formatGridDataService.formatGridData(gridData, true)['data']
			this.loader = false
		});

		this.cols = [
			{ field: 'name', header: 'Группы' },
			{ field: 'maxRecNum', header: 'На номер' },
			{ field: 'completed', header: 'Сформирован' },
			{ field: 'action', header: 'Действие' },
			{ field: 'region', header: 'По органу' },
			{ field: 'percentComplete', header: 'Прогресс' }
		];
	}

	openOperationSliceModal(rowEntity) {
		this.period = rowEntity.period;
		this.sliceId = rowEntity.id;
		const dialogRef = this.dialogOperSlice.open(SliceOperationsModalContentComponent, {
			width: '1100px',
			data: { sliceId: this.sliceId, period: this.period, terrCode: this.terrCode, statusCode: rowEntity.statusCode }
		});

		dialogRef.afterOpen().subscribe(() => {
			this.httpService.getHistory(this.sliceId).subscribe((data) => {
				this.historyList = data;
				this.showTimeline = true;
			})
		})

		dialogRef.afterClosed().subscribe(() => {
		})
	}

	openReportsModal(row) {
		const sliceId = row.id
		const slicePeriod = row.period
		const sliceGroupCode = row.groupCode

		if (row.statusCode == "0" || row.statusCode == "6") {
			alert('По данному статусу невозможно получить отчет!')
		} else {
			const reportsModalRef = this.reportsModal.open(ReportsModalContentComponent, {
				disableClose: true,
				data: { sliceId: sliceId, slicePeriod: slicePeriod, groupCode: sliceGroupCode },
				height: '695px',
				width: '1050px'
			});
			reportsModalRef.afterClosed().subscribe(() => {
				// console.log(result)
			})
		}
	}

	onNodeExpand(event) {
		console.log(event.node)
		if (event.node.parent != null) {
			this.loader = true
			this.groupCode = event.node.parent.data.code,
				this.statusCode = event.node.data.code,
				this.year = event.node.data.statusYear

			this.httpService.getSlices(this.checkDeleted, this.groupCode, this.statusCode, this.year).then((data) => {
				this.childrenNode = this.formatGridDataService.formatGridData(data)['data']
				event.node.children = this.childrenNode
				//refresh the data
				this.gridData = [...this.gridData];
				this.loader = false
			})
		}
	}

	refreshGridTableFromOrder(orderSliceList) {
		this.loader = true;
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this;

		setTimeout(() => {
			this.httpService.getSliceGroups(this.checkDeleted).then((data) => {
				this.gridData = this.formatGridDataService.formatGridData(data, true)['data']
				orderSliceList.forEach(function (orderListValue, key) {
					self.gridData.forEach(function (gridValue, key) {
						if (gridValue.data.code === orderListValue.groupCode) {
							gridValue['expanded'] = true;
							gridValue.children.forEach(function (childValue, key) {
								if (orderListValue.statusCode == '6' && childValue.data.statusYear == orderListValue.year) {
									// self.loader = true;
									self.httpService.getSlices(self.checkDeleted, orderListValue.groupCode, orderListValue.statusCode, orderListValue.year).then((data) => {
										self.childrenNode = self.formatGridDataService.formatGridData(data)['data'];
										childValue.children = self.childrenNode
										self.gridData = [...self.gridData];
									})
									childValue['expanded'] = true;
								}
							})
							self.gridData = [...self.gridData]
							self.loader = false;
						}
					})
				})
			});
			// this.loader = false;
		}, 500);
	}

	refreshGridTable() {
		this.loader = true;
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this;
		this.gridData.forEach(function (parent, key) {
			if (parent.expanded == true) {
				self.expandedGroupCodeList.push(parent.data)
				parent.children.forEach(function (child, key) {
					if (child.expanded == true) {
						self.expandedStatusList.push({
							'groupCode': child.parent.data.code,
							'statusCode': child.data.code,
							'statusYear': child.data.statusYear
						})
					}
				})

			}
		})

		this.httpService.getSliceGroups(this.checkDeleted).then((data) => {
			this.gridData = this.formatGridDataService.formatGridData(data, true)['data']
			this.gridData.forEach(function (groups, key1) {
				self.expandedGroupCodeList.forEach(function (groupValue, key) {
					if (groups.data.code === groupValue.code) {
						setTimeout(() => {
							self.gridData[key1]['expanded'] = true; // Раскрытие групп
							if (self.gridData[key1]['expanded'] == true) { // Если есть группы которые были раскрыты. 
								self.gridData[key1].children.forEach(function (childrenValue, key) { // Пробегаемся по каждой группе которые были раскрыты изначально.
									childrenValue.data.groupCode = groupValue.code
									if (self.expandedStatusList.length > 0) { // Если есть раскрытые срезы по СТАТУСАМ
										self.expandedStatusList.forEach(function (element) { // Пробегаемся по каждому статусу которые были раскрыты.
											self.statusData = element; // Присваиваем к переменной каждый элемент Статусов.
											if (childrenValue.data.code == self.statusData.statusCode && childrenValue.data.statusYear == self.statusData.statusYear && childrenValue.data.groupCode == self.statusData.groupCode) {
												// Если статус, группа и год равны то присваиваем expanded
												self.httpService.getSlices(self.checkDeleted, self.statusData.groupCode, self.statusData.statusCode, self.statusData.statusYear).then((data) => {
													self.childrenNode = self.formatGridDataService.formatGridData(data)['data']
													console.log(self.childrenNode)
													childrenValue.children = self.childrenNode
													self.gridData = [...self.gridData];
												})
												childrenValue['expanded'] = true;
											}
										})
									}
								})
							}
							self.gridData = [...self.gridData];
						}, 2000);
					}
				});
			})
		})
		this.loader = false;
	}

	showDeleted(checkDeleted: boolean) {
		this.checkDeleted = checkDeleted;
		this.loader = true
		this.httpService.getSliceGroups(this.checkDeleted).then((gridData) => {
			this.gridData = this.formatGridDataService.formatGridData(gridData, true)['data']
			this.loader = false
		});
	}
}
