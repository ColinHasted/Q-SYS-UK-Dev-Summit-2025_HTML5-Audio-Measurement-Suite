import { TestBed } from '@angular/core/testing';

import { QrwcAngularService } from './qrwc-angular-service';
describe('QrwcAngularService', () => {
  let service: QrwcAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrwcAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
