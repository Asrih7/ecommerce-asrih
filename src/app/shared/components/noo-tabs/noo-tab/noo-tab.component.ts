import { Component, Input } from '@angular/core';

@Component({
  selector: 'noo-tab',
  templateUrl: './noo-tab.component.html',
  styleUrls: ['./noo-tab.component.scss']
})
export class TabComponent {
  @Input() id?: string;
  @Input() title: string;
  @Input() icon: string;
  @Input() active = false;
  @Input() mode?: 'vertical' | 'horizontal' = 'vertical';
}