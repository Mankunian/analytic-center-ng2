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
	private Lang = 'RU';
	private checkDeleted = false;

	constructor(private http: HttpClient) { }

	private subLang = new Subject();
	subjLang$ = this.subLang.asObservable();

	changeLang(lang: any) {
		console.log(lang)
		this.Lang = lang;
	}

	private subCheckDeleted = new Subject();
	subjCheckDeleted$ = this.subCheckDeleted.asObservable();

	showDeleted(checkDeleted: any) {
		console.log(checkDeleted)
		this.checkDeleted = checkDeleted
	}

	getGroupList() {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/groups')
	}

	getUsers() {
		return this.http.get('./assets/json/users.json')
	}

	getSliceNumber() {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/max');
	}

	getSlices(checkDeleted: boolean, groupCode, statusCode, year) {
		console.log(this.Lang)
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices' + '?deleted=' + this.checkDeleted + '&groupCode=' + groupCode + '&statusCode=' + statusCode + '&year=' + year)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getSliceGroups() {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/parents' + '?deleted=' + this.checkDeleted)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getTerritories() {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/territories')
	}

	getHistory(sliceId: number) {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/' + sliceId + '/history')
	}

	getDataGridInAgreement(sliceId: number, historyId: number) {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/' + sliceId + '/history/' + historyId + '/approving')
	}

	getReportsBySliceId(sliceId) {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/reports?sliceId=' + sliceId)
	}

	getRegions() {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/regsTree')
	}

	getGroupCommon() {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/governments/parents')
	}

	getGroupCommonChildren(searchPattern) {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/governments/children?searchPattern=' + searchPattern)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getDepsByReportId(reportId) {
		return this.http.get(this.BASE_API_URL + this.Lang + '/slices/orgs?reportCode=' + reportId)
	}

	confirmSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.Lang + '/slices/' + sliceId + '/confirm', body, options)
	}

	deleteSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.Lang + '/slices/' + sliceId + '/delete', body, options)
	}

	sendToPreliminaryService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.Lang + '/slices/' + sliceId + '/preliminary', body, options)
	}

	sendToAgreementService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.Lang + '/slices/' + sliceId + '/send', body, options)
	}

	generateReports(lang, data) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});
		let options = { headers: headers }

		return this.http.post(this.BASE_API_URL + this.Lang + '/slices/reports/createReports?repLang=' + lang, data, options)
	}

	postOrderSlice(orderSliceObj: OrderSliceObj) {
		let headers = new HttpHeaders({
			'sessionKey': 'user0'
		});

		let options = { headers: headers }

		const body = { startDate: orderSliceObj.startDate, endDate: orderSliceObj.endDate, maxRecNum: orderSliceObj.maxRecNum, groups: orderSliceObj.groups }
		// console.log(body)
		return this.http.post(this.BASE_API_URL + this.Lang + '/slices', body, options);
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
