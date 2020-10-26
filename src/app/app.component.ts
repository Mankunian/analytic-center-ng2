import { Component, OnInit } from "@angular/core";
import { HttpService } from './services/http.service';

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(private http: HttpService) { }

	ngOnInit() {
		if (window.location.search !== '') {
			let accessToken = window.location.search.substr(7)
			let hostName = window.location.hostname;
			sessionStorage.setItem('token', accessToken)
			window.location.href = hostName;
		} else if (!sessionStorage.token) {
			window.location.href = 'https://master.d260huhvcvtk4w.amplifyapp.com/'
		}
		let token = sessionStorage.token
		this.getPermissionsByCurrentUser(token)

	}

	getPermissionsByCurrentUser(token) {
		console.log('тут права юзера')
		this.http.getPermissionsByUserService(token).subscribe(data => {
			console.log(data)
		})
	}
}
