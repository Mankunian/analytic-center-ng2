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

	showTableInAgreement: boolean;
	subscription: Subscription;
	gridInAgreement: any;
	approved: boolean;
	// from shared service
	historyValue: any;
	disableBtn: any;
	preloader: boolean;

	showDeleteBtn: boolean; // Удалить срез
	showSendIntoPreliminaryBtn: boolean; // Перевести в предварительный
	showApproveBtn: boolean; // Согласовать
	showOnApprovalBtn: boolean; // На согласовании
	showDeleteBtnFromError: boolean; // Удалить (сформирован с ошибкой)
	enableDeleteSliceBtn: any;
	enableConfirmSliceBtn: any;
	enableApproveSliceBtn: any;
	matchTerrCode: boolean;
	allowedOrgId: boolean;

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
		this.getTerritory()
		this.enableDeleteSliceBtn = this.data.permissionDelete

		this.enableConfirmSliceBtn = this.data.permissionConfirm

		this.enableApproveSliceBtn = this.data.permissionApprove

		this.injectValueToModal = this.data;
		let statusCode = this.injectValueToModal.statusCode
		let terrCode = this.injectValueToModal.terrCode;

		// Статус Сформирован с ошибкой
		if (statusCode == this.STATUS_CODES.FORMED_WITH_ERROR) {
			this.showDeleteBtnFromError = true;
		}

		// Статус Окончательный
		if (statusCode == this.STATUS_CODES.APPROVED) {
			// this.btnDecided = true;
			this.showSendIntoPreliminaryBtn = true;
		}

		// Статус на согласовании
		if (statusCode == this.STATUS_CODES.IN_AGREEMENT) {
			// this.btnInAgreement = true;
			this.showDeleteBtn = true;
			this.showApproveBtn = true;
			this.showTableInAgreement = true;
			this.service.showTableAgreement(this.showTableInAgreement);
		}
		// Статус предварительный
		if (statusCode == this.STATUS_CODES.PRELIMINARY) {
			// this.btnToAgreement = true
			this.showOnApprovalBtn = true;
		}
		if (terrCode.startsWith('1900')) {
			this.headTerritory = true;
		}
	}

	getTerritory() {
		this.http.getTerritories().subscribe((data: any) => {
			let terrCode = this.injectValueToModal.terrCode
			data.forEach(element => {
				if (terrCode == element.code) {
					this.allowedOrgId = true;
				}
			});
		}, error => {
			this.errorHandler.alertError(error);
		});
	}

	//Утвердить срез
	confirmSlice() {
		this.http.confirmSliceService(this.injectValueToModal.sliceId).subscribe(() => {
			alert("Операция прошла успешна");
			this.http.getHistory(this.injectValueToModal.sliceId).subscribe(historyValue => {
				this.service.sendHistoryList(historyValue);
			}, error => {
				this.errorHandler.alertError(error);
			});
			this.showSendIntoPreliminaryBtn = true;
			this.showOnApprovalBtn = false;
			this.showApproveBtn = false;
			this.showDeleteBtn = false;
		}, error => {
			this.errorHandler.alertError(error);
		}
		);
	}
	// Удалить срез
	deleteSlice() {
		this.http.deleteSliceService(this.injectValueToModal.sliceId).subscribe(() => {
			alert("Операция прошла успешна");
			this.http.getHistory(this.injectValueToModal.sliceId).subscribe(historyValue => {
				this.service.sendHistoryList(historyValue);
			}, error => {
				this.errorHandler.alertError(error);
			});
			this.showSendIntoPreliminaryBtn = false;
			this.showOnApprovalBtn = false;
			this.showApproveBtn = false;
			this.showDeleteBtn = false;
		},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}
	//Перевести в предварительный
	sendToPreliminary() {
		this.http.sendToPreliminaryService(this.injectValueToModal.sliceId).subscribe(data => {
			alert("Операция прошла успешна");
			this.http.getHistory(this.injectValueToModal.sliceId).subscribe(historyValue => {
				this.service.sendHistoryList(historyValue);
			}, error => {
				this.errorHandler.alertError(error);
			}
			);
			this.showOnApprovalBtn = true;
			this.showSendIntoPreliminaryBtn = false;
			this.showDeleteBtn = false;
			this.showApproveBtn = false;
		},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}
	// Отправить на согласование
	sendToAgreement() {
		this.http.sendToAgreementService(this.injectValueToModal.sliceId).subscribe(() => {
			alert("Операция прошла успешна");
			this.http.getHistory(this.injectValueToModal.sliceId).subscribe(
				historyValue => {
					this.service.sendHistoryList(historyValue);
				},
				error => {
					this.errorHandler.alertError(error);
				}
			);
			this.showOnApprovalBtn = false;
			this.showSendIntoPreliminaryBtn = false;
			this.showDeleteBtn = true;
			this.showApproveBtn = true;
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
			data: [this.injectValueToModal, this.historyValue, this.allowedOrgId],
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

	//Согласовать срез
	approveSlice() {
		if (this.allowedOrgId) {
			let approveSliceObj = {
				historyId: this.historyValue.id,
				approveCode: 1,
				territoryCode: this.injectValueToModal.terrCode,
				msg: "",
			};
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			this.http.approveSliceService(this.historyValue.sliceId, approveSliceObj).subscribe(
				() => {
					this.getDataGridInAgreement()
				},
				error => {
					this.errorHandler.alertError(error);
				});
		} else {
			alert('Запрещена операция для данного региона')
		}
	}



	getDataGridInAgreement() {
		this.http.getDataGridInAgreement(this.historyValue.sliceId, this.historyValue.id).subscribe(data => {
			this.gridInAgreement = data;
			this.service.sendGridInAgreement(this.gridInAgreement);
			alert("Операция прошла успешно");
			this.approved = true;
			this.service.approveAndRejectBtnStatus(this.approved);
		},
			error => {
				this.errorHandler.alertError(error);
			});
	}

	closeDialog(): void {
		this.dialogRef.close();
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
		let allowedOrgId = this.objOfRejectionReason[2]
		if (allowedOrgId) {
			let SaveEditReasonObj = {
				historyId: this.objOfRejectionReason[1].id,
				approveCode: 2,
				territoryCode: this.objOfRejectionReason[0].terrCode,
				msg: reason,
			};
			this.sliceId = this.objOfRejectionReason[1].sliceId;
			this.historyId = this.objOfRejectionReason[1].id;

			// eslint - disable - next - line @typescript-eslint / no - unused - vars
			this.http.rejectSliceService(this.sliceId, SaveEditReasonObj).subscribe(() => {
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
				});
		} else {
			alert('Запрещена операция для данного региона')
		}
	}

}
