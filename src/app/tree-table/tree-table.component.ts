import { Component, OnInit } from '@angular/core';
import { SlicesGridDataService } from "../services/slices-grid-data.service";
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.scss']
})
export class TreeTableComponent implements OnInit {

  files: TreeNode[];
  files1: TreeNode[];

  constructor(private gridService: SlicesGridDataService, private gridService1: SlicesGridDataService) {}

  ngOnInit() {
    this.gridService.getSliceGroups().then((files) => { 
      console.log(files);
      const data = [];
      this.files = data;
      this.files['data'] = files
      console.log(this.files);
      this.formatGridData(this.files)
    });

    this.gridService1.getSliceGroups1().then((files1) => {
      console.log(files1);
      this.files1 = files1
      console.log(this.files1);
    });
  }

  formatGridData(dataArray) {
    let formattedData = [];
    console.log(formattedData);
    dataArray.forEach(item => {
      formattedData.push(item);
      console.log(formattedData);
    });
  }

}
