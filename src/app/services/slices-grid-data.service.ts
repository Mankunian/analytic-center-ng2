import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TreeNode} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SlicesGridDataService {
  // private httpUrl = 'https://18.140.232.52:8081/api/v1/RU/slices/parents'
  private httpUrl = 'assets/json/groups.json'

  constructor(private http: HttpClient) { }
	
  getSliceGroups() {
    return this.http.get(this.httpUrl)
      .toPromise()
      .then(response => <TreeNode[]> response);
	}
  getSliceGroups1() {
    return this.http.get('assets/json/filesystem.json')
                    .toPromise()
                    .then(response => <TreeNode[]> response);
	}
}