import { Component, OnInit } from '@angular/core';
import { SlicesGridDataService } from "../services/slices-grid-data.service";
import { TreeNode } from 'primeng/api';
import { HttpService } from "../services/http.service";
import { MatDialog } from '@angular/material/dialog';
import { SliceOperationsModalComponent, SliceOperationsModalContentComponent } from "src/app/slice-operations-modal/slice-operations-modal.component";
import { SharedService } from "../services/shared.service";
import { Subscription } from 'rxjs';

import { WebsocketService } from '../services/websocket.service'
import { ProgressbarService } from '../services/progressbar.service';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';




@Component({
	selector: 'app-tree-table',
	templateUrl: './tree-table.component.html',
	styleUrls: ['./tree-table.component.scss'],
	providers: [SliceOperationsModalComponent, WebsocketService, ProgressbarService]
})
export class TreeTableComponent implements OnInit {



	stompClient = null;
	progress = 0;

	subscription: Subscription;
	terrCode: unknown;

	gridData: TreeNode[];
	cols: any[];
	loading: boolean;
	childrenNode: TreeNode[];
	display = false;
	modalContent: any;
	sliceId: number;
	historyList: any;
	showTimeline: boolean;
	period: string;

	files1: TreeNode[];

	constructor(public dialog: SliceOperationsModalComponent, private httpService: HttpService, private gridService: SlicesGridDataService, public dialogOperSlice: MatDialog, shared: SharedService, private progressbarService: ProgressbarService) {
		this.subscription = shared.subjTerrCode$.subscribe(val => {
			this.terrCode = val;
			console.log(this.terrCode)
		})

		progressbarService.messages.subscribe(msg => {
			console.log("Response from websocket:" + msg)
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


		this.loading = true
		this.gridService.getSliceGroups().then((gridData) => {
			this.gridData = this.formatGridData(gridData)['data']
			this.loading = false
		});

		this.cols = [
			{ field: 'name', header: 'Группы' },
			{ field: 'maxRecNum', header: 'На номер' },
			{ field: 'completed', header: 'Сформирован' },
			{ field: 'action', header: 'Действие' },
			{ field: 'region', header: 'По органу' },
			{ field: 'percentComplete', header: 'Прогресс' }
		];

		this.gridService.getSliceGroups1().then((files1) => {
			this.files1 = files1
		});
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

	openDialog(row) {
		// this.dialog.showDialog(row)
		this.modalContent = row
		console.log(row);
		this.display = true;
	}

	formatGridData(dataArray) {
		let parentNode: TreeNode = { 'data': [] };

		dataArray.forEach((item) => {
			let childNode = [];

			if (item['children'] != undefined && item['children'].length) {
				item['children'].forEach(element => {
					childNode.push({ 'data': this.childTreeNode(element), 'children': [{ 'data': {} }] })
				});
			}
			parentNode.data.push({ 'data': this.childTreeNode(item), 'children': childNode })
		});
		return parentNode
	}

	childTreeNode(data) {
		let dataNode = Object.keys(data).reduce((object, key) => {
			if (key !== 'children') {
				object[key] = data[key]
			}
			return object // В переменной объекты отдельно, без children
		}, {})
		return dataNode
	}

	onNodeExpand(event) {
		if (event.node.parent != null) {
			this.loading = true
			const checkDeleted = false
			const groupCode = event.node.parent.data.code
			const statusCode = event.node.data.code
			const year = event.node.data.statusYear

			this.httpService.getSlices(checkDeleted, groupCode, statusCode, year).then((data) => {
				this.childrenNode = this.formatGridData(data)['data']
				event.node.children = this.childrenNode
				//refresh the data
				this.gridData = [...this.gridData];
				this.loading = false
			})
		}
	}


}
