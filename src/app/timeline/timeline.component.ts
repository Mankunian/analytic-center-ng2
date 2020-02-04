import { Component, Inject } from '@angular/core';
import { HttpService } from '../services/http.service'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SharedService } from "../services/shared.service";




@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
	alternate = true;
	onFocusOpened = true;
	toggle = true;
	color = false;
	size = 30;
	expandEnabled = true;
	side = 'left';
	sliceCreator: string;
	sliceDate: string;
	showTableInAgreement: boolean;
	showTimeline: boolean;
	gridListInAgreement: any;
	historyList: any;
	injectValueToModal: any;
	personName: string;
	statusDate: string;
	GP: boolean;
	historyListLength: number;
	lastElemHistoryList: any;

	subscription: Subscription;
	updatedHistoryList: unknown;

	constructor(private http: HttpService, @Inject(MAT_DIALOG_DATA) public data: any, shared: SharedService) {
		this.subscription = shared.subj$.subscribe(val => {
			console.log('check here')
			console.log(val)
			this.historyList = val;
		})
	}

	ngOnInit() {
		this.injectValueToModal = this.data;
		if (this.injectValueToModal.terrCode == '19000090') {
			this.GP = true;
		}
		this.http.getHistory(this.injectValueToModal.sliceId).subscribe((data) => {
			this.historyList = data;
			this.historyListLength = this.historyList.length;
			this.lastElemHistoryList = this.historyList[this.historyListLength - 1]

			if (this.historyListLength - 1) {
				console.log(this.historyListLength - 1)
				this.expandEnabled = true;
			}
			this.showTimeline = true;
		})
	}

	entries = [
		{
			header: 'header',
			content: 'content'
		}
	]

	onHeaderClick(historyValue) {

		if (historyValue.statusCode == "2") {
			this.sliceCreator = 'Задачу выставил:'
			this.sliceDate = 'Время начала формирования:'
		} else if (historyValue.statusCode == "1") {
			this.sliceCreator = 'Срез утвердил:';
			this.sliceDate = 'Время утверждения среза:'
		} else if (historyValue.statusCode == "7") {
			this.sliceCreator = 'Срез отправил на согласование:'
			this.sliceDate = 'Время отправки на согласование среза:'
			this.showTableInAgreement = true;
			this.showTimeline = false

			this.personName = historyValue.personName;
			this.statusDate = historyValue.statusDate;

			this.http.getDataGridInAgreement(historyValue.sliceId, historyValue.id).subscribe((data) => {
				console.log(data)
				this.gridListInAgreement = data;
			})
		} else if (historyValue.statusCode == "3") {
			this.sliceCreator = 'Срез удалил:'
			this.sliceDate = 'Время удаления среза:'
		} else if (historyValue.statusCode == "5") { // сформирован с ошибкой
			this.sliceCreator = 'Задачу выставил:'
			this.sliceDate = 'Время выставления задачи:'
			this.sliceDate = 'Время начала формирования'
		}

		if (!this.expandEnabled) {
			event.stopPropagation();
		}
	}

	backToTimeline() {
		this.showTimeline = true;
		this.showTableInAgreement = false;
	}

	onExpandEntry(historyValue) {
		// 	console.log(historyValue)
		// 	if (historyValue.statusCode == "2") {
		// 		this.sliceCreator = 'Задачу выставил:'
		// 		this.sliceDate = 'Время начала формирования:'
		// 	} else if(historyValue.statusCode == "1"){
		// 		this.sliceCreator = 'Срез утвердил:';
		// 		this.sliceDate = 'Время утверждения среза:'
		// 	} else if (historyValue.statusCode == "7"){
		// 		this.sliceCreator = 'Срез отправил на согласование:'
		// 		this.sliceDate = 'Время отправки на согласование среза:'
		// 		this.showTableInAgreement = true;
		// 		this.showTimeline = false

		// 		this.http.getDataGridInAgreement(historyValue.sliceId, historyValue.id).subscribe((data)=>{
		// 			console.log(data)
		// 			this.gridListInAgreement = data;
		// 		})
		// }
	}

	toggleSide() {
		this.side = this.side === 'left' ? 'right' : 'left';
	}
}


