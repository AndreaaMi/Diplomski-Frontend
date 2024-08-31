import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequestsComponent } from './document-requests.component';

describe('DocumentRequestsComponent', () => {
  let component: DocumentRequestsComponent;
  let fixture: ComponentFixture<DocumentRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
