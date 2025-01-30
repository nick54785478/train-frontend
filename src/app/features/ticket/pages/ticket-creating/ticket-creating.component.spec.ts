import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCreatingComponent } from './ticket-creating.component';

describe('TicketCreatingComponent', () => {
  let component: TicketCreatingComponent;
  let fixture: ComponentFixture<TicketCreatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCreatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
