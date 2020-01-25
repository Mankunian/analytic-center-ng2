import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import { TreeTableComponent } from './tree-table/tree-table.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// MaterialDesign library
import { MatInputModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule  } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';

import { MglTimelineModule } from 'angular-mgl-timeline';
import {MatToolbarModule} from '@angular/material';


// PrimeNG library
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
// Services
import { HttpService } from "./services/http.service";
// Data table
import {TreeTableModule} from 'primeng/treetable';
import { SliceOperationsModalComponent } from './slice-operations-modal/slice-operations-modal.component';
import { SliceOperationsModalContentComponent } from './slice-operations-modal/slice-operations-modal.component';
import { TimelineComponent } from './timeline/timeline.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TabMenuComponent,
    TreeTableComponent,
		SliceOperationsModalComponent,
		SliceOperationsModalContentComponent,
		TimelineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    AccordionModule,
    CheckboxModule,
    ButtonModule,
    CalendarModule,
    HttpClientModule,
		TreeTableModule,
		MatSelectModule,
		MatDialogModule,
		MglTimelineModule,
		MatToolbarModule
  ],
  exports: [
    MatInputModule
  ],
  providers: [HttpService],
	bootstrap: [AppComponent],
	entryComponents: [SliceOperationsModalComponent, SliceOperationsModalContentComponent]
})
export class AppModule { }
