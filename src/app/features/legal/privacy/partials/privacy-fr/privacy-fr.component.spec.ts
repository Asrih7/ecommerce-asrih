import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyFrComponent } from './privacy-fr.component';

describe('PrivacyFrComponent', () => {
  let component: PrivacyFrComponent;
  let fixture: ComponentFixture<PrivacyFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
