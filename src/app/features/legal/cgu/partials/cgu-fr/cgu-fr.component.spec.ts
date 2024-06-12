import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CguFrComponent } from './cgu-fr.component';

describe('ConditionsFrComponent', () => {
  let component: CguFrComponent;
  let fixture: ComponentFixture<CguFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CguFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CguFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
