/* eslint-disable prettier/prettier */
import { Component, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { DataAgreement } from '../grid-data-in-agreement/data'
import { ThrowStmt } from '@angular/compiler';



@Component({
	selector: 'app-grid-data-in-agreement',
	templateUrl: './grid-data-in-agreement.component.html',
	styleUrls: ['./grid-data-in-agreement.component.scss']
})
export class GridDataInAgreementComponent {
	dataAgreement: DataAgreement[];

	cols: any[];

	@Input() inputTimeline: boolean;
	@Input() inputTableInAgreement: boolean;
	terrCode: string;
	personName: string;
	statusDate: string;
	subscription: Subscription;
	showTable: boolean;


	constructor(public dialogRejectionReason: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, shared: SharedService) {
		this.subscription = shared.subjGridInAgreement$.subscribe(value => {
			this.inputTableInAgreement = true;
			this.getGridDataInAgreement(value)

			this.cols = [
				{ field: 'territoryName', header: 'Терр.управление' },
				{ field: 'approveData', header: 'Дата-время' },
				{ field: 'approveName', header: 'Статус' },
				{ field: 'personName', header: 'ФИО' }
			];
		})


		this.subscription = shared.subjGridAgreementHeaderInfo$.subscribe(value => {
			this.getHeaderInfoObj(value)
		})

		this.subscription = shared.subjGridAgreementVisibleStatus$.subscribe(value => {
			this.getVisibleTableStatus(value)
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {
	}

	getHeaderInfoObj(value) {
		this.personName = value.personName;
		this.statusDate = value.statusDate;
	}

	getVisibleTableStatus(status) {
		this.showTable = status;
		console.log(this.showTable)
	}

	getGridDataInAgreement(value) {
		this.dataAgreement = value;
	}

	openRejectionReasonModal(rowEntity) {
		this.terrCode = this.data.terrCode;

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const dialogRef = this.dialogRejectionReason.open(RejectionReasonContentComponent, {
			width: '500px',
			data: { msgReason: rowEntity.msg, terrCode: this.terrCode }
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(result)
		})
	}
}

@Component({
	selector: 'app-rejection-reason-content',
	templateUrl: './rejection-reason-content.component.html'
})

export class RejectionReasonContentComponent {
	injectValueToModal: any;
	subscription: Subscription;
	headTerritory: boolean;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, shared: SharedService) {
		this.subscription = shared.subjHistoryValue$.subscribe(val => {
			console.log(val)
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {
		this.injectValueToModal = this.data;
		console.log(this.injectValueToModal)
		if (this.injectValueToModal.terrCode == '19000090') {
			this.headTerritory = true;
		}
	}
}