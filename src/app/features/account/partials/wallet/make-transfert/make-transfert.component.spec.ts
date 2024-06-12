import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeTransfertComponent } from './make-transfert.component';

describe('MakeTransfertComponent', () => {
  let component: MakeTransfertComponent;
  let fixture: ComponentFixture<MakeTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeTransfertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
