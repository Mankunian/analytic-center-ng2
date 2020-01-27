import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import {TreeNode} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
	private configUrl = 'https://18.140.232.52:8081/api/v1/RU/slices'

	constructor(private http: HttpClient) { }
	
	getGroupList(){
		return this.http.get(this.configUrl + '/groups')
	}

	getSliceNumber() {
		return this.http.get(this.configUrl + '/max');
  }
  
  getSlices(checkDeleted:boolean, groupCode, statusCode, year) {
    return this.http.get(this.configUrl + '?deleted='+checkDeleted+'&groupCode='+groupCode+'&statusCode='+statusCode+'&year='+year)
      .toPromise()
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      .then(response => <TreeNode[]> response);
	}

	postOrderSlice(orderSliceObj: OrderSliceObj){
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = {headers: headers}

		const body = {startDate: orderSliceObj.startDate, endDate: orderSliceObj.endDate, maxRecNum: orderSliceObj.maxRecNum, groups: orderSliceObj.groups}
		console.log(body)
		return this.http.post(this.configUrl, body, options);
	}

	getTerritories(){
		return this.http.get(this.configUrl + '/territories')
	}

	getHistory(){
		return this.http.get(this.configUrl +'/'+ 889 + '/history')
	}

	getDataGridInAgreement(){
		return this.http.get(this.configUrl + '/'+ 889 + '/history/' + 134 + '/approving')
	}
}
