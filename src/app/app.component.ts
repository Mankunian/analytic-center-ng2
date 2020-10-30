import { Component, OnInit } from "@angular/core";
import { HttpService } from './services/http.service';

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	userInfo: Record<string, any>;
	permissionCodes: {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(private http: HttpService) { }

	ngOnInit() {
		this.checkAccessTokenFromAdminRedirect()
		this.permissionCodes = {}
	}

	checkAccessTokenFromAdminRedirect() {
		console.log(window.location)
		if (window.location.search !== '') {
			let accessToken = window.location.search.substr(7);
			console.log(accessToken)
			let hostName = window.location.hostname;
			sessionStorage.setItem('token', accessToken)
			window.location.href = hostName;
		} else if (!sessionStorage.token) {
			alert('У вас недостаточно прав')
			// window.location.href = 'https://master.d260huhvcvtk4w.amplifyapp.com/'
		}
		// let token = sessionStorage.token
		this.getPermissionsByCurrentUser()

	}

	getPermissionsByCurrentUser() {
		this.http.getPermissionsByUserService().subscribe(data => {
			console.log(data)
			this.userInfo = data;
			sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
			// this.userInfo.permissions.forEach((element, key) => {
			// 	console.log(key, element)
			// 	this.permissionCodes[element] = true;
			// });
			sessionStorage.setItem('permissionCode', JSON.stringify(this.userInfo.permissions))
		})
	}
}
