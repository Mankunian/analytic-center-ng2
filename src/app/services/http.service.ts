import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { OrderSliceObj } from "./../orderSliceObj";
import { Header } from 'primeng/api/shared';

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

	postOrderSlice(orderSliceObj: OrderSliceObj){
		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = {headers: headers}

		const body = {startDate: orderSliceObj.startDate, endDate: orderSliceObj.endDate, maxRecNum: orderSliceObj.maxRecNum, groups: orderSliceObj.groups}
		console.log(body)
		return this.http.post(this.configUrl, body, options);
	}
}
