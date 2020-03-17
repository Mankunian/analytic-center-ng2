import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { HttpService } from "../services/http.service";
import { MatDialog } from '@angular/material/dialog';
import { ReportsModalComponent, ReportsModalContentComponent } from "../reports-modal/reports-modal.component";
import { SliceOperationsModalComponent, SliceOperationsModalContentComponent } from "src/app/slice-operations-modal/slice-operations-modal.component";
import { FormatGridDataService } from '../services/format-grid-data.service';
import { SharedService } from "../services/shared.service";
import { Subscription } from 'rxjs';
import { GlobalConfig } from "../../../src/app/global";

@Component({
	selector: 'app-tree-table',
	templateUrl: './tree-table.component.html',
	styleUrls: ['./tree-table.component.scss'],
	providers: [SliceOperationsModalComponent, ReportsModalComponent]
})
export class TreeTableComponent implements OnInit {
	public STATUS_CODES = GlobalConfig.STATUS_CODES
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
	// percentValue: number;
	percentValue = 0;


	constructor(
		public reportsModalInstance: ReportsModalComponent,
		private httpService: HttpService,
		private formatGridDataService: FormatGridDataService,
		public dialogOperSlice: MatDialog,
		public reportsModal: MatDialog,
		public dialog: SliceOperationsModalComponent,
		shared: SharedService,
		private sharedService: SharedService
	) {
		this.subscription = shared.subjTerrCode$.subscribe(val => {
			this.terrCode = val;
		})

		this.subscription = shared.subjSliceGroupLang$.subscribe(sliceGroup => {
			this.gridData = this.formatGridDataService.formatGridData(sliceGroup, true)['data']
		})

		this.subscription = shared.subjOrderSliceData$.subscribe(orderSliceList => {
			this.refreshGridTableFromOrder(orderSliceList)
		})

		this.subscription = shared.subjProgressbarWs$.subscribe(progressbarList => {
			console.log(progressbarList)
			this.setPercentValue(progressbarList);
		})

		this.subscription = shared.subjHistoryValue$.subscribe(historyValue => {
			if (historyValue) {
				this.loader = true
				this.httpService.getSliceGroups().then((gridData) => {
					this.gridData = this.formatGridDataService.formatGridData(gridData, true)['data']
					this.loader = false
				});
			}
		})

	}

	ngOnInit() {
		this.loader = true
		this.httpService.getSliceGroups().then((gridData) => {
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

	onNodeExpand(event) {
		if (event.node.parent != null) {
			this.loader = true
			this.groupCode = event.node.parent.data.code,
				this.statusCode = event.node.data.code,
				this.year = event.node.data.statusYear

			this.httpService.getSlices(this.groupCode, this.statusCode, this.year).then((data) => {
				this.childrenNode = this.formatGridDataService.formatGridData(data)['data']
				event.node.children = this.childrenNode;
				//refresh the data
				this.gridData = [...this.gridData];

				this.loader = false
			})
		}
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
			console.log('closed')

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

	refreshGridTableFromOrder(orderSliceList) {
		this.loader = true;
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this;

		setTimeout(() => {
			this.httpService.getSliceGroups().then((data) => {
				this.gridData = this.formatGridDataService.formatGridData(data, true)['data']
				orderSliceList.forEach(function (orderListValue) {
					self.gridData.forEach(function (gridValue) {
						if (gridValue.data.code === orderListValue.groupCode) {
							gridValue['expanded'] = true;
							gridValue.children.forEach(function (childValue) {
								if (orderListValue.statusCode == self.STATUS_CODES.WAITING_FOR_PROCESSING && childValue.data.statusYear == orderListValue.year) {
									// self.loader = true;
									self.httpService.getSlices(orderListValue.groupCode, orderListValue.statusCode, orderListValue.year).then((data) => {
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
		this.gridData.forEach(function (parent) {
			if (parent.expanded == true) {
				self.expandedGroupCodeList.push(parent.data)
				parent.children.forEach(function (child) {
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


		this.httpService.getSliceGroups().then((data) => {
			this.gridData = this.formatGridDataService.formatGridData(data, true)['data']
			this.gridData.forEach(function (groups, groupKey) {
				self.expandedGroupCodeList.forEach(function (groupValue) {
					if (groups.data.code === groupValue.code) {
						setTimeout(() => {
							self.gridData[groupKey]['expanded'] = true; // Раскрытие групп
							if (self.gridData[groupKey]['expanded'] == true) { // Если есть группы которые были раскрыты. 
								self.gridData[groupKey].children.forEach(function (childrenValue) { // Пробегаемся по каждой группе которые были раскрыты изначально.
									childrenValue.data.groupCode = groupValue.code
									if (self.expandedStatusList.length > 0) { // Если есть раскрытые срезы по СТАТУСАМ
										self.expandedStatusList.forEach(function (element) { // Пробегаемся по каждому статусу которые были раскрыты.
											self.statusData = element; // Присваиваем к переменной каждый элемент Статусов.
											if (childrenValue.data.code == self.statusData.statusCode && childrenValue.data.statusYear == self.statusData.statusYear && childrenValue.data.groupCode == self.statusData.groupCode) {
												// Если статус, группа и год равны то присваиваем expanded
												self.httpService.getSlices(self.statusData.groupCode, self.statusData.statusCode, self.statusData.statusYear).then((data) => {
													self.childrenNode = self.formatGridDataService.formatGridData(data)['data']
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
			this.loader = false;
		})
	}

	showDeleted(checkDeleted: boolean) {
		this.sharedService.showDeletedService(checkDeleted)
		this.loader = true
		this.httpService.getSliceGroups().then((gridData) => {
			this.gridData = this.formatGridDataService.formatGridData(gridData, true)['data']
			this.loader = false
		});
	}

	setPercentValue(progressbarList) {
		if (this.childrenNode) {
			this.childrenNode.forEach(function (childElement) {
				progressbarList.forEach(function (progressElement) {
					if (childElement.data.id === progressElement.sliceId) {
						childElement.data.percentComplete = progressElement.percent;
					}
				})
			})
		}
	}
}
