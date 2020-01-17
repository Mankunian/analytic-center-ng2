import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetSliceNumberService {
	private configUrl = 'https://18.140.232.52:8081/api/v1/RU/slices/max'
	// private configUrl = './assets/json/data.json'
	constructor(private http: HttpClient) { }
	
	getSliceNumber() {
		return this.http.get(this.configUrl);
	}
}
