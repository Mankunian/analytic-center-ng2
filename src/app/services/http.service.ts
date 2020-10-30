import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import { SaveEditReasonObj } from "./../saveEditReasonObj";
import { TreeNode } from 'primeng/api';
import { GlobalConfig } from '../global';
import { Subscription } from 'rxjs';
import { SharedService } from './shared.service';

// eslint-disable-next-line prettier/prettier
@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private BASE_API_URL = GlobalConfig.BASE_API_URL;
	private baseAuthUser = GlobalConfig.BASE_AUTH_USER
	public changeLang: unknown = 'RU';
	public checkDeleted: unknown = false;
	public subscription: Subscription;
	private users;
	private terrCode;
	private token = sessionStorage.token

	constructor(private http: HttpClient, shared: SharedService) {
		this.subscription = shared.subjChangeLang$.subscribe(lang => {
			this.changeLang = lang;
		})
		this.subscription = shared.subjCheckDeleted$.subscribe(checkDeleted => {
			this.checkDeleted = checkDeleted
		})
		// this.getUsers()
		// 	.subscribe(
		// 		successData => {
		// 			this.users = successData;
		// 			// console.log("HttpService -> constructor -> this.users", this.users)
		// 		},
		// 		error => {
		// 			console.log("getUsers -> error", error)
		// 		},
		// 		() => { // when complete
		// 			this.subscription = shared.subjTerrCode$.subscribe(userRole => {
		// 				this.terrCode = userRole;
		// 				this.users.forEach(element => {
		// 					if (element[this.terrCode] != undefined) {
		// 						this.baseAuthUser = element[this.terrCode];
		// 					}
		// 				});
		// 			})
		// 		}
		// 	);
	}


	getPermissionsByUserService() {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get('https://18.138.17.74:8084/api/v1/RU/adm-core/my/permissions', options)
	}

	getGroupList() {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/groups', options)
	}


	getTerritories() {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/territories', options)
	}


	getSliceNumber() {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/max', options);
	}



	getSlices(groupCode, statusCode, year) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices' + '?deleted=' + this.checkDeleted + '&groupCode=' + groupCode + '&statusCode=' + statusCode + '&year=' + year, options)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getSliceGroups() {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/parents' + '?deleted=' + this.checkDeleted, options)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getHistory(sliceId: number) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/history', options)
	}

	getUsers() {
		return this.http.get('./assets/json/users.json')
	}

	getDataGridInAgreement(sliceId: number, historyId: number) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/history/' + historyId + '/approving', options)
	}

	getReportsBySliceId(sliceId) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/reports?sliceId=' + sliceId, options)
	}

	getRegions() {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/regsTree', options)
	}

	getGroups4DialogTable(repGroup, groupCode) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/governments/parents?group=' + repGroup + '&report=' + groupCode, options)
	}

	getGroupsChildren4DialogTable(searchPattern, repGroup) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/governments/children?searchPattern=' + searchPattern + '&group=' + repGroup, options)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}


	getDepsByReportId(reportId) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/orgs?reportCode=' + reportId, options)
	}

	confirmSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/confirm', body, options)
	}

	deleteSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/delete', body, options)
	}

	sendToPreliminaryService(sliceId: number) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/preliminary', body, options)
	}

	sendToAgreementService(sliceId: number) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/send', body, options)
	}

	generateReports(lang, data) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		return this.http.post(this.BASE_API_URL + this.changeLang + '/slices/reports/createReports?repLang=' + lang, data, options)
	}

	postOrderSlice(orderSliceObj: OrderSliceObj) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }

		const body = {
			startDate: orderSliceObj.startDate,
			endDate: orderSliceObj.endDate,
			maxRecNum: orderSliceObj.maxRecNum,
			groups: orderSliceObj.groups
		}

		return this.http.post(this.BASE_API_URL + this.changeLang + '/slices', body, options);
	}

	rejectSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		const body = {
			historyId: saveEditReasonObj.historyId,
			approveCode: saveEditReasonObj.approveCode,
			territoryCode: saveEditReasonObj.territoryCode,
			msg: saveEditReasonObj.msg
		};
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/approve', body, options)
	}

	approveSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let headers = new HttpHeaders({
			'authorization': 'bearer ' + this.token
		});

		let options = { headers: headers }
		const body = {
			historyId: saveEditReasonObj.historyId,
			approveCode: saveEditReasonObj.approveCode,
			territoryCode: saveEditReasonObj.territoryCode,
			msg: saveEditReasonObj.msg
		};
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/approve', body, options)
	}
}
