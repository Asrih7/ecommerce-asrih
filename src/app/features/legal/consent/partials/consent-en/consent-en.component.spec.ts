import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentEnComponent } from './consent-en.component';

describe('ConsentEnComponent', () => {
  let component: ConsentEnComponent;
  let fixture: ComponentFixture<ConsentEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentEnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsentEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
