import { Component, OnInit } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RxStompState } from "@stomp/rx-stomp";

@Component({
	selector: "app-status",
	templateUrl: "./socket-status.component.html",
	styleUrls: ["./socket-status.component.scss"],
})
export class SocketStatusComponent {
	public connectionStatus$: Observable<string>;

	constructor(public rxStompService: RxStompService) {
		this.connectionStatus$ = rxStompService.connectionState$.pipe(
			map(state => {
				// convert numeric RxStompState to string
				return RxStompState[state];
			})
		);
	}
}
