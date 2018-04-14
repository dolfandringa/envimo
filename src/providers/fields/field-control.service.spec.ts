import { TestBed, inject } from '@angular/core/testing';

import { FieldControlService } from './field-control.service';

describe('FieldControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FieldControlService]
    });
  });

  it('should be created', inject([FieldControlService], (service: FieldControlService) => {
    expect(service).toBeTruthy();
  }));
});
