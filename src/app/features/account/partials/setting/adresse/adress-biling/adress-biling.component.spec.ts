import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressBilingComponent } from './adress-biling.component';

describe('AdressBilingComponent', () => {
  let component: AdressBilingComponent;
  let fixture: ComponentFixture<AdressBilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdressBilingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdressBilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
