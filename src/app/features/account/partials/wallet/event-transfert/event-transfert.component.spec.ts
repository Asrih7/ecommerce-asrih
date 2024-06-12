import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTransfertComponent } from './event-transfert.component';

describe('EventTransfertComponent', () => {
  let component: EventTransfertComponent;
  let fixture: ComponentFixture<EventTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTransfertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
