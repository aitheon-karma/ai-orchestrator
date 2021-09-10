import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Observable, range } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'ai-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() pageSize = 1;
  @Input() total = 1;
  @Input() range = 3;
  @Input() currentPage: number;
  @Output() pageChange: EventEmitter<{ page: number }> = new EventEmitter<{ page: number }>();
  @Output() totalPagesCount: EventEmitter<number> = new EventEmitter<number>();

  // pages: Observable<number[]>;
  pages: any;
  totalPages: number;

  get offset(): number {
    return this.currentPage * this.pageSize;
  }

  constructor() { }

  ngOnInit() {
    this.getPages(this.offset, this.pageSize, this.total);
    this.totalPagesCount.emit(this.totalPages);
  }

  ngOnChanges() {
    this.getPages(this.offset, this.pageSize, this.total);
    this.totalPagesCount.emit(this.totalPages);
  }

  getPages(offset: number, pageSize: number, total: number) {
    this.totalPages = this.getTotalPages(pageSize, total);
    this.pages = range(-this.range, this.range * 2 + 1)
      .pipe(map(o => this.currentPage + o))
      .pipe(filter(page => this.isValidPageNumber(page, this.totalPages)));
      //
      // .toArray();
  }

  isValidPageNumber(page: any, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  getTotalPages(pageSzie: number, total: number): number {
    return Math.ceil(Math.max(total, 1) / Math.max(pageSzie, 1));
  }

  selectPage(page: number, event) {
    this.cancelEvent(event);
    if (this.isValidPageNumber(page, this.totalPages)) {
      this.currentPage = page;
      this.pageChange.emit({ page: page });
      this.getPages(this.offset, this.pageSize, this.total);
    }
  }

  cancelEvent(event) {
    event.preventDefault();
  }
}
