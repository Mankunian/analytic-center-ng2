import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class FormatGridService {

  childrenNode: TreeNode[]

  constructor() { }

  formatGrid(dataArray, lazyloaded) {
    let parentNode: TreeNode = { 'data': [] }
    let childNode
  
    dataArray.forEach(element => {
      if (element.children != undefined && element.children.length != 0) {
        childNode = this.formatGridChild(element.children)
      } else {
        if (lazyloaded) { // data loaded by expanding nodes 
          childNode = undefined
        } else { // initially loaded data
          childNode = [{ 'data': {} }]
        }
      }
      parentNode.data.push({ 'data': this.removeChildren(element), 'children': childNode })
    })
    return parentNode
  }
  
  formatGridChild(childArray) {
    let childNodeArray = []

    childArray.forEach(element => {
      childNodeArray.push({ 'data': this.removeChildren(element), 'children': [{ 'data': {} }] })
    });
    return childNodeArray
  }

  
  removeChildren(data) {
    let dataNode = Object.keys(data).reduce((object, key) => {
      if (key !== 'children') {
        object[key] = data[key]
      }
      return object // В переменной объекты отдельно, без children
    }, {})
    return dataNode
  }
}
