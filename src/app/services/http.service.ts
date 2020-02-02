import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import { TreeNode } from 'primeng/api';
import { GlobalConfig } from '../global';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private BASE_API_URL = GlobalConfig.BASE_API_URL;

	constructor(private http: HttpClient) { }
	
	getGroupList(){
		return this.http.get(this.BASE_API_URL + '/groups')
	}

	getSliceNumber() {
		return this.http.get(this.BASE_API_URL + '/max');
  }
  
  getSlices(checkDeleted:boolean, groupCode, statusCode, year) {
    return this.http.get(this.BASE_API_URL + '?deleted='+checkDeleted+'&groupCode='+groupCode+'&statusCode='+statusCode+'&year='+year)
      .toPromise()
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      .then(response => <TreeNode[]> response);
  }
  
  getSliceGroups() {
    return this.http.get(this.BASE_API_URL+'/parents')
      .toPromise()
      .then(response => <TreeNode[]> response);
	}

	postOrderSlice(orderSliceObj: OrderSliceObj){
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = {headers: headers}

		const body = {startDate: orderSliceObj.startDate, endDate: orderSliceObj.endDate, maxRecNum: orderSliceObj.maxRecNum, groups: orderSliceObj.groups}
		return this.http.post(this.BASE_API_URL, body, options);
	}

	getTerritories(){
		return this.http.get(this.BASE_API_URL + '/territories')
	}
  
	getHistory(){
    return this.http.get(this.BASE_API_URL +'/'+ 889 + '/history')
	}
  
	getDataGridInAgreement(){
    return this.http.get(this.BASE_API_URL + '/'+ 889 + '/history/' + 134 + '/approving')
  }
  
  getReportsBySliceId(sliceId) {
    return this.http.get(this.BASE_API_URL + '/reports?sliceId=' + sliceId)
  }

  getRegions() {
    return this.http.get(this.BASE_API_URL + '/regsTree')
  }

  getDepsByReportId(reportId) {
    return this.http.get(this.BASE_API_URL + '/orgs?reportCode=' + reportId)
  }

  generateReports(lang, data) {
    let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});
    let options = { headers: headers }

    return this.http.post(this.BASE_API_URL + '/reports/createReports?repLang=' + lang, data, options)
  }


}
