import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderIndicatorComponent } from './loader-indicator.component';

describe('LoaderIndicatorComponent', () => {
  let component: LoaderIndicatorComponent;
  let fixture: ComponentFixture<LoaderIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
