import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentFrComponent } from './consent-fr.component';

describe('ConsentFrComponent', () => {
  let component: ConsentFrComponent;
  let fixture: ComponentFixture<ConsentFrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentFrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsentFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
