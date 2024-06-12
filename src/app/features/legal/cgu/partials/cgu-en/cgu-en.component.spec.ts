import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CguEnComponent } from './cgu-en.component';

describe('ConditionsEnComponent', () => {
  let component: CguEnComponent;
  let fixture: ComponentFixture<CguEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CguEnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CguEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
