import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryFrComponent } from './history-fr.component';

describe('HistoryFrComponent', () => {
  let component: HistoryFrComponent;
  let fixture: ComponentFixture<HistoryFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
