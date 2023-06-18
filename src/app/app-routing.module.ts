import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebRtcComponent } from './components/web-rtc/web-rtc.component';
import { JaasComponent } from './components/jaas/jaas.component';
import { JitsiComponent } from './components/jitsi/jitsi.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: 'web-rtc', component: WebRtcComponent },
  { path: 'jaas', component: JaasComponent },
  { path: 'jitsi', component: JitsiComponent },
  { path: 'welcome', component: WelcomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
