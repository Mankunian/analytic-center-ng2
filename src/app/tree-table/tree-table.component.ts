import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { HttpService } from "../services/http.service";
import { MatDialog } from '@angular/material/dialog';
import { ReportsModalComponent, ReportsModalContentComponent } from "../reports-modal/reports-modal.component";
import { SliceOperationsModalComponent, SliceOperationsModalContentComponent } from "src/app/slice-operations-modal/slice-operations-modal.component";
import { FormatGridDataService } from '../services/format-grid-data.service';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss'],
  providers: [SliceOperationsModalComponent, ReportsModalComponent]
})
export class TreeTableComponent implements OnInit {

  gridData: TreeNode[];
  cols: any[];
  loading: boolean;
  childrenNode: TreeNode[];
  @Input() checkDeleted: boolean

  constructor(
    public reportsModalInstance: ReportsModalComponent,
    private httpService: HttpService,
    private formatGridDataService: FormatGridDataService,
    public dialogOperSlice: MatDialog,
    public reportsModal: MatDialog,
  ) { }

  ngOnInit() {
    this.loading = true
    this.httpService.getSliceGroups().then((gridData) => {
      this.gridData = this.formatGridDataService.formatGridData(gridData, true)['data']
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
	}
	
	openOperationSliceModal(){
		const dialogRef = this.dialogOperSlice.open(SliceOperationsModalContentComponent);
		dialogRef.afterClosed().subscribe(result => {
			console.log(result)
		})
	}

  openReportsModal(row) {
    const sliceId = row.id
    const slicePeriod = row.period
    
    if (row.statusCode == "0" || row.statusCode == "6") {
      alert('По данному статусу невозможно получить отчет!')
    } else {
      const reportsModalRef = this.reportsModal.open(ReportsModalContentComponent, {
        data: { sliceId: sliceId, slicePeriod: slicePeriod  },
        height: '695px',
        width: '1050px'
      });
      reportsModalRef.afterClosed().subscribe(result => {
        // console.log(result)
      })
    }
	}

  onNodeExpand(event) {
    console.log(this.checkDeleted);
    if (event.node.parent != null) {
      this.loading = true
      const groupCode = event.node.parent.data.code,
            statusCode = event.node.data.code,
            year = event.node.data.statusYear
      
      this.httpService.getSlices(this.checkDeleted, groupCode, statusCode, year).then((data) => {
        this.childrenNode = this.formatGridDataService.formatGridData(data)['data']
        event.node.children = this.childrenNode
        //refresh the data
        this.gridData = [...this.gridData];
        this.loading = false
      })
    }
  }

}
