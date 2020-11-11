import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { TabMenuComponent } from "./tab-menu/tab-menu.component";
import { TreeTableComponent } from "./tree-table/tree-table.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// MaterialDesign library
import { MatInputModule } from "@angular/material";
import { MatNativeDateModule } from "@angular/material";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { MglTimelineModule } from "angular-mgl-timeline";
import { MatToolbarModule } from "@angular/material";

// PrimeNG library
import { AccordionModule } from "primeng/accordion";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";

// import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from "primeng/progressbar";

// Services
import { HttpService } from "./services/http.service";
import { SharedService } from "./services/shared.service";

// Data table
import { TreeTableModule } from "primeng/treetable";
import {
	SliceOperationsModalComponent,
	EditReasonComponent,
} from "./slice-operations-modal/slice-operations-modal.component";
import { SliceOperationsModalContentComponent } from "./slice-operations-modal/slice-operations-modal.component";
// import { ReportsModalComponent } from "./reports-modal/reports-modal.component";
import { ReportsModalContentComponent } from "./reports-modal/reports-modal.component";
import { TimelineComponent } from "./timeline/timeline.component";
import { GridDataInAgreementComponent } from "./grid-data-in-agreement/grid-data-in-agreement.component";
import { RejectionReasonContentComponent } from "src/app/grid-data-in-agreement/grid-data-in-agreement.component";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { TruncatePipe } from "./pipes/truncate.pipe";

import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from "@stomp/ng2-stompjs";
import { rxStompConfig } from "./rx-stomp.config";
import { MessagesComponent } from "./messages/messages.component";
import { SocketStatusComponent } from "./socket-status/socket-status.component";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

export function HttpLoaderFactory(httpClient: HttpClient) {
	return new TranslateHttpLoader(httpClient);
}

@NgModule({
	declarations: [
		AppComponent,
		NavBarComponent,
		TabMenuComponent,
		TreeTableComponent,
		SliceOperationsModalComponent,
		SliceOperationsModalContentComponent,
		// ReportsModalComponent,
		ReportsModalContentComponent,
		TimelineComponent,
		GridDataInAgreementComponent,
		RejectionReasonContentComponent,
		EditReasonComponent,
		TruncatePipe,
		MessagesComponent,
		SocketStatusComponent,
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
		MatToolbarModule,
		DialogModule,
		ProgressBarModule,
		ToastModule,
		ProgressBarModule,
		ProgressSpinnerModule,
		TableModule,
		MatProgressSpinnerModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),
	],
	exports: [MatInputModule],
	providers: [
		HttpService,
		SharedService,
		TimelineComponent,
		TreeTableComponent,
		// ReportsModalComponent,
		SliceOperationsModalComponent,
		TabMenuComponent,
		NavBarComponent,
		MessageService,
		{ provide: InjectableRxStompConfig, useValue: rxStompConfig },
		{ provide: RxStompService, useFactory: rxStompServiceFactory, deps: [InjectableRxStompConfig] },
	],
	bootstrap: [AppComponent],
	entryComponents: [
		SliceOperationsModalContentComponent,
		ReportsModalContentComponent,
		RejectionReasonContentComponent,
		EditReasonComponent,
		TabMenuComponent
	],
})
export class AppModule { }
