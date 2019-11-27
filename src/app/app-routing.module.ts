import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WrapComponent } from './wrap/wrap.component';

const routes: Routes = [
	{ path: '**', component: WrapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
