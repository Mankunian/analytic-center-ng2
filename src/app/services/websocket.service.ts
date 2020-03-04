import { Injectable } from '@angular/core';
import * as Rx from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() { }
	private subject: Rx.Subject<MessageEvent>;


	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public connect(url, options): Rx.Subject<MessageEvent> {
		if (!this.subject) {
			this.subject = this.create(url);
			// console.log("Successfully connected: " + url);
		}
		return this.subject;
	}

	private create(url): Rx.Subject<MessageEvent> {
		// console.log(url)
		let ws = new WebSocket(url);

		let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
			// console.log(obs)
			ws.onmessage = obs.next.bind(obs);
			ws.onerror = obs.error.bind(obs);
			ws.onclose = obs.complete.bind(obs);
			return ws.close.bind(ws)
			console.log(ws.onmessage)
		});

		let observer = {
			next: (data: Record<string, any>) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				}
			}
		}
		return Rx.Subject.create(observer, observable)
	}
}
