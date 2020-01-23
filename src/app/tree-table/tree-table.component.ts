import { Component, OnInit } from '@angular/core';
import { SlicesGridDataService } from "../services/slices-grid-data.service";
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss']
})
export class TreeTableComponent implements OnInit {

  gridData: TreeNode[];
  cols: any[];
  files1: TreeNode[];

  constructor(private gridService: SlicesGridDataService) {}

  ngOnInit() {
    this.gridService.getSliceGroups().then((gridData) => { 
      this.gridData = this.formatGridData(gridData)['data']
    });

    this.cols = [
      { field: 'code', header: 'Группы' },
      { field: 'name', header: 'Size' },
      { field: 'complete', header: 'Type' }
    ];

    // this.gridService.getSliceGroups1().then((files1) => {
    //   this.files1 = files1
    // });
  }

  formatGridData(dataArray) {
    let parentNode: TreeNode = { 'data': [] };
    
    dataArray.forEach((item) => {
      let childNode = [];
      
      if (item['children'].length) {
        item['children'].forEach(element => {
          childNode.push({ 'data' : this.childTreeNode(element), 'children' : [] })
        });
      }
      parentNode.data.push({ 'data': this.childTreeNode(item), 'children' : childNode })
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
}
