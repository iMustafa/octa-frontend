import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animation } from '@angular/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';

import { ROUTES } from './app.router';
import { CookiesService } from './modules/globals/services/cookies.service';
import { HttpService } from './modules/globals/services/http.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    CookiesService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
