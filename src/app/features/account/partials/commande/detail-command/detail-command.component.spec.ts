import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCommandComponent } from './detail-command.component';

describe('DetailCommandComponent', () => {
  let component: DetailCommandComponent;
  let fixture: ComponentFixture<DetailCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCommandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
