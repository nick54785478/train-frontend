import { TestBed } from '@angular/core/testing';

import { CustomisationService } from '../../shared/services/customisation.service';

describe('CustomisationService', () => {
  let service: CustomisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
