import { Component, OnInit } from '@angular/core';
import { SlicesGridDataService } from "../services/slices-grid-data.service";
import { TreeNode } from 'primeng/api';
import { HttpService } from "../services/http.service";
import { MatDialog } from '@angular/material/dialog';
import { SliceOperationsModalComponent, SliceOperationsModalContentComponent } from "src/app/slice-operations-modal/slice-operations-modal.component";

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss'],
  providers: [SliceOperationsModalComponent]
})
export class TreeTableComponent implements OnInit {

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

	constructor(public dialog: SliceOperationsModalComponent, private httpService: HttpService, private gridService: SlicesGridDataService, public dialogOperSlice: MatDialog) { }

  ngOnInit() {
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
	
	openOperationSliceModal(rowEntity){
		console.log(rowEntity)
		this.period = rowEntity.period;
		this.sliceId = rowEntity.id;
		const dialogRef = this.dialogOperSlice.open(SliceOperationsModalContentComponent, {
			width: '1100px',
			data: {sliceId: this.sliceId, period: this.period}
		});

		dialogRef.afterOpen().subscribe(result =>{
			this.httpService.getHistory(this.sliceId).subscribe((data)=>{
				this.historyList = data;
				this.showTimeline = true;
			})
		})
		
		dialogRef.afterClosed().subscribe(result => {
			console.log(result)
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
          childNode.push({ 'data': this.childTreeNode(element), 'children': [{'data' : {}}]})
        });
      }
      parentNode.data.push({ 'data': this.childTreeNode(item), 'children': childNode})
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
      console.log("TCL: onNodeExpand -> event", event)
      this.loading = true
      const checkDeleted = false
      const groupCode = event.node.parent.data.code
      const statusCode = event.node.data.code
      const year = event.node.data.statusYear
      
      this.httpService.getSlices(checkDeleted, groupCode, statusCode, year).then((data) => {
      console.log("TCL: onNodeExpand -> data", data)
        this.childrenNode = this.formatGridData(data)['data']
        event.node.children = this.childrenNode
        //refresh the data
        this.gridData = [...this.gridData];
        this.loading = false
      })
    }
  }


}
