import { Component } from '@angular/core';
import {HttpService} from '../services/http.service'
import { ThrowStmt } from '@angular/compiler';

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
	historyList: any;
	showTableInAgreement: boolean;
	sliceCreator: string;
	sliceDate: string;
	


	constructor(private http: HttpService){}

	ngOnInit(){
		this.http.getHistory().subscribe((data) => {
			console.log(data)
			this.historyList = data;
		})
	}

  entries = [
    {
      header: 'header',
      content: 'content'
    }
  ]

  addEntry() {
    this.entries.push({
      header: 'header',
      content: 'content'
    })
  }

  removeEntry() {
    this.entries.pop();
  }

  onHeaderClick(historyValue) {
		console.log(historyValue)
		if (historyValue.statusCode == "2") {
			console.log('Предварительный')
			this.sliceCreator = 'Задачу выставил:'
			this.sliceDate = 'Время начала формирования:'
			// this.showTableInAgreement = true;
		} else if(historyValue.statusCode == "1"){
			this.sliceCreator = 'Срез утвердил:';
			this.sliceDate = 'Время утверждения среза:'
		} else if (historyValue.statusCode == "7"){
			this.sliceCreator = 'Срез отправил на согласование:'
			this.sliceDate = 'Время отправки на согласование среза:'
		}

    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onDotClick(event) {
		console.log(event)
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onExpandEntry(expanded, index) {
    // console.log(`Expand status of entry #${index} changed to ${expanded}`)
  }

  toggleSide() {
    this.side = this.side === 'left' ? 'right' : 'left';
  }
}
