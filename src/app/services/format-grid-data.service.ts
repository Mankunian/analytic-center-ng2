import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class FormatGridDataService {

  childrenNode: TreeNode[];

  constructor() { }

  formatGridData(dataArray, lazyLoadChild?: boolean) {
    let parentNode: TreeNode = { 'data': [] };
    
    dataArray.forEach((item) => {
      let childNode = [];
      
      if (item['children'] != undefined && item['children'].length > 0) {
        item['children'].forEach(element => {
          let childNode2 = [];
          
          if (element['children'] != undefined && element['children'].length) {
            element['children'].forEach(item => {
              childNode2.push({ 'data': this.childTreeNode(item) })
              if (lazyLoadChild) childNode2['children'] =  [{ 'data': {} }]
            })
          } else {
            childNode2 = [{ 'data': {} }]
          }
          childNode.push({ 'data': this.childTreeNode(element), 'children': childNode2 })
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
}
