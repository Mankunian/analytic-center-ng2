import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { TreeNode } from 'primeng/api';
import { FormatGridDataService } from '../services/format-grid-data.service';

@Component({
  selector: 'app-report-regions-list',
  templateUrl: './report-regions-list.component.html',
  styleUrls: ['./report-regions-list.component.scss']
})

export class ReportRegionsListComponent implements OnInit {

  data = [];
  gridData: TreeNode[];
  cols: any[];
  loading: boolean;
  selectedNodes: TreeNode[];
  gridLoaded = false;

  constructor(private http: HttpService, private formatGridDataService: FormatGridDataService) { }

  ngOnInit() {
    this.cols = [
      { field: 'code', header: 'И/н', width: '100px' },
      { field: 'name', header: 'Регион/Орган', width: '200px' }
    ];
  }
  
  initRegGrid() {
    this.loading = true
    this.http.getRegions().subscribe((data) => {
      this.data = this.formatGridDataService.formatGridData([data])['data']
      this.data[0]['expanded'] = true // Раскрываем первую ветку по умолчанию
      this.gridData = this.data
      this.loading = false
    })
  }

  onNodeExpand(event) {
    console.log(this.selectedNodes);
  }

}