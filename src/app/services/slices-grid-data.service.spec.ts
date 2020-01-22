import { TestBed } from '@angular/core/testing';

import { SlicesGridDataService } from './slices-grid-data.service';

describe('SlicesGridDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlicesGridDataService = TestBed.get(SlicesGridDataService);
    expect(service).toBeTruthy();
  });
});
