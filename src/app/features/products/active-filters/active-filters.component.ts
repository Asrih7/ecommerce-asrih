import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-active-filters',
  templateUrl: './active-filters.component.html',
  styleUrls: ['./active-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveFiltersComponent {
  @Input() aciveFilters: any[];
  @Input() filters: { [key: string]: any };
  @Output() removeFilter = new EventEmitter<string>();


  onRemoveFilter(key: string) {
    this.removeFilter.emit(key);
  }
}
