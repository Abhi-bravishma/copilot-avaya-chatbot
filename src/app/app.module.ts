import { NgModule, Pipe, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule,HttpClient } from '@angular/common/http';

import {BrowserAnimationsModule,NoopAnimationsModule} from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routing.module';


// const config: SocketIoConfig = { url: 'http://192.168.0.109:3000/', options: {} };
const config: SocketIoConfig = { url: 'https://connector.lab.bravishma.com/', options: {} };


// import 'adaptivecards/lib/adaptivecards.css';
// import 'adaptivecards-designer/dist/adaptivecards-designer.css';
// import 'adaptivecards-designer/dist/adaptivecards-defaulthost.css';

@NgModule({
  declarations: [AppComponent, ChatComponent],
  imports: [BrowserModule,NoopAnimationsModule,CommonModule,   SocketIoModule.forRoot(config),ReactiveFormsModule,FormsModule,HttpClientModule,BrowserAnimationsModule,AppRoutingModule],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
