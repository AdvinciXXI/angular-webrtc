import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) { }
  transform(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  urlSafe: SafeResourceUrl | undefined;
  qrCodeUrl = "https://localhost:4200/welcome";

  constructor(
    private router: Router,
    public sanitizer: DomSanitizer
  ) {

  }

  async ngOnInit() {
    let x: string | null = this.sanitizer.sanitize(SecurityContext.URL, 'http://localhost:4200/jitsi');

    this.urlSafe = this.transform((x ? x.toString() : ""));
  }

  transform(url: string): SafeResourceUrl {
    if (!url) {
      url = '';
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
