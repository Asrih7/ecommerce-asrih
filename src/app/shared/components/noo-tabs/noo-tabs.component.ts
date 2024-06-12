import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { TabComponent } from './noo-tab/noo-tab.component';

@Component({
  selector: 'noo-tabs',
  templateUrl: './noo-tabs.component.html',
  styleUrls: ['./noo-tabs.component.scss']
})
export class TabsComponent {
  @Input() class?: string;
  @Input() mode: string = 'vertical';

  @Output() tabClick = new EventEmitter<string>();
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  selectTab(tab: TabComponent) {
    window.scrollTo(0, 65);
    this.tabs.forEach(tab => tab.active = false);
    tab.active = true;
    this.tabClick.emit(tab.id);
  }
}