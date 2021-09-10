import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { GanttService } from '../shared/gantt.service';
import { TasksService } from '../../tasks/shared';
import { AuthService } from '@aitheon/core-client';

@Component({
  selector: 'ai-gantt-chart-dashboard',
  templateUrl: './gantt-chart-dashboard.component.html',
  styleUrls: ['./gantt-chart-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttChartDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('ganttViewWrapper') private ganttViewWrapper: ElementRef;
  @ViewChild('verticalScroll') private verticalScroll: ElementRef;
  @ViewChild('horizontalScroll') private horizontalScroll: ElementRef;
  @ViewChild('ganttView', {read: ElementRef}) private ganttView: ElementRef;
  @ViewChild('ganttGridBody', {read: ElementRef}) private ganttGridBody: ElementRef;
  private refresh$: any;
  private activeOrganization$: any;

  constructor(
    private authService: AuthService,
    private tasksService: TasksService,
    public ganttService: GanttService) { }

  scrollbarMarginLeft() {
    return this.ganttService.headerSettings.reduce((total: number, item: any) => total += item.width, 0);
  }

  onScroll(e: any, isHorizontal: boolean) {
    if (isHorizontal) {
      this.scrollTo(e.target.scrollLeft, null);
    } else {
      this.scrollTo(null, e.target.scrollTop);
    }
  }

  scrollTo (left = null, top = null) {
    if (left !== null) {
      this.ganttViewWrapper.nativeElement.scrollLeft = left;
      this.horizontalScroll.nativeElement.scrollLeft = left;
    }
    if (top !== null) {
      this.ganttView.nativeElement.firstElementChild.firstElementChild.scrollTop = top;
      this.ganttGridBody.nativeElement.firstElementChild.scrollTop = top;
      this.verticalScroll.nativeElement.scrollTop = top;
    }
  }

  onWheelChart (event) {
    event.preventDefault();
    const scrollLeft = this.horizontalScroll.nativeElement.scrollLeft;
    const scrollTop = this.verticalScroll.nativeElement.scrollTop;

    const maxWidth = this.ganttService.daysOnGrid * this.ganttService.dayWidth;
    const maxHeight = this.ganttService.displayedTasks.length * this.ganttService.lineHeight + 25;

    if (event.deltaX === 0) {

      let top = scrollTop + event.deltaY;
      if (top < 0) {
        top = 0;
      } else if (top > maxHeight) {
        top = maxHeight;
      }
      this.scrollTo(null, top);
    } else {
      let left = scrollLeft + event.deltaX;
      if (left < 0) {
        left = 0;
      } else if (left > maxWidth) {
        left = maxWidth;
      }
      this.scrollTo(left);
    }
  }

  ngOnInit() {
    this.refresh$ = this.tasksService.refresh.subscribe((isSaved: boolean) => {
      this.ganttService.loadTasks(true);
    });
    this.activeOrganization$ = this.authService.activeOrganization.subscribe((organization: any) => {
      this.ganttService.loadTasks();
    });
  }

  ngOnDestroy() {
    this.refresh$.unsubscribe();
    this.activeOrganization$.unsubscribe();
  }
}
