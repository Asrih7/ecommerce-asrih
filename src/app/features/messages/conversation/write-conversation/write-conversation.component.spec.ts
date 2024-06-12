import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteConversationComponent } from './write-conversation.component';

describe('WriteConversationComponent', () => {
  let component: WriteConversationComponent;
  let fixture: ComponentFixture<WriteConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
