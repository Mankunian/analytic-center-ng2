import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketStatusComponent } from './socket-status.component';

describe('SocketStatusComponent', () => {
  let component: SocketStatusComponent;
  let fixture: ComponentFixture<SocketStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
