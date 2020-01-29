import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
	private sub = new Subject();
	subj$ = this.sub.asObservable();

	send(value:string){
		this.sub.next(value)
		console.log(value)
	}

}
