import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCommandComponent } from './single-command.component';

describe('SingleCommandComponent', () => {
  let component: SingleCommandComponent;
  let fixture: ComponentFixture<SingleCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCommandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
