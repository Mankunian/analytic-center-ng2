/* eslint-disable prettier/prettier */
import { Component, Inject } from "@angular/core";
import { HttpService } from "../services/http.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { SharedService } from "../services/shared.service";
import { ErrorHandlerService } from "../services/error-handler.service";

@Component({
	selector: "app-timeline",
	templateUrl: "./timeline.component.html",
	styleUrls: ["./timeline.component.scss"],
})
export class TimelineComponent {
	alternate = true;
	onFocusOpened = true;
	toggle = true;
	color = false;
	size = 30;
	expandEnabled = true;
	side = "left";
	sliceCreator: string;
	errorMsg: string;
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
	headerInfoObj: any;

	constructor(
		private http: HttpService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		shared: SharedService,
		private dataService: SharedService,
		public errorHandler: ErrorHandlerService
	) {
		this.subscription = shared.subjHistoryValue$.subscribe(value => {
			this.historyList = value;
		});

		this.subscription = shared.subjGridInAgreement$.subscribe(value => {
			this.gridListInAgreement = value;
		});
	}

	ngOnInit() {
		this.injectValueToModal = this.data;
		if (this.injectValueToModal.terrCode == "19000090") {
			this.GP = true;
		}
		this.http.getHistory(this.injectValueToModal.sliceId).subscribe(
			data => {
				this.historyList = data;
				this.historyListLength = this.historyList.length;
				this.lastElemHistoryList = this.historyList[this.historyListLength - 1];

				this.dataService.sendHistoryId(this.lastElemHistoryList);

				if (this.lastElemHistoryList.statusCode == "7") {
					this.headerInfoObj = {
						personName: this.lastElemHistoryList.personName,
						statusDate: this.lastElemHistoryList.statusDate,
					};

					this.dataService.sendHeaderInfo(this.headerInfoObj);

					this.http.getDataGridInAgreement(this.lastElemHistoryList.sliceId, this.lastElemHistoryList.id).subscribe(
						data => {
							this.gridListInAgreement = data;
							this.gridListInAgreement = [...this.gridListInAgreement]; //refresh the data
							this.dataService.sendGridInAgreement(this.gridListInAgreement);
							this.gridListInAgreement.forEach(element => {
								if (element.territoryCode == this.injectValueToModal.terrCode) {
									if (element.approveName !== null) {
										this.approveAndRejectBtnDisable = true;
										this.dataService.approveAndRejectBtnStatus(this.approveAndRejectBtnDisable);
									}
								}
							});
						},
						error => {
							this.errorHandler.alertError(error);
						}
					);
					this.showTableInAgreement = true;
					this.dataService.sendVisibleTableInAgreement(this.showTableInAgreement);
				} else {
					this.showTimeline = true;
				}
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}

	entries = [
		{
			header: "header",
			content: "content",
		},
	];

	onHeaderClick(historyValue, event) {
		if (historyValue.statusCode == "2") {
			this.historyList.forEach((element, index) => {
				if (element.id == historyValue.id) {
					console.log(index, element)
					if (index == 0) {
						//Предварительный
						this.sliceCreator = "Задачу выставил:";
						this.sliceDate = "Время перевода в предварительный:";
					} else {
						this.sliceCreator = "Сделал предварительным:";
						this.sliceDate = "Время перевода в предварительный:";
					}
				}
			});



		} else if (historyValue.statusCode == "1") {
			// Утвержден
			this.sliceCreator = "Срез утвердил:";
			this.sliceDate = "Время утверждения среза:";
		} else if (historyValue.statusCode == "7") {
			// На согласовании
			this.sliceCreator = "Срез отправил на согласование:";
			this.sliceDate = "Время отправки на согласование среза:";
			this.showTableInAgreement = true;
			this.dataService.sendVisibleTableInAgreement(this.showTableInAgreement);
			this.showTimeline = false;

			this.personName = historyValue.personName;
			this.statusDate = historyValue.statusDate;

			this.http.getDataGridInAgreement(historyValue.sliceId, historyValue.id).subscribe(
				data => {
					this.gridListInAgreement = data;
					this.dataService.sendGridInAgreement(this.gridListInAgreement);
				},
				error => {
					this.errorHandler.alertError(error);
				}
			);
		} else if (historyValue.statusCode == "3") {
			// Удален
			this.sliceCreator = "Срез удалил:";
			this.sliceDate = "Время удаления среза:";
		} else if (historyValue.statusCode == "5") {
			// сформирован с ошибкой
			this.sliceCreator = "Заказал срез:";
			this.errorMsg = "Сообщение об ошибке:";
		}

		if (!this.expandEnabled) {
			event.stopPropagation();
		}
	}

	backToTimeline() {
		this.showTimeline = true;
		this.showTableInAgreement = false;
		this.dataService.sendVisibleTableInAgreement(this.showTableInAgreement);
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	onExpandEntry(event, index) {
		console.log(event, index);
	}

	toggleSide() {
		this.side = this.side === "left" ? "right" : "left";
	}
}
