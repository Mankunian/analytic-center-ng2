import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TreeNode} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SlicesGridDataService {
  private httpUrl = 'assets/json/parents.json'

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