import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelProfileComponent } from './side-panel-profile.component';

describe('SidePanelProfileComponent', () => {
  let component: SidePanelProfileComponent;
  let fixture: ComponentFixture<SidePanelProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePanelProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidePanelProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
