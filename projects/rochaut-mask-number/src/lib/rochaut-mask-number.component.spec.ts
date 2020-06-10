import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RochautMaskNumberComponent } from './rochaut-mask-number.component';

describe('RochautMaskNumberComponent', () => {
  let component: RochautMaskNumberComponent;
  let fixture: ComponentFixture<RochautMaskNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RochautMaskNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RochautMaskNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
