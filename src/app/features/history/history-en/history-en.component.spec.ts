import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryEnComponent } from './history-en.component';

describe('HistoryEnComponent', () => {
  let component: HistoryEnComponent;
  let fixture: ComponentFixture<HistoryEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryEnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
