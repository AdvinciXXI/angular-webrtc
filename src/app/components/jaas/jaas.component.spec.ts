import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaasComponent } from './jaas.component';

describe('JaasComponent', () => {
  let component: JaasComponent;
  let fixture: ComponentFixture<JaasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JaasComponent]
    });
    fixture = TestBed.createComponent(JaasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
