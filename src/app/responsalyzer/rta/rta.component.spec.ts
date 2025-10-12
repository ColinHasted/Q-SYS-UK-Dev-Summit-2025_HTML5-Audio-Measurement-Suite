import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtaComponent } from './rta.component';

describe('RtaComponent', () => {
  let component: RtaComponent;
  let fixture: ComponentFixture<RtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
