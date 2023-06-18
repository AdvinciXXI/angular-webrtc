import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebRtcComponent } from './components/web-rtc/web-rtc.component';
import { JaasComponent } from './components/jaas/jaas.component';
import { JitsiComponent } from './components/jitsi/jitsi.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    WebRtcComponent,
    JaasComponent,
    JitsiComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
