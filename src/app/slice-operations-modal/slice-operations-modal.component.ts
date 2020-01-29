import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-slice-operations-modal',
  templateUrl: './slice-operations-modal.component.html',
  styleUrls: ['./slice-operations-modal.component.scss']
})
export class SliceOperationsModalComponent {
	constructor(){
	}

	
}

@Component({
	selector: 'app-slice-operations-modal-content',
  templateUrl: './slice-operations-modal-content.component.html',
})

export class SliceOperationsModalContentComponent {
	injectValueToModal: any;
	headTerritory: boolean;
	btnInAgreement: boolean;
	btnDecided: boolean;
	btnToAgreement: boolean;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
	
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	ngOnInit(){
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
}




