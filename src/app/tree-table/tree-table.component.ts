import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { HttpService } from "../services/http.service";
import { MatDialog } from '@angular/material/dialog';
import { ReportsModalComponent, ReportsModalContentComponent } from "../reports-modal/reports-modal.component";
import { SliceOperationsModalComponent, SliceOperationsModalContentComponent } from "src/app/slice-operations-modal/slice-operations-modal.component";
import { FormatGridDataService } from '../services/format-grid-data.service';
import { SharedService } from "../services/shared.service";
import { Subscription } from 'rxjs';

import { WebsocketService } from '../services/websocket.service'
import { ProgressbarService } from '../services/progressbar.service';

@Component({
	selector: 'app-tree-table',
	templateUrl: './tree-table.component.html',
	styleUrls: ['./tree-table.component.scss'],
	providers: [SliceOperationsModalComponent, ReportsModalComponent]
})
export class TreeTableComponent implements OnInit, OnChanges {

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

	constructor(
		public reportsModalInstance: ReportsModalComponent,
		private httpService: HttpService,
		private formatGridDataService: FormatGridDataService,
		public dialogOperSlice: MatDialog,
		public reportsModal: MatDialog,
		public dialog: SliceOperationsModalComponent, shared: SharedService,
		private progressbarService: ProgressbarService
	) {
		this.subscription = shared.subjTerrCode$.subscribe(val => {
			this.terrCode = val;
		})

		this.subscription = shared.subjSliceGroupLang$.subscribe(sliceGroup => {
			console.log(sliceGroup)
			this.gridData = this.formatGridDataService.formatGridData(sliceGroup, true)['data']
		})
		progressbarService.messages.subscribe(msg => {
			console.log("Response from websocket:" + msg)
		})
	}

	ngOnChanges() {
		this.loader = true
		this.httpService.getSliceGroups(this.checkDeleted).then((gridData) => {
			this.gridData = this.formatGridDataService.formatGridData(gridData, true)['data']
			this.loader = false
		});
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

		dialogRef.afterOpen().subscribe(result => {
			this.httpService.getHistory(this.sliceId).subscribe((data) => {
				this.historyList = data;
				this.showTimeline = true;
			})
		})

		dialogRef.afterClosed().subscribe(result => {
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
			reportsModalRef.afterClosed().subscribe(result => {
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

	// checkDeletedStatus(status) {
	// 	this.loader = true
	// 	this.httpService.getSliceGroups(status).then((gridData) => {
	// 		console.log(gridData)
	// 		this.gridData = this.formatGridDataService.formatGridData(gridData, true)['data']
	// 		this.loader = false
	// 	});
	// }

}
