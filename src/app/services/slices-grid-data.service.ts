import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TreeNode } from 'primeng/api';
import { GlobalConfig } from '../global';


@Injectable({
	providedIn: 'root'
})
export class SlicesGridDataService {
	// private httpUrl = 'https://anal-centre.tk:8081/api/v1/RU/slices/parents'
	// private httpUrlKz = 'https://anal-centre.tk:8081/api/v1/KZ/slices/parents'

	private BASE_API_URL = GlobalConfig.BASE_API_URL;

	constructor(private http: HttpClient) { }

	getSliceGroups(lang) {
		return this.http.get(this.BASE_API_URL + lang + '/slices/parents')
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}
	getSliceGroups1() {
		return this.http.get('assets/json/filesystem.json')
			.toPromise()
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			.then(response => <TreeNode[]>response);
	}
}
