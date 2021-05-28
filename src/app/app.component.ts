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
	marqueeText: any[];
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(private http: HttpService,
		public tabMenuComponent: TabMenuComponent,
		public navbarComponent: NavBarComponent,
		public errorHandler: ErrorHandlerService
	) { }

	ngOnInit() {
		this.checkAccessTokenFromAdminRedirect()
		this.checkTokenForValidation();
		this.checkNotification();
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
		})
	}


	checkAccessTokenFromAdminRedirect() {
		if (window.location.search !== '') {
			let search = window.location.search.substr(7);
			let splittedSearch = search.split('&');
			let accessToken = splittedSearch[0];
			let refreshToken = splittedSearch[1].substr(14);
			let lang = splittedSearch[2].substr(5);
			let appCode = splittedSearch[3].substr(8);
			let hostName = window.location.origin;

			sessionStorage.setItem('token', accessToken);
			sessionStorage.setItem('refresh_token', refreshToken);
			sessionStorage.setItem('lang', lang);
			sessionStorage.setItem('appCode', appCode);
			window.location.href = hostName;
		} else if (!sessionStorage.token) {
			alert('У вас недостаточно прав')
			// Here redirect to local IP-address url of admin 
			window.location.href = GlobalConfig.ADMIN_PAGE
		}
	}


	checkNotification() {
		let appCode = sessionStorage.getItem('appCode');
		this.http.getTechnicalNotificationService(appCode).subscribe((data: any) => {
			console.log(data);
			this.marqueeText = [];
			data.forEach(element => {
				if (element.status == 'PLANNED') {
					this.marqueeText.push(element);

				}
			});
		})
	}
}
