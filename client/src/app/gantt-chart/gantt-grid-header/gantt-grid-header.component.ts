import { Component, OnInit, HostListener } from '@angular/core';
import { GanttService } from '../shared/gantt.service';

export const headerSettings = () => [
  {label: 'ID', width: 40 },
  {label: 'Description', action: true, width: 274},
  {label: 'Assigned to', width: 130 },
  {label: 'Start', width: 78 },
  {label: 'Type', width: 68 },
  {label: '%', width: 35 },
];

export const minimalWidth = 35;

@Component({
  selector: 'ai-gantt-grid-header',
  templateUrl: './gantt-grid-header.component.html',
  styleUrls: ['./gantt-grid-header.component.scss']
})
export class GanttGridHeaderComponent implements OnInit {
  private draggedItem: any = null;
  public expanded = false;
  constructor(public ganttService: GanttService) { }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e) {
    if (this.draggedItem) {
      let width = this.draggedItem.width + e.movementX;
      if (width < minimalWidth) {
        width = minimalWidth;
      }
      this.draggedItem.width = width;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  resizerMouseEventUp(e) {
    this.draggedItem = null;
  }

  resizerMouseEventDown(item: any) {
    this.draggedItem = item;
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    for (const task of this.ganttService.allTasks) {
      task.expanded = this.expanded;
    }
    this.ganttService.setDisplayedTasks();
  }

  ngOnInit() {
    this.ganttService.headerSettings = headerSettings();
  }
}
