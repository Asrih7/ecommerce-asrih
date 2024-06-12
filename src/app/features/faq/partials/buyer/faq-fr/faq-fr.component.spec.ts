import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqFrComponent } from './faq-fr.component';

describe('FaqFrComponent', () => {
  let component: FaqFrComponent;
  let fixture: ComponentFixture<FaqFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
