import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBlockComponent } from './address-block.component';

describe('AddressBlockComponent', () => {
  let component: AddressBlockComponent;
  let fixture: ComponentFixture<AddressBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
