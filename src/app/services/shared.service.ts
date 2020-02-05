import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



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



	// HistoryList update 
	private subHistoryValue = new Subject();
	subjHistoryValue$ = this.subHistoryValue.asObservable()


	sendHistoryList(historyValue: any) {
		this.subHistoryValue.next(historyValue)
		console.log(historyValue)
	}

	//history Id to Edit Rejection Reason Modal
	private subHistoryId = new Subject();
	subjHistoryId$ = this.subHistoryId.asObservable()

	sendHistoryId(historyId: any) {
		console.log(historyId)
		this.subHistoryId.next(historyId)
	}


	//grid-in-agreement
	private subGridInAgreement = new Subject();
	subjGridInAgreement$ = this.subGridInAgreement.asObservable()

	sendGridInAgreement(gridData: any) {
		console.log(gridData)
		this.subGridInAgreement.next(gridData)
	}


	// approve and reject btn status for disable
	private subBtnStatus = new Subject();
	subjBtnStatus$ = this.subBtnStatus.asObservable();

	approveAndRejectBtnStatus(btnStatus: any) {
		console.log(btnStatus)
		this.subBtnStatus.next(btnStatus)
	}



}
