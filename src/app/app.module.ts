import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {MatTabsModule} from '@angular/material/tabs';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
import {MatButtonModule} from '@angular/material/button';







@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TabMenuComponent
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
		MatButtonModule
	],
	exports: [
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
