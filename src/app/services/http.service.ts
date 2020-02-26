import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import { SaveEditReasonObj } from "./../saveEditReasonObj";
import { TreeNode } from 'primeng/api';
import { GlobalConfig } from '../global';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
  private BASE_API_URL = GlobalConfig.BASE_API_URL;
  public BASE_API_URLKz = GlobalConfig.BASE_API_URL

	constructor(private http: HttpClient) { }

	getGroupList() {
		return this.http.get(this.BASE_API_URL + '/groups')
	}
	getGroupListKz() {
		return this.http.get(this.BASE_API_URLKz + '/groups')
	}
	getSliceNumber() {
		return this.http.get(this.BASE_API_URL + '/max');
	}
	getSlices(checkDeleted: boolean, groupCode, statusCode, year) {
		return this.http.get(this.BASE_API_URL + '?deleted=' + checkDeleted + '&groupCode=' + groupCode + '&statusCode=' + statusCode + '&year=' + year)
    .toPromise()
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    .then(response => <TreeNode[]>response);
  }
  getSliceGroups() {
    return this.http.get(this.BASE_API_URL+'/parents')
    .toPromise()
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    .then(response => <TreeNode[]> response);
	}
	getTerritories() {
		return this.http.get(this.BASE_API_URL + '/territories')
	}
	getTerritoriesKz() {
		return this.http.get(this.BASE_API_URLKz + '/territories')
	}

	getHistory(sliceId: number) {
		return this.http.get(this.BASE_API_URL + '/' + sliceId + '/history')
	}

	getDataGridInAgreement(sliceId: number, historyId: number) {
		return this.http.get(this.BASE_API_URL + '/' + sliceId + '/history/' + historyId + '/approving')
  }
  
  getReportsBySliceId(sliceId) {
    return this.http.get(this.BASE_API_URL + '/reports?sliceId=' + sliceId)
  }

  getRegions() {
    return this.http.get(this.BASE_API_URL + '/regsTree')
  }
  
  getGroupCommon() {
    return this.http.get(this.BASE_API_URL + '/governments/parents')
  }
  
  getGroupCommonChildren(searchPattern) {
    return this.http.get(this.BASE_API_URL + '/governments/children?searchPattern='+searchPattern)
      .toPromise()
      .then(response => <TreeNode[]> response);
  }

  getDepsByReportId(reportId) {
    return this.http.get(this.BASE_API_URL + '/orgs?reportCode=' + reportId)
  }

	confirmSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/confirm', body, options)
	}

	deleteSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/delete', body, options)
	}

	sendToPreliminaryService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/preliminary', body, options)
	}
	sendToAgreementService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/send', body, options)
	}
  generateReports(lang, data) {
    let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});
    let options = { headers: headers }

    return this.http.post(this.BASE_API_URL + '/reports/createReports?repLang=' + lang, data, options)
  }
	postOrderSlice(orderSliceObj: OrderSliceObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }

		const body = { startDate: orderSliceObj.startDate, endDate: orderSliceObj.endDate, maxRecNum: orderSliceObj.maxRecNum, groups: orderSliceObj.groups }
		// console.log(body)
		return this.http.post(this.BASE_API_URL, body, options);
	}

	rejectSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});
		// console.log(saveEditReasonObj)

		let options = { headers: headers }
		const body = { historyId: saveEditReasonObj.historyId, approveCode: saveEditReasonObj.approveCode, territoryCode: saveEditReasonObj.territoryCode, msg: saveEditReasonObj.msg };
		console.log(body)
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/approve', body, options)
	}

	approveSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = { historyId: saveEditReasonObj.historyId, approveCode: saveEditReasonObj.approveCode, territoryCode: saveEditReasonObj.territoryCode, msg: saveEditReasonObj.msg };
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/approve', body, options)

	}

}
