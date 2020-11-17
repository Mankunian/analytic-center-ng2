import { Component, OnInit } from "@angular/core";
import { HttpService } from './services/http.service';
import { TabMenuComponent } from "../app/tab-menu/tab-menu.component";
import { NavBarComponent } from "../app/nav-bar/nav-bar.component";
import { GlobalConfig } from './global';
import { ErrorHandlerService } from './services/error-handler.service';

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
		public errorHandler: ErrorHandlerService
	) { }

	ngOnInit() {
		this.checkAccessTokenFromAdminRedirect()
		this.checkTokenForValidation()
		let hostname = window.location.hostname;
		sessionStorage.setItem('hostname', hostname)
	}

	checkTokenForValidation() {
		this.http.checkTokenValidationService().subscribe(data => {
			console.log(data)
			if (data == null) {
				let tokenIsValid = 'true';
				sessionStorage.setItem('tokenIsValid', tokenIsValid);
			}
		}, error => {
			console.log(error)
			this.errorHandler.alertError(error);
			// window.location.href = GlobalConfig.ADMIN_PAGE
		})
	}


	checkAccessTokenFromAdminRedirect() {
		if (window.location.search !== '') {
			let search = window.location.search.substr(7);
			let splittedSearch = search.split('?')
			let accessToken = splittedSearch[0]
			let appCode = splittedSearch[1].substr(8)
			let appPass = splittedSearch[2].substr(8)
			let refreshToken = splittedSearch[3].substr(14)

			console.log(accessToken)
			console.log(appCode)
			console.log(appPass)
			console.log(refreshToken)
			// console.log(window.location)
			let hostName = window.location.origin;
			sessionStorage.setItem('token', accessToken)
			sessionStorage.setItem('refresh_token', refreshToken)
			sessionStorage.setItem('appCode', appCode)
			sessionStorage.setItem('appPass', appPass)
			window.location.href = hostName;
		} else if (!sessionStorage.token) {
			alert('У вас недостаточно прав')
			// Here redirect to local IP-address url of admin 
			window.location.href = GlobalConfig.ADMIN_PAGE
		}
	}
}
