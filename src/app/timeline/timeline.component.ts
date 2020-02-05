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
	injectValueToModal: any;
	personName: string;
	statusDate: string;
	GP: boolean;
	historyListLength: number;
	lastElemHistoryList: any;

	subscription: Subscription;
	updatedHistoryList: unknown;
	shared: any;
	// from Shared service
	terrCode: any;
	historyList: any;
	gridListInAgreement: any;

	// to shared service
	approveAndRejectBtnDisable: boolean;


	constructor(private http: HttpService, @Inject(MAT_DIALOG_DATA) public data: any, shared: SharedService, private dataService: SharedService) {
		this.subscription = shared.subjHistoryValue$.subscribe(value => {
			this.historyList = value;
		})

		this.subscription = shared.subjGridInAgreement$.subscribe(value => {
			this.gridListInAgreement = value;
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
			this.lastElemHistoryList = this.historyList[this.historyListLength - 1];

			this.dataService.sendHistoryId(this.lastElemHistoryList)

			if (this.lastElemHistoryList.statusCode == '7') {
				this.http.getDataGridInAgreement(this.lastElemHistoryList.sliceId, this.lastElemHistoryList.id).subscribe((data) => {
					this.gridListInAgreement = data;
					this.gridListInAgreement.forEach(element => {
						if (element.territoryCode == this.injectValueToModal.terrCode) {
							console.log(true)
							console.log(element)
							if (element.approveName !== null) {
								console.log(true)
								this.approveAndRejectBtnDisable = true;
								this.dataService.approveAndRejectBtnStatus(this.approveAndRejectBtnDisable)
							}
						}
					});
				})
				this.showTableInAgreement = true;
			} else {
				this.showTimeline = true;
			}
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

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	onExpandEntry() {

	}

	toggleSide() {
		this.side = this.side === 'left' ? 'right' : 'left';
	}
}


