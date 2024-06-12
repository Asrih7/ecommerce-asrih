import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalAccountComponent } from './international-account.component';

describe('InternationalAccountComponent', () => {
  let component: InternationalAccountComponent;
  let fixture: ComponentFixture<InternationalAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
