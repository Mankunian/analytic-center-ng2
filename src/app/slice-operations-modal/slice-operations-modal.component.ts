import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from "../services/http.service";
import { TimelineComponent } from "../../app/timeline/timeline.component";
import { SharedService } from '../services/shared.service';

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

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpService, private service: SharedService, public dialogRef: MatDialogRef<SliceOperationsModalContentComponent>) { }

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {
		this.injectValueToModal = this.data;
		console.log(this.injectValueToModal)
		if (this.injectValueToModal.statusCode == '7') {
			this.btnInAgreement = true;
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
	closeDialog(): void {
		this.dialogRef.close();
	}
}




