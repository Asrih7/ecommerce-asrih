import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesFrComponent } from './cookies-fr.component';

describe('CookiesFrComponent', () => {
  let component: CookiesFrComponent;
  let fixture: ComponentFixture<CookiesFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookiesFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiesFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
