import { Component, OnInit } from '@angular/core';
import { SlicesGridDataService } from "../services/slices-grid-data.service";
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss']
})
export class TreeTableComponent implements OnInit {

  files: TreeNode[];
  files1: TreeNode[];
  test: any;

  constructor(private gridService: SlicesGridDataService) {}

  ngOnInit() {
    this.gridService.getSliceGroups().then((files) => { 
      this.test = this.formatGridData(files)
      this.files = this.test.data;
    });

    this.gridService.getSliceGroups1().then((files1) => {
      console.log(files1);
      this.files1 = files1
    });
  }

  
  formatGridData(dataArray) {
    // let newArray :TreeNode = { 'data': [] };
    let formattedData :TreeNode = { 'data': [] };
    console.log(dataArray);

    dataArray.forEach((item, index) => {
      if (item['children'].length) {
        console.log('have child');
        // formattedData.data.push(this.childTreeNode(item['children']))
      }
      
      formattedData.data.push({ 'data': this.childTreeNode(item), 'children' : this.childTreeNode(item['children']) })
    });
    console.log("TCL: formatGridData -> formattedData", formattedData)
    return formattedData
  }

  childTreeNode(data) {
    let dataNode = Object.keys(data).reduce((object, key) => {
      if (key !== 'children') {
        object[key] = data[key]
      }
      return object // В переменной объекты отдельно, без children
    }, {})

    return dataNode
    // return { 'data': dataNode, 'children' : data['children'] }
  }

}
