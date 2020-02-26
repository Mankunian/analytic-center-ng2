import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { HttpHeaders } from '@angular/common/http';


// const CONFIG_URL = 'ws://18.140.232.52:8081/topic/sliceCompletion'
const CONFIG_URL = 'ws://anal-centre.tk:8081/topic/sliceCompletion'

export interface Message {
	// author: string;
	message: string;
}

@Injectable({
	providedIn: 'root'
})
export class ProgressbarService {
	public messages: Subject<Message>;



	constructor(wsService: WebsocketService) {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions

		let headers = new HttpHeaders({
			'sessionKey': 'admin'
		});

		let options = { headers: headers };
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		this.messages = <Subject<Message>>wsService
			.connect(CONFIG_URL, options)
			.pipe(map((response: MessageEvent): Message => {
				console.log(response)
				let data = JSON.parse(response.data);
				return {
					// author: data.author,
					message: data.message
				}
			}));
	}
}
