import { Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";
@Injectable({
	providedIn: "root",
})
export class ErrorHandlerService {
	constructor(private http: HttpService) { }

	alertError(errMsg) {
		console.log("ErrorHandlerService -> alertError -> errMsg", errMsg);
		if (errMsg.error.errDetails == 'invalid_token: Token has expired') {
			alert('Обвновление нового токена')
			// this.http.refreshTokenService().subscribe(data => {
			// 	console.log(data)
			// })
		}
		// errMsg != undefined ? alert(errMsg.error.errMsg) : alert("Произошла ошибка на сервере.");
	}
}
