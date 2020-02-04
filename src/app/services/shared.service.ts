import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



@Injectable({
	providedIn: 'root'
})
export class SharedService {

	// Territory code
	private subTerrCode = new Subject();
	subjTerrCode$ = this.subTerrCode.asObservable();

	sendTerrCode(terrCode: string) {
		this.subTerrCode.next(terrCode)
		console.log(terrCode)
	}

	// Show Table In Agreement
	private subTable = new Subject();
	subjTable$ = this.subTable.asObservable();

	showTableAgreement(showTable: boolean) {
		console.log('показать таблицу ' + showTable)
		this.subTable.next(showTable)
	}



	// HistoryId for Edit Rejection Reason
	private subHistoryId = new Subject();
	subjHistoryId$ = this.subHistoryId.asObservable()


	sendHistoryList(historyId: number) {
		this.subHistoryId.next(historyId)
		console.log(historyId)
	}



}
