import { Injectable } from "@angular/core";
import { GlobalConfig } from '../global';
import { HttpService } from "../services/http.service";
@Injectable({
	providedIn: "root",
})
export class ErrorHandlerService {
	constructor(private http: HttpService) { }

	alertError(errMsg) {
		console.log(errMsg)
	}
}
