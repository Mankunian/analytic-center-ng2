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
    let newArray :TreeNode = { 'data': [] };
    let formattedData;
    console.log(dataArray);

    dataArray.forEach((item, index) => {
      console.log(item.children);
      if (item['children'].length) {
        console.log('have child');
      }
      console.log(typeof item);
      this.childTreeNode(item)
      // let objectWithoutChildren = Object.keys(item).reduce((object, key) => {
      //   if (key !== 'children') {
      //     object[key] = item[key]
      //   }
      //   return object
      // }, {})

      formattedData = { 'data': objectWithoutChildren, 'children' : item['children'] }
      newArray['data'].push(formattedData)
    });
    console.log("TCL: formatGridData -> newArray", newArray)
    return newArray;
  }

  childTreeNode(data) {
    let dataNode = Object.keys(item).reduce((object, key) => {
      if (key !== 'children') {
        object[key] = data[key]
      }
      return object
    }, {})


  }

}
