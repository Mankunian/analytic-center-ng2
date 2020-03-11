import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import { SaveEditReasonObj } from "./../saveEditReasonObj";
import { TreeNode } from 'primeng/api';
import { GlobalConfig } from '../global';
import { Subject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private BASE_API_URL = GlobalConfig.BASE_API_URL;

	constructor(private http: HttpClient) { }

	private subLang = new Subject();
	subjLang$ = this.subLang.asObservable();



	getGroupList(lang) {
		return this.http.get(this.BASE_API_URL + lang + '/slices/groups')
	}

	getSliceNumber() {
		return this.http.get(this.BASE_API_URL + '/RU/slices/max');
	}
	getSlices(checkDeleted: boolean, groupCode, statusCode, year) {
		return this.http.get(this.BASE_API_URL + 'RU/slices' + '?deleted=' + checkDeleted + '&groupCode=' + groupCode + '&statusCode=' + statusCode + '&year=' + year)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}
	getSliceGroups(checkDeleted) {
		return this.http.get(this.BASE_API_URL + 'RU/slices/parents' + '?deleted=' + checkDeleted)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}
	getTerritories(lang: string) {
		// console.log(lang)
		return this.http.get(this.BASE_API_URL + lang + '/slices/territories')
	}


	getHistory(sliceId: number) {
		return this.http.get(this.BASE_API_URL + '/RU/slices/' + sliceId + '/history')
	}

	getDataGridInAgreement(sliceId: number, historyId: number) {
		return this.http.get(this.BASE_API_URL + '/RU/slices/' + sliceId + '/history/' + historyId + '/approving')
	}

	getReportsBySliceId(sliceId) {
		return this.http.get(this.BASE_API_URL + 'RU/slices/reports?sliceId=' + sliceId)
	}

	getRegions() {
		return this.http.get(this.BASE_API_URL + 'RU/slices/regsTree')
	}

	getGroupCommon() {
		return this.http.get(this.BASE_API_URL + 'RU/slices/governments/parents')
	}

	getGroupCommonChildren(searchPattern) {
		return this.http.get(this.BASE_API_URL + 'RU/slices/governments/children?searchPattern=' + searchPattern)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getDepsByReportId(reportId) {
		return this.http.get(this.BASE_API_URL + 'RU/slices/orgs?reportCode=' + reportId)
	}

	confirmSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + 'RU/slices/' + sliceId + '/confirm', body, options)
	}

	deleteSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + 'RU/slices/' + sliceId + '/delete', body, options)
	}

	sendToPreliminaryService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + 'RU/slices/' + sliceId + '/preliminary', body, options)
	}
	sendToAgreementService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + 'RU/slices/' + sliceId + '/send', body, options)
	}
	generateReports(lang, data) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});
		let options = { headers: headers }

		return this.http.post(this.BASE_API_URL + 'RU/slices/reports/createReports?repLang=' + lang, data, options)
	}
	postOrderSlice(orderSliceObj: OrderSliceObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }

		const body = { startDate: orderSliceObj.startDate, endDate: orderSliceObj.endDate, maxRecNum: orderSliceObj.maxRecNum, groups: orderSliceObj.groups }
		// console.log(body)
		return this.http.post(this.BASE_API_URL + 'RU/slices', body, options);
	}

	rejectSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});
		// console.log(saveEditReasonObj)

		let options = { headers: headers }
		const body = { historyId: saveEditReasonObj.historyId, approveCode: saveEditReasonObj.approveCode, territoryCode: saveEditReasonObj.territoryCode, msg: saveEditReasonObj.msg };
		console.log(body)
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/approve', body, options)
	}

	approveSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = { historyId: saveEditReasonObj.historyId, approveCode: saveEditReasonObj.approveCode, territoryCode: saveEditReasonObj.territoryCode, msg: saveEditReasonObj.msg };
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/approve', body, options)

	}

}
