import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TortaPage } from './torta.page';

describe('TortaPage', () => {
  let component: TortaPage;
  let fixture: ComponentFixture<TortaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TortaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
