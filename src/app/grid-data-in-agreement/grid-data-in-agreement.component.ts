import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-data-in-agreement',
  templateUrl: './grid-data-in-agreement.component.html',
  styleUrls: ['./grid-data-in-agreement.component.scss']
})
export class GridDataInAgreementComponent {

	@Input() inputTimeline:boolean;
	@Input() inputTableInAgreement: boolean;

  constructor() { }

  ngOnInit() {
  }

}
