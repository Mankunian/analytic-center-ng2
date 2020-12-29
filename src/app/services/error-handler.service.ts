import { Injectable } from "@angular/core";
import { GlobalConfig } from '../global';
import { HttpService } from "../services/http.service";
@Injectable({
	providedIn: "root",
})
export class ErrorHandlerService {
	constructor(private http: HttpService) { }

	alertError(errMsg) {
		console.log("ErrorHandlerService -> alertError -> errMsg", errMsg);
		if (errMsg.error.errDetails == 'invalid_token: Token has expired' || errMsg.error.error == 'invalid_token') {
			// alert('Обвновление нового токена')
			this.http.refreshTokenService().subscribe((data: any) => {
				console.log(data.access_token)
				let token = data.access_token
				sessionStorage.setItem('token', token)
				window.location.href = window.location.origin;
			}, error => {
				console.log(error)
				// alert('Просрочен refresh_token')
				window.location.href = GlobalConfig.ADMIN_PAGE
			})
		} else if (errMsg.error.errStatus == "BAD_REQUEST") {
			alert(errMsg.error.errDetails)
		}
		// errMsg != undefined ? alert(errMsg.error.errMsg) : alert("Произошла ошибка на сервере.");
	}
}
