import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FormatGridService {
  constructor() {}

  formatGridData(dataArray, treeView: boolean, lazyLoaded?: boolean) {
    let result = [];

    dataArray.forEach(region => {
      let tmp: any = {
        data: {},
      };
      if (treeView) {
        tmp.children = [];
      }

      Object.keys(region).forEach(prop => {
        if (prop != "children") {
          tmp.data[prop] = region[prop];
        } else {
          // prop == 'children'
          if (lazyLoaded) {
            if (region[prop].length) {
              tmp.children = this.formatGridData(region[prop], true, true);
            } else {
              tmp.children = [{ data: {} }];
            }
          } else {
            tmp.children = this.formatGridData(region[prop], true);
          }
        }
      });
      result.push(tmp);
    });
    return result;
  }
}
