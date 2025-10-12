import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinkNoiseComponent } from './pink-noise.component';

describe('PinkNoiseComponent', () => {
  let component: PinkNoiseComponent;
  let fixture: ComponentFixture<PinkNoiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinkNoiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinkNoiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
