import { Component, OnInit } from "@angular/core";
import { HttpService } from './services/http.service';
import { TabMenuComponent } from "../app/tab-menu/tab-menu.component";
import { NavBarComponent } from "../app/nav-bar/nav-bar.component";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	userInfo: Record<string, any>;
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(private http: HttpService,
		public tabMenuComponent: TabMenuComponent,
		public navbarComponent: NavBarComponent,
		private httpService: HttpService
	) { }

	ngOnInit() {
		this.checkAccessTokenFromAdminRedirect()
		this.checkTokenForValidation()
	}

	checkTokenForValidation() {
		this.http.checkTokenValidationService().subscribe(data => {
			console.log(data)
			if (data == null) {
				let tokenIsValid = 'true';
				sessionStorage.setItem('tokenIsValid', tokenIsValid)
			}
		}, error => {
			console.log(error)
			// window.location.href = 'http://192.168.210.69'
			let hostname = sessionStorage.hostname;
			console.log(hostname)
			// Internal ip
			let ipStart192 = hostname.startsWith('192')
			let ipStart10 = hostname.startsWith('10')
			if (ipStart192) {
				window.location.href = "http://192.168.210.69:8084"
			} else if (ipStart10) {
				window.location.href = "http://10.2.30.69:8084"
			} else {
				window.location.href = "https://18.138.17.74:8084"
			}
		})
	}


	checkAccessTokenFromAdminRedirect() {
		if (window.location.search !== '') {
			let accessToken = window.location.search.substr(7);
			console.log(window.location)
			let hostName = window.location.origin;
			sessionStorage.setItem('token', accessToken)
			window.location.href = hostName;
		} else if (!sessionStorage.token) {
			alert('У вас недостаточно прав')
			// Here redirect to local IP-address url of admin 
			// window.location.href = 'http://192.168.210.69'

			let hostname = sessionStorage.hostname;
			console.log(hostname)
			// Internal ip
			let ipStart192 = hostname.startsWith('192')
			let ipStart10 = hostname.startsWith('10')
			if (ipStart192) {
				window.location.href = "http://192.168.210.69:8084"
			} else if (ipStart10) {
				window.location.href = "http://10.2.30.69:8084"
			} else {
				window.location.href = "http://localhost:4200/"
			}
		}
	}
}
