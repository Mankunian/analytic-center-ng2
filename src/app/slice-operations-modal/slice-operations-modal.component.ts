import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { HttpService } from "../services/http.service";
import { TimelineComponent } from "../../app/timeline/timeline.component";
import { Subscription } from "rxjs";
import { SharedService } from "../services/shared.service";
import { SaveEditReasonObj } from "../saveEditReasonObj";
import { ErrorHandlerService } from "../services/error-handler.service";
import { GlobalConfig } from "../global";

@Component({
	selector: "app-slice-operations-modal",
	templateUrl: "./slice-operations-modal.component.html",
	styleUrls: ["./slice-operations-modal.component.scss"],
})
export class SliceOperationsModalComponent {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() { }
}

@Component({
	selector: "app-slice-operations-modal-content",
	templateUrl: "./slice-operations-modal-content.component.html",
	styleUrls: ["./slice-operations-modal-content.component.scss"],
	encapsulation: ViewEncapsulation.None,
	providers: [TimelineComponent],
})

export class SliceOperationsModalContentComponent {
	public STATUS_CODES = GlobalConfig.STATUS_CODES;
	injectValueToModal: any;
	headTerritory: boolean;
	btnInAgreement: boolean;
	btnDecided: boolean;
	btnToAgreement: boolean;
	btnDelete: boolean;
	showTableInAgreement: boolean;
	subscription: Subscription;
	gridInAgreement: any;
	approved: boolean;
	// from shared service
	historyValue: any;
	disableBtn: any;
	preloader: boolean;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpService,
		private service: SharedService,
		public dialogRef: MatDialogRef<SliceOperationsModalContentComponent>,
		public dialogEditRejection: MatDialog,
		public errorHandler: ErrorHandlerService
	) {
		this.subscription = service.subjHistoryId$.subscribe(value => {
			this.historyValue = value;
		});
		this.subscription = service.subjBtnStatus$.subscribe(value => {
			this.disableBtn = value;
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {
		this.injectValueToModal = this.data;
		// Статус на согласовании
		if (this.injectValueToModal.statusCode == this.STATUS_CODES.IN_AGREEMENT) {
			this.btnInAgreement = true;
			this.showTableInAgreement = true;
			this.service.showTableAgreement(this.showTableInAgreement);
		}
		// Статус Утверждено
		if (this.injectValueToModal.statusCode == this.STATUS_CODES.APPROVED) {
			this.btnDecided = true;
		}
		// Статус предварительный
		if (this.injectValueToModal.statusCode == this.STATUS_CODES.PRELIMINARY) {
			this.btnToAgreement = true;
		}
		// Статус Сформирован с ошибкой
		if (this.injectValueToModal.statusCode == this.STATUS_CODES.FORMED_WITH_ERROR) {
			this.btnDelete = true;
		}
		if (this.injectValueToModal.terrCode == "19000090") {
			this.headTerritory = true;
		}
	}

	//Утвердить срез
	confirmSlice() {
		this.http.confirmSliceService(this.injectValueToModal.sliceId).subscribe(
			data => {
				alert("Операция прошла успешна");
				this.http.getHistory(this.injectValueToModal.sliceId).subscribe(
					historyValue => {
						this.service.sendHistoryList(historyValue);
					},
					error => {
						this.errorHandler.alertError(error);
					}
				);
				this.btnDecided = true;
				this.btnToAgreement = false;
				this.btnInAgreement = false;
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}
	// Удалить срез
	deleteSlice() {
		this.http.deleteSliceService(this.injectValueToModal.sliceId).subscribe(
			data => {
				alert("Операция прошла успешна");
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}
	//Перевести в предварительный
	sendToPreliminary() {
		this.http.sendToPreliminaryService(this.injectValueToModal.sliceId).subscribe(
			data => {
				alert("Операция прошла успешна");
				this.http.getHistory(this.injectValueToModal.sliceId).subscribe(
					historyValue => {
						this.service.sendHistoryList(historyValue);
					},
					error => {
						this.errorHandler.alertError(error);
					}
				);
				this.btnToAgreement = true;
				this.btnDecided = false;
				this.btnInAgreement = false;
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}
	// Отправить на согласование
	sendToAgreement() {
		this.http.sendToAgreementService(this.injectValueToModal.sliceId).subscribe(
			data => {
				alert("Операция прошла успешна");
				this.http.getHistory(this.injectValueToModal.sliceId).subscribe(
					historyValue => {
						this.service.sendHistoryList(historyValue);
					},
					error => {
						this.errorHandler.alertError(error);
					}
				);
				this.btnInAgreement = true;
				this.btnToAgreement = false;
				this.btnDecided = false;
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}
	//Отказать в согласовании
	rejectInAgreement() {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const dialogRef = this.dialogEditRejection.open(EditReasonComponent, {
			width: "500px",
			data: [this.injectValueToModal, this.historyValue],
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(result)
		});
	}

	closeDialog(): void {
		this.dialogRef.close();
	}
	//Согласовать срез
	approveSlice() {
		let approveSliceObj = {
			historyId: this.historyValue.id,
			approveCode: 1,
			territoryCode: this.injectValueToModal.terrCode,
			msg: "",
		};
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.http.approveSliceService(this.historyValue.sliceId, approveSliceObj).subscribe(
			() => {
				// update ui-grid-in-agreement
				this.http.getDataGridInAgreement(this.historyValue.sliceId, this.historyValue.id).subscribe(
					data => {
						this.gridInAgreement = data;
						this.service.sendGridInAgreement(this.gridInAgreement);
						alert("Операция прошла успешно");
						this.approved = true;
						this.service.approveAndRejectBtnStatus(this.approved);
					},
					error => {
						this.errorHandler.alertError(error);
					}
				);
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}

}

@Component({
	selector: "app-edit-reason",
	templateUrl: "./edit-reason.component.html",
})
export class EditReasonComponent implements OnInit {
	objOfRejectionReason: any;
	reason: string;
	sliceId: any;
	historyId: any;
	gridInAgreement: any;
	rejected: boolean;


	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private http: HttpService,
		private service: SharedService,
		public errorHandler: ErrorHandlerService,
		public dialogEditRejection: MatDialogRef<EditReasonComponent>,
	) { }

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {
		this.objOfRejectionReason = this.data; // rowEntity slice from table
	}

	saveEditReason(reason) {
		let SaveEditReasonObj = {
			historyId: this.objOfRejectionReason[1].id,
			approveCode: 2,
			territoryCode: this.objOfRejectionReason[0].terrCode,
			msg: reason,
		};
		this.sliceId = this.objOfRejectionReason[1].sliceId;
		this.historyId = this.objOfRejectionReason[1].id;



		// eslint - disable - next - line @typescript-eslint / no - unused - vars
		this.http.rejectSliceService(this.sliceId, SaveEditReasonObj).subscribe(
			() => {
				this.http.getDataGridInAgreement(this.sliceId, this.historyId).subscribe(
					data => {
						this.gridInAgreement = data;
						this.service.sendGridInAgreement(this.gridInAgreement);
						this.rejected = true;
						this.service.approveAndRejectBtnStatus(this.rejected);
						alert('Операция прошла успешна');
						this.dialogEditRejection.close()
					},
					error => {
						this.errorHandler.alertError(error);
					}
				);
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}

}
