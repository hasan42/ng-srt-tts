import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxPopperModule } from 'ngx-popper';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WrapComponent } from './wrap/wrap.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SecondsToTimePipe } from './seconds-to-time.pipe';
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
  declarations: [
    AppComponent,
    WrapComponent,
    SecondsToTimePipe,
    DragDropDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgSelectModule,
    Ng5SliderModule,
    NgxPopperModule.forRoot({})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
