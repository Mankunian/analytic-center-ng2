import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import { SaveEditReasonObj } from "./../saveEditReasonObj";
import { TreeNode } from 'primeng/api';
import { GlobalConfig } from '../global';
import { Subscription } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	private BASE_API_URL = GlobalConfig.BASE_API_URL;
  private baseAuthUser = GlobalConfig.BASE_AUTH_USER
	changeLang: unknown = 'RU';
	checkDeleted: unknown = false;
  subscription: Subscription;
  private users;
  private terrCode;

	constructor(private http: HttpClient, shared: SharedService) {
		this.subscription = shared.subjChangeLang$.subscribe(lang => {
			this.changeLang = lang;
		})
		this.subscription = shared.subjCheckDeleted$.subscribe(checkDeleted => {
			this.checkDeleted = checkDeleted
    })
    this.getUsers()
    .subscribe(
        successData => {
          this.users = successData;
          console.log("HttpService -> constructor -> this.users", this.users)
        },
        error => {
          console.log("getUsers -> error", error)
        },
      () => { // when complete
        this.subscription = shared.subjTerrCode$.subscribe(userRole => {
          this.terrCode = userRole;
          this.users.forEach(element => {
            if (element[this.terrCode] != undefined) {
              this.baseAuthUser = element[this.terrCode];
            }
          });
        })
      }
    );
	}

	getGroupList() {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/groups')
	}

	getUsers() {
		return this.http.get('./assets/json/users.json')
	}

	getSliceNumber() {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/max');
	}

	getSlices(groupCode, statusCode, year) {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices' + '?deleted=' + this.checkDeleted + '&groupCode=' + groupCode + '&statusCode=' + statusCode + '&year=' + year)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getSliceGroups() {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/parents' + '?deleted=' + this.checkDeleted)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getTerritories() {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/territories')
	}

	getHistory(sliceId: number) {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/history')
	}

	getDataGridInAgreement(sliceId: number, historyId: number) {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/history/' + historyId + '/approving')
	}

	getReportsBySliceId(sliceId) {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/reports?sliceId=' + sliceId)
	}

	getRegions() {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/regsTree')
	}

	getGroupCommon() {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/governments/parents')
	}

	getGroupCommonChildren(searchPattern) {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/governments/children?searchPattern=' + searchPattern)
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}

	getDepsByReportId(reportId) {
		return this.http.get(this.BASE_API_URL + this.changeLang + '/slices/orgs?reportCode=' + reportId)
	}

	confirmSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': this.baseAuthUser
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/confirm', body, options)
	}

	deleteSliceService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': this.baseAuthUser
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/delete', body, options)
	}

	sendToPreliminaryService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': this.baseAuthUser
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/preliminary', body, options)
	}

	sendToAgreementService(sliceId: number) {
		let headers = new HttpHeaders({
			'sessionKey': this.baseAuthUser
		});

		let options = { headers: headers }
		const body = {}
		return this.http.put(this.BASE_API_URL + this.changeLang + '/slices/' + sliceId + '/send', body, options)
	}

	generateReports(lang, data) {
		let headers = new HttpHeaders({
			'sessionKey': this.baseAuthUser
		});
		let options = { headers: headers }

		return this.http.post(this.BASE_API_URL + this.changeLang + '/slices/reports/createReports?repLang=' + lang, data, options)
	}

	postOrderSlice(orderSliceObj: OrderSliceObj) {
		let headers = new HttpHeaders({
			'sessionKey': this.baseAuthUser
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
			'sessionKey': this.baseAuthUser
		});

		let options = { headers: headers }
    const body = {
      historyId: saveEditReasonObj.historyId,
      approveCode: saveEditReasonObj.approveCode,
      territoryCode: saveEditReasonObj.territoryCode,
      msg: saveEditReasonObj.msg
    };
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/approve', body, options)
	}

	approveSliceService(sliceId: any, saveEditReasonObj: SaveEditReasonObj) {
		let headers = new HttpHeaders({
			'sessionKey': this.baseAuthUser
		});

		let options = { headers: headers }
    const body = {
      historyId: saveEditReasonObj.historyId,
      approveCode: saveEditReasonObj.approveCode,
      territoryCode: saveEditReasonObj.territoryCode,
      msg: saveEditReasonObj.msg
    };
		return this.http.put(this.BASE_API_URL + '/' + sliceId + '/approve', body, options)
	}
}
