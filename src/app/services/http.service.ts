import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import { SaveEditReasonObj } from "./../saveEditReasonObj";
import { TreeNode } from 'primeng/api';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private configUrl = 'https://18.140.232.52:8081/api/v1/RU/slices'

	constructor(private http: HttpClient) { }

	getGroupList() {
		return this.http.get(this.configUrl + '/groups')
	}

	getSliceNumber() {
		return this.http.get(this.configUrl + '/max');
	}

	getSlices(checkDeleted: boolean, groupCode, statusCode, year) {
		return this.http.get(this.configUrl + '?deleted=' + checkDeleted + '&groupCode=' + groupCode + '&statusCode=' + statusCode + '&year=' + year)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}



	getTerritories() {
		return this.http.get(this.configUrl + '/territories')
	}

	getHistory(sliceId: number) {
		return this.http.get(this.configUrl + '/' + sliceId + '/history')
	}

	getDataGridInAgreement(sliceId: number, historyId: number) {
		return this.http.get(this.configUrl + '/' + sliceId + '/history/' + historyId + '/approving')
	}

	confirmSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.configUrl + '/' + sliceId + '/confirm', body, options)
	}

	deleteSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.configUrl + '/' + sliceId + '/delete', body, options)
	}

	sendToPreliminaryService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.configUrl + '/' + sliceId + '/preliminary', body, options)
	}
	sendToAgreementService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.configUrl + '/' + sliceId + '/send', body, options)
	}


	postOrderSlice(orderSliceObj: OrderSliceObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers }

		const body = { startDate: orderSliceObj.startDate, endDate: orderSliceObj.endDate, maxRecNum: orderSliceObj.maxRecNum, groups: orderSliceObj.groups }
		// console.log(body)
		return this.http.post(this.configUrl, body, options);
	}

	putEditRejectedReasonService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});
		// console.log(saveEditReasonObj)

		let options = { headers: headers }
		const body = { historyId: saveEditReasonObj.historyId, approveCode: saveEditReasonObj.approveCode, territoryCode: saveEditReasonObj.territoryCode, msg: saveEditReasonObj.msg };
		console.log(body)
		return this.http.put(this.configUrl + '/' + sliceId + '/approve', body, options)
	}

}
