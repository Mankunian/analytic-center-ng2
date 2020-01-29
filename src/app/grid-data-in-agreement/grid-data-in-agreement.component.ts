import { Component, Input, Inject } from '@angular/core';
import {HttpService} from '../services/http.service'
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';




@Component({
  selector: 'app-grid-data-in-agreement',
  templateUrl: './grid-data-in-agreement.component.html',
  styleUrls: ['./grid-data-in-agreement.component.scss']
})
export class GridDataInAgreementComponent {

	gridTitle = ['Терр.управление', 'Дата-время', 'Статус', 'Фио']
	
	@Input() inputTimeline:boolean;
	@Input() inputTableInAgreement: boolean;
	@Input() inputDataGridInAgreement: any = [];
	@Input() inputPersonName: string;
	@Input() inputStatusDate: string;

  constructor(private http: HttpService, public dialogRejectionReason: MatDialog) { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {}
	
	openRejectionReasonModal(rowEntity){
		console.log(rowEntity);
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const dialogRef = this.dialogRejectionReason.open(RejectionReasonContentComponent,{
			width: '500px',
			data: {msgReason: rowEntity.msg}
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log('modal closed')
		})		
	}

}

@Component({
	selector: 'app-rejection-reason-content',
	templateUrl: './rejection-reason-content.component.html'
})

export class RejectionReasonContentComponent {
	injectValueToModal: any;
	constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit(){
		this.injectValueToModal = this.data;
		console.log(this.injectValueToModal)
	}
}