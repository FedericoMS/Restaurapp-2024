import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDuenioSupervisorPage } from './home-duenio-supervisor.page';

describe('HomeDuenioSupervisorPage', () => {
  let component: HomeDuenioSupervisorPage;
  let fixture: ComponentFixture<HomeDuenioSupervisorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDuenioSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
