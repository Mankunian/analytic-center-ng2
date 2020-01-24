import { Component } from '@angular/core';
import {HttpService} from '../services/http.service'
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-slice-operations-modal',
  templateUrl: './slice-operations-modal.component.html',
  styleUrls: ['./slice-operations-modal.component.scss']
})
export class SliceOperationsModalComponent {

	constructor(public dialog: MatDialog, private http: HttpService) { }

	ngOnInit(){
			this.http.getHistory().subscribe((data) => {
				console.log(data)
			})
		
	}
	
	openDialog(){
		console.log('works')
		const dialogRef = this.dialog.open(SliceOperationsModalContentComponent);

		dialogRef.afterClosed().subscribe(result => {
			console.log(result)
		})
	}

	

  

}


@Component({
	selector: 'app-slice-operations-modal-content',
  templateUrl: './slice-operations-modal-content.component.html',
})

export class SliceOperationsModalContentComponent {

}