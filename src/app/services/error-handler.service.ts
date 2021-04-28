import { Injectable } from "@angular/core";
import { GlobalConfig } from '../global';
import { HttpService } from "../services/http.service";
@Injectable({
	providedIn: "root",
})
export class ErrorHandlerService {
	constructor(private http: HttpService) { }

	alertError(errMsg) {
		if (errMsg.error.errDetails == 'invalid_token: Token has expired' || errMsg.error.error == 'invalid_token') {
			this.http.refreshTokenService().subscribe((data: any) => {
				let token = data.access_token
				sessionStorage.setItem('token', token);
			}, error => {
				window.location.href = GlobalConfig.ADMIN_PAGE
			})
		} else if (errMsg.error.errStatus == "BAD_REQUEST") {
			alert(errMsg.error.errDetails)
		} else if (errMsg.error.message === "USER:CURRENT-PASSWORD:INVALID" && errMsg.error.status === "BAD_REQUEST") {
			alert('Неверный пароль')
		} else if (errMsg.status === 403) {
			alert(errMsg.error.message)
		}
	}
}
