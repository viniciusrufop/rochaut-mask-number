import { TestBed } from '@angular/core/testing';

import { RochautMaskNumberService } from './rochaut-mask-number.service';

describe('RochautMaskNumberService', () => {
  let service: RochautMaskNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RochautMaskNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
