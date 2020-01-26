import { Component, Input } from '@angular/core';
import {HttpService} from '../services/http.service'


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

  constructor(private http: HttpService) { }

  ngOnInit() {
		console.log(this.inputDataGridInAgreement)
	
	}

}
