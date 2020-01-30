import {Component, Inject} from '@angular/core';
import {HttpService} from '../services/http.service'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { FormatGridDataService } from '../services/format-grid-data.service';

@Component({
  selector: 'app-reports-modal',
  templateUrl: './reports-modal.component.html',
  styleUrls: ['./reports-modal.component.scss']
})
export class ReportsModalComponent {
  constructor(public dialog: MatDialog, private http: HttpService) { }
}

@Component({
  selector: 'app-reports-modal-content',
  templateUrl: './reports-modal-content.component.html',
  styleUrls: ['./reports-modal-content.component.scss']
})

export class ReportsModalContentComponent {
  
  sliceId: any;
  slicePeriod: any;
  reportGroups: any;
  colsDep: any[];
  colsReg: any[];
  loading: boolean;
  loadingReg: boolean;
  tabLoadedData: any = [];
  selectedGroupCode: any;
  gridDepData: TreeNode[];
  gridDepDataArray: any = [];
  gridRegData: TreeNode[];
  gridRegDataArray: any = [];
  selectedNodes: TreeNode[];
  selectedNodesArray: any = [];
  
  constructor(
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formatGridDataService: FormatGridDataService
  ) { }
  
  ngOnInit() {
    this.sliceId = this.data.sliceId
    this.slicePeriod = this.data.slicePeriod

    this.http.getReportsBySliceId(this.sliceId).subscribe((data) => {
      this.reportGroups = data;
    })
    
    this.colsDep = [
      { field: 'code', header: 'И/н', width: '100px' },
      { field: 'name', header: 'Ведомство', width: '200px' }
    ];

    this.colsReg = [
      { field: 'code', header: 'И/н', width: '100px' },
      { field: 'name', header: 'Регион/Орган', width: '200px' }
    ];
  }	

  tabChange(index: number) {
    if (index != 0) {
      this.selectedGroupCode = this.reportGroups[index - 1].code
      
      if (!this.tabLoadedData[index]) {
        this.loading = true
        this.loadingReg = true

        this.http.getDepsByReportId(this.selectedGroupCode).subscribe((data) => { 
          this.gridDepData = this.formatGridDataService.formatGridData(data)['data']
          this.gridDepDataArray[this.selectedGroupCode] = this.gridDepData
          this.loading = false
        })
        
        this.http.getRegions().subscribe((data) => {
          this.gridRegData = this.formatGridDataService.formatGridData([data])['data']
          this.gridRegData[0]['expanded'] = true // Раскрываем первую ветку по умолчанию
          this.gridRegDataArray[this.selectedGroupCode] = this.gridRegData
          this.loadingReg = false
        })

        this.tabLoadedData[index] = true
      }
    }
  }

  nodeSelect(event, code) {
    console.log(this.selectedNodesArray);
    console.log("TCL: ReportsModalContentComponent -> nodeSelect -> event", code, event)
  }
  nodeUnselect(event, code) {
    console.log("TCL: ReportsModalContentComponent -> nodeUnselect -> event", code, event)
  }
  nodeRegSelect(event, code) {
    console.log(this.selectedNodesArray);
    console.log("TCL: ReportsModalContentComponent -> nodeSelect -> event", code, event)
  }
  nodeRegUnselect(event, code) {
    console.log("TCL: ReportsModalContentComponent -> nodeUnselect -> event", code, event)
  }

  onNodeExpand(event) {
    console.log(this.selectedNodes);
  }
}