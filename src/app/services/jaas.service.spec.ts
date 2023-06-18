import { TestBed } from '@angular/core/testing';

import { JaasService } from './jaas.service';

describe('JaasService', () => {
  let service: JaasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JaasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
