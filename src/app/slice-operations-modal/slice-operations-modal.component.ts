import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HttpService } from "../services/http.service";
import { TimelineComponent } from "../../app/timeline/timeline.component";
import { Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';
// import { SaveEditReasonObj } from "../saveEditReasonObj";



@Component({
	selector: 'app-slice-operations-modal',
	templateUrl: './slice-operations-modal.component.html',
	styleUrls: ['./slice-operations-modal.component.scss']
})
export class SliceOperationsModalComponent {
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

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpService, private service: SharedService, public dialogRef: MatDialogRef<SliceOperationsModalContentComponent>, public dialogEditRejection: MatDialog) { }

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
		console.log('open dialog to reject')
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const dialogRef = this.dialogEditRejection.open(EditReasonComponent, {
			width: '500px',
			data: this.injectValueToModal
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
	templateUrl: './edit-reason.component.html',
	providers: [SharedService, TimelineComponent]
})

export class EditReasonComponent implements OnInit {
	injectValueToDialogEditReason: any;
	reason: string;
	message: any;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dataService: SharedService) {

	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {
		this.injectValueToDialogEditReason = this.data; // rowEntity slice from table
	}



	saveEditReason(reason) {

		// let SaveEditReasonObj = {
		// 	historyId: this.lastHistoryId,
		// 	approveCode: 2,
		// 	territoryCode: this.injectValueToDialogEditReason.terrCode,
		// 	msg: reason,
		// };
		// console.log(SaveEditReasonObj)
		// this.http.rejectInAgreementService(this.injectValueToDialogEditReason.sliceId, SaveRejectReason).subscribe((data: SaveRejectReason) => {
		// 	console.log(data)
		// 	console.log(SaveRejectReason)
		// })
	}

}




