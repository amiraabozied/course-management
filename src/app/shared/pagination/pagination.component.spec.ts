import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('pages getter', () => {
    it('returns all pages when total <= 7', () => {
      component.totalPages = 5;
      component.currentPage = 1;
      expect(component.pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('includes ellipsis near start when current page is high', () => {
      component.totalPages = 10;
      component.currentPage = 8;
      const pages = component.pages;
      expect(pages[0]).toBe(1);
      expect(pages).toContain('...');
      expect(pages[pages.length - 1]).toBe(10);
    });

    it('includes ellipsis near end when current page is low', () => {
      component.totalPages = 10;
      component.currentPage = 2;
      const pages = component.pages;
      expect(pages[0]).toBe(1);
      expect(pages).toContain('...');
      expect(pages[pages.length - 1]).toBe(10);
    });
  });

  describe('rangeStart / rangeEnd', () => {
    it('returns 0 when totalItems is 0', () => {
      component.totalItems = 0;
      component.currentPage = 1;
      component.pageSize = 5;
      expect(component.rangeStart).toBe(0);
    });

    it('calculates correct range for first page', () => {
      component.totalItems = 23;
      component.currentPage = 1;
      component.pageSize = 5;
      expect(component.rangeStart).toBe(1);
      expect(component.rangeEnd).toBe(5);
    });

    it('calculates correct range for last page', () => {
      component.totalItems = 23;
      component.currentPage = 5;
      component.pageSize = 5;
      expect(component.rangeStart).toBe(21);
      expect(component.rangeEnd).toBe(23);
    });
  });

  describe('goTo()', () => {
    it('emits the page number', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 1;
      component.goTo(3);
      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('does not emit when clicking the current page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 2;
      component.goTo(2);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('does not emit for ellipsis string', () => {
      spyOn(component.pageChange, 'emit');
      component.goTo('...');
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('prev() / next()', () => {
    it('prev() emits currentPage - 1', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 3;
      component.prev();
      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });

    it('prev() does not emit on first page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 1;
      component.prev();
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('next() emits currentPage + 1', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 2;
      component.totalPages = 5;
      component.next();
      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('next() does not emit on last page', () => {
      spyOn(component.pageChange, 'emit');
      component.currentPage = 5;
      component.totalPages = 5;
      component.next();
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });
});
