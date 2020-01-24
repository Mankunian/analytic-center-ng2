import { Component } from '@angular/core';
import {HttpService} from '../services/http.service'

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
		if (historyValue.statusCode == "7") {
			console.log('На согласовании')
			this.showTableInAgreement = true;
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
