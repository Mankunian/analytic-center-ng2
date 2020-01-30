import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../services/http.service';
import { TreeNode } from 'primeng/api';
import { FormatGridDataService } from '../services/format-grid-data.service';

@Component({
  selector: 'app-report-departments-list',
  templateUrl: './report-departments-list.component.html',
  styleUrls: ['./report-departments-list.component.scss']
})
export class ReportDepartmentsListComponent implements OnInit {

  data: any;
  reportId: any;
  gridDepData: TreeNode[];
  colsDep: any[];
  loading: boolean;
  selectedNodes: TreeNode[];
  @Input() groupCode: any;

  constructor(private http: HttpService, private formatGridDataService: FormatGridDataService) { }

  ngOnInit() {
    console.log(this.gridDepData);
    this.colsDep = [
      { field: 'code', header: 'И/н', width: '100px' },
      { field: 'name', header: 'Ведомство', width: '200px' }
    ];
    this.loading = true
    this.http.getDepsByReportId(this.groupCode).subscribe((data) => { 
      this.gridDepData = this.formatGridDataService.formatGridData(data)['data']
      console.log("TCL: ReportDepartmentsListComponent -> ngOnInit -> this.gridDepData", this.gridDepData)
      this.loading = false
    })
  }
}