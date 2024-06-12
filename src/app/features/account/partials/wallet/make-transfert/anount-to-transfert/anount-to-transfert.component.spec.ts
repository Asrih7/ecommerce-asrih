import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnountToTransfertComponent } from './anount-to-transfert.component';

describe('AnountToTransfertComponent', () => {
  let component: AnountToTransfertComponent;
  let fixture: ComponentFixture<AnountToTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnountToTransfertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnountToTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
