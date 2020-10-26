import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() { }

	ngOnInit() {
		let accessToken = window.location.search.substr(7)
		sessionStorage.setItem('token', accessToken)
	}
}
