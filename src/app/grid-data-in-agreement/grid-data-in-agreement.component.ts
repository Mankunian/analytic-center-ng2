import { Component, Input } from '@angular/core';
import {HttpService} from '../services/http.service'
import { MatDialog } from '@angular/material/dialog';



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

  constructor(private http: HttpService, public dialogRejectionReason: MatDialog) { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit() {}
	
	openRejectionReasonModal(rowEntity){
		console.log(rowEntity)
		
	}

}
