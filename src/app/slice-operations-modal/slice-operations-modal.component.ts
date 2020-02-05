import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpService } from "../services/http.service";
import { TimelineComponent } from "../../app/timeline/timeline.component";
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { SaveEditReasonObj } from "../saveEditReasonObj";



@Component({
	selector: 'app-slice-operations-modal',
	templateUrl: './slice-operations-modal.component.html',
	styleUrls: ['./slice-operations-modal.component.scss']
})
export class SliceOperationsModalComponent {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() {
	}


}

@Component({
	selector: 'app-slice-operations-modal-content',
	templateUrl: './slice-operations-modal-content.component.html',
	providers: [TimelineComponent]
})

export class SliceOperationsModalContentComponent {
	injectValueToModal: any;
	headTerritory: boolean;
	btnInAgreement: boolean;
	btnDecided: boolean;
	btnToAgreement: boolean;
	showTableInAgreement: boolean;
	subscription: Subscription;
	historyValue: any;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpService, private service: SharedService, public dialogRef: MatDialogRef<SliceOperationsModalContentComponent>, public dialogEditRejection: MatDialog) {
		this.subscription = service.subjHistoryId$.subscribe(value => {
			console.log(value)
			this.historyValue = value;
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {
		this.injectValueToModal = this.data;
		console.log(this.injectValueToModal)
		if (this.injectValueToModal.statusCode == '7') {
			this.btnInAgreement = true;
			this.showTableInAgreement = true;
			this.service.showTableAgreement(this.showTableInAgreement)
		}
		if (this.injectValueToModal.statusCode == '1') {
			this.btnDecided = true;
		}
		if (this.injectValueToModal.statusCode == '2') {
			this.btnToAgreement = true;
		}
		if (this.injectValueToModal.terrCode == '19000090') {
			this.headTerritory = true;
		}
	}

	confirmSlice() {
		this.http.confirmSliceService(this.injectValueToModal.sliceId).subscribe((data) => {
			alert('Операция прошла успешна')
			this.http.getHistory(this.injectValueToModal.sliceId).subscribe((historyValue) => {
				this.service.sendHistoryList(historyValue)
			})
			this.btnDecided = true;
			this.btnToAgreement = false;
			this.btnInAgreement = false;
		})
	}

	deleteSlice() {
		this.http.deleteSliceService(this.injectValueToModal.sliceId).subscribe((data) => {
			alert('Операция прошла успешна')
		})
	}

	sendToPreliminary() {
		this.http.sendToPreliminaryService(this.injectValueToModal.sliceId).subscribe((data) => {
			alert('Операция прошла успешна')
			this.http.getHistory(this.injectValueToModal.sliceId).subscribe((historyValue) => {
				console.log(historyValue)
				this.service.sendHistoryList(historyValue)
			})
			this.btnToAgreement = true;
			this.btnDecided = false;
			this.btnInAgreement = false;
		})
	}
	sendToAgreement() {
		this.http.sendToAgreementService(this.injectValueToModal.sliceId).subscribe((data) => {
			alert('Операция прошла успешна')
			this.http.getHistory(this.injectValueToModal.sliceId).subscribe((historyValue) => {
				this.service.sendHistoryList(historyValue)
			})
			this.btnInAgreement = true;
			this.btnToAgreement = false;
			this.btnDecided = false;
		})
	}

	rejectInAgreement() {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const dialogRef = this.dialogEditRejection.open(EditReasonComponent, {
			width: '500px',
			data: [this.injectValueToModal, this.historyValue]
		})

		dialogRef.afterClosed().subscribe(result => {
			console.log('modal closed')
		})
	}

	closeDialog(): void {
		this.dialogRef.close();
	}
}






@Component({
	selector: 'app-edit-reason',
	templateUrl: './edit-reason.component.html'
})

export class EditReasonComponent implements OnInit {
	objOfRejectionReason: any;
	reason: string;
	sliceId: any;
	historyId: any;
	gridInAgreement: any;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpService, private shared: SharedService) { }

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {
		this.objOfRejectionReason = this.data; // rowEntity slice from table
	}



	saveEditReason(reason) {

		let SaveEditReasonObj = {
			historyId: this.objOfRejectionReason[1].id,
			approveCode: 2,
			territoryCode: this.objOfRejectionReason[0].terrCode,
			msg: reason
		}


		console.log(SaveEditReasonObj)


		this.sliceId = this.objOfRejectionReason[1].sliceId
		this.historyId = this.objOfRejectionReason[1].id

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.http.putEditRejectedReasonService(this.sliceId, SaveEditReasonObj).subscribe((data: SaveEditReasonObj) => {
			// update ui-grid-in-agreement
			this.http.getDataGridInAgreement(this.sliceId, this.historyId).subscribe((data) => {
				console.log(data)
				this.gridInAgreement = data;
				this.shared.sendGridInAgreement(this.gridInAgreement)
			})
		})
	}
}




