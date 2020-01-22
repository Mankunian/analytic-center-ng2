import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
	private configUrl = 'https://18.140.232.52:8081/api/v1/KZ/slices/'

	constructor(private http: HttpClient) { }
	
	getGroupList(){
		return this.http.get(this.configUrl + 'groups')
	}

	getSliceNumber() {
		return this.http.get(this.configUrl + 'max');
	}
}
