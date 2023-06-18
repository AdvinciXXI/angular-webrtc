import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebRtcComponent } from './web-rtc.component';

describe('WebRtcComponent', () => {
  let component: WebRtcComponent;
  let fixture: ComponentFixture<WebRtcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebRtcComponent]
    });
    fixture = TestBed.createComponent(WebRtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
