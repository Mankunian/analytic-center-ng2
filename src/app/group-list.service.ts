import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class GroupListService {
	private configUrl = 'https://18.140.232.52:8081/api/v1/RU/slices/groups'

	constructor(private http: HttpClient) { }
	
	getGroupList(){
		return this.http.get(this.configUrl)
	}
}
