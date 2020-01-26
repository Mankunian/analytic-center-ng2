import {Component} from '@angular/core';
import {HttpService} from '../services/http.service'
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-slice-operations-modal',
  templateUrl: './slice-operations-modal.component.html',
  styleUrls: ['./slice-operations-modal.component.scss']
})
export class SliceOperationsModalComponent {

	display: boolean;

  showDialog(row) {
    console.log(row);
    console.log('showDialog in sliceCTRL', row);
    this.display = true;
  }

  onDialogClose(event) {
    this.display = event;
  }
  
}