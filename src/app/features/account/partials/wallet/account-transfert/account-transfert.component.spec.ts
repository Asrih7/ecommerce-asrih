import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransfertComponent } from './account-transfert.component';

describe('AccountTransfertComponent', () => {
  let component: AccountTransfertComponent;
  let fixture: ComponentFixture<AccountTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTransfertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
