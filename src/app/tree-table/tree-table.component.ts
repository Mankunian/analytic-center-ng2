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

		// const link = websocket.connect('ws://18.140.232.52:8081/notifications', {sessionKey: "user0"})
		// progressbarService.messages.subscribe(msg => {
		// 	console.log("Response from websocket:" + msg)
		// })
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
		if (event.node.parent != null) {
			this.loader = true
			const groupCode = event.node.parent.data.code,
				statusCode = event.node.data.code,
				year = event.node.data.statusYear

			this.httpService.getSlices(this.checkDeleted, groupCode, statusCode, year).then((data) => {
				this.childrenNode = this.formatGridDataService.formatGridData(data)['data']
				event.node.children = this.childrenNode
				//refresh the data
				this.gridData = [...this.gridData];
				this.loader = false
			})
		}
	}

	refreshGridTable() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this;
		this.gridData.forEach(function (value, key) {
			console.log(value)
			if (value.expanded == true) {
				// console.log(value)
				console.log(value.data.code)
				self.expandedGroupCodeList.push(value.data.code)
			}

		});
		console.log(self.expandedGroupCodeList)
		this.loader = true;
		if (this.expandedGroupCodeList !== undefined) {
			this.expandedGroupCodeList.forEach(function (groupCodes) {
				// console.log(groupCodes)
				self.httpService.getSliceGroups(self.checkDeleted).then((gridData) => {
					// eslint-disable-next-line @typescript-eslint/no-use-before-define
					self.gridData = self.formatGridDataService.formatGridData(gridData, true)['data']
					// eslint-disable-next-line @typescript-eslint/no-this-alias
					self.gridData.forEach(function (value, key) {
						// console.error(value.data.code)
						if (value.data.code === groupCodes) {
							console.log(true)
							setTimeout(() => {
								self.gridData[key]['expanded'] = true;
								self.gridData = [...self.gridData];
							}, 2000);
						}
					});
				})
			});
			this.loader = false;
		} else {
			this.httpService.getSliceGroups(this.checkDeleted).then((gridData) => {
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				this.gridData = this.formatGridDataService.formatGridData(gridData, true)['data']
				this.gridData = [...this.gridData]
			});
		}
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
