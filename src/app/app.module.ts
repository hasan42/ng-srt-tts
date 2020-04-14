import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WrapComponent } from './wrap/wrap.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SecondsToTimePipe } from './seconds-to-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WrapComponent,
    SecondsToTimePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
