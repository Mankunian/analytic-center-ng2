import { Component, Inject } from '@angular/core';
import {HttpService} from '../services/http.service'
import { ThrowStmt } from '@angular/compiler';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent  {
  alternate = true;
  toggle = true;
  color = false;
  size = 30;
  expandEnabled = true;
	side = 'left';
	sliceCreator: string;
	sliceDate: string;
	showTableInAgreement: boolean;
	showTimeline: boolean;
	gridListInAgreement: any;
	historyList: any;
	injectSliceId: any;



	constructor(private http: HttpService, @Inject(MAT_DIALOG_DATA) public data: any){}

	ngOnInit(){
		this.injectSliceId = this.data;
		this.http.getHistory(this.injectSliceId.sliceId).subscribe((data) => {
			console.log(data)
			this.historyList = data;
			this.showTimeline = true;
		})
	}

  entries = [
    {
      header: 'header',
      content: 'content'
    }
  ]

  onHeaderClick(historyValue) {
		console.log(historyValue)
		if (historyValue.statusCode == "2") {
			console.log('Предварительный')
			this.sliceCreator = 'Задачу выставил:'
			this.sliceDate = 'Время начала формирования:'
		} else if(historyValue.statusCode == "1"){
			this.sliceCreator = 'Срез утвердил:';
			this.sliceDate = 'Время утверждения среза:'
		} else if (historyValue.statusCode == "7"){
			this.sliceCreator = 'Срез отправил на согласование:'
			this.sliceDate = 'Время отправки на согласование среза:'
			this.showTableInAgreement = true;
			this.showTimeline = false

			this.http.getDataGridInAgreement().subscribe((data)=>{
				console.log(data)
				this.gridListInAgreement = data;
			})
			
		}

    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

	backToTimeline(){
		this.showTimeline = true;
		this.showTableInAgreement = false;
	}
  onDotClick(historyValue) {
		console.log(historyValue)
		if (historyValue.statusCode == "2") {
			console.log('Предварительный')
			this.sliceCreator = 'Задачу выставил:'
			this.sliceDate = 'Время начала формирования:'
		} else if(historyValue.statusCode == "1"){
			this.sliceCreator = 'Срез утвердил:';
			this.sliceDate = 'Время утверждения среза:'
		} else if (historyValue.statusCode == "7"){
			this.sliceCreator = 'Срез отправил на согласование:'
			this.sliceDate = 'Время отправки на согласование среза:'
			this.showTableInAgreement = true;
			this.showTimeline = false
			this.http.getDataGridInAgreement().subscribe((data)=>{
				console.log(data)
				this.gridListInAgreement = data;
			})
			
		}
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onExpandEntry(historyValue) {
		if (historyValue.statusCode == "2") {
			console.log('Предварительный')
			this.sliceCreator = 'Задачу выставил:'
			this.sliceDate = 'Время начала формирования:'
		} else if(historyValue.statusCode == "1"){
			this.sliceCreator = 'Срез утвердил:';
			this.sliceDate = 'Время утверждения среза:'
		} else if (historyValue.statusCode == "7"){
			this.sliceCreator = 'Срез отправил на согласование:'
			this.sliceDate = 'Время отправки на согласование среза:'
			this.showTableInAgreement = true;
			this.showTimeline = false

			this.http.getDataGridInAgreement().subscribe((data)=>{
				console.log(data)
				this.gridListInAgreement = data;
			})
	}


}

  toggleSide() {
    this.side = this.side === 'left' ? 'right' : 'left';
  }
}
