import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WesternunionAccountComponent } from './westernunion-account.component';

describe('WesternunionAccountComponent', () => {
  let component: WesternunionAccountComponent;
  let fixture: ComponentFixture<WesternunionAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WesternunionAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WesternunionAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
