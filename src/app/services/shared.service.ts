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
		console.log(historyValue)
		this.subHistoryValue.next(historyValue)
	}

	//history Id to Edit Rejection Reason Modal
	private subHistoryId = new Subject();
	subjHistoryId$ = this.subHistoryId.asObservable()

	sendHistoryId(historyId: any) {
		this.subHistoryId.next(historyId)
	}

	//grid-in-agreement
	private subGridInAgreement = new Subject();
	subjGridInAgreement$ = this.subGridInAgreement.asObservable()

	sendGridInAgreement(gridData: any) {
		this.subGridInAgreement.next(gridData)
	}

	// approve and reject btn status for disable
	private subBtnStatus = new Subject();
	subjBtnStatus$ = this.subBtnStatus.asObservable();

	approveAndRejectBtnStatus(btnStatus: any) {
		this.subBtnStatus.next(btnStatus)
	}

	// Список групп на КАЗ во вкладке "Сформировать срез" 
	private subGroupListKaz = new Subject();
	subjGroupListKaz$ = this.subGroupListKaz.asObservable();

	sendGroupListLang(groupListLang: any) {
		this.subGroupListKaz.next(groupListLang)
	}

	// for sharing lang
	private subSliceGroupLang = new Subject();
	subjSliceGroupLang$ = this.subSliceGroupLang.asObservable();

	sendSliceGroupLang(sliceGroup: any) {
		this.subSliceGroupLang.next(sliceGroup)
	}

	//for sharing order slice data to tree-table component
	private subOrderSliceData = new Subject();
	subjOrderSliceData$ = this.subOrderSliceData.asObservable();

	sendOrderSliceList(orderSliceList: any) {
		this.subOrderSliceData.next(orderSliceList)
	}

	//for sharing progressbar-websocket list to tree-table component
	private subProgressbarWs = new Subject();
	subjProgressbarWs$ = this.subProgressbarWs.asObservable();

	sendProgressBarList(progressbarWsList: any) {
		console.log(progressbarWsList)
		this.subProgressbarWs.next(progressbarWsList)
	}


	private subChangeLang = new Subject();
	subjChangeLang$ = this.subChangeLang.asObservable();

	changeLangService(changeLang: any) {
		console.log(changeLang)
		this.subChangeLang.next(changeLang)
	}

	private subCheckDeleted = new Subject();
	subjCheckDeleted$ = this.subCheckDeleted.asObservable();

	showDeletedService(checkDeleted: any) {
		console.log(checkDeleted)
		this.subCheckDeleted.next(checkDeleted)
	}
}
