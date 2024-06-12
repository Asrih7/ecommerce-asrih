import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesEnComponent } from './cookies-en.component';

describe('CookiesEnComponent', () => {
  let component: CookiesEnComponent;
  let fixture: ComponentFixture<CookiesEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookiesEnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiesEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
