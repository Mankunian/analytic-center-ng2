import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class WebsocketService {

	private configUrl = 'https://18.140.232.52:8081/api/v1/RU/slices'

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() { }

	// const ws = new WebSocket(this.configUrl + '/topic/sliceCompletion');
}
