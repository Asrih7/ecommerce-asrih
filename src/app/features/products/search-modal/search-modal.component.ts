import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss']
})
export class SearchModalComponent implements OnChanges {
  @Input() show: boolean = false;
  @Input() filters: { [key: string]: any };
  @Input() dynamicFiltersKeys: string[] = []
  @Input() excludedKeys = ['category_hierarchy', 'price', 'inspiration_country'];
  @Input() filterParams: any = {};
  @Input() loadinInformations = false;
  @Input() currency = '';
  
  @Output() close = new EventEmitter<boolean>();
  @Output() filterProducts = new EventEmitter<any>();
  @ViewChild('filtersContainer') filtersContainer: any;

  public categories: any[];
  public aciveCategory: string | undefined = undefined
  public maxPrice: number;
  public seeMoreKey: string = '';

  constructor(public translate: TranslateService) { }

  @HostListener('window:click', ['$event'])
  clickOut(event: any) {
    const dataModal = event.target.getAttribute('data-modal');
    const parentClassList = event.target?.parentElement?.classList
    const classListArray = parentClassList ? Array.from(parentClassList) : []
    if (
      this.filtersContainer &&
      !this.filtersContainer.nativeElement.contains(event.target) &&
      dataModal != 'noo_filters_modal' &&
      !classListArray.includes("noo_filters_modal") &&
      !classListArray.includes("cdk-overlay-container")) {
      this.close.emit(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']?.currentValue != changes['filters']?.previousValue) {
      if (this.filters['category_hierarchy']?.choices) {
        this.categories = [...this.getCategoriesTree(this.filters['category_hierarchy'].choices)];
      }

      this.maxPrice = this.filters['price'].initial[1].max as number;
    }
  }

  getCategoriesTree(categories: any[]) {
    if (!categories.length) {
      return [];
    }

    const root = categories[0].display_name;

    const tree: any[] = [];
    for (let cat of categories) {
      let path = cat.display_name.replace(root, 'ROOT').split('/');
      let slugPaths = cat.value;

      let currentLevel = tree;
      for (let part of path) {
        if (part == 'ROOT') {
          part = root.split('/').pop();
        }

        var existingPath = this.getPath(currentLevel, part);
        if (existingPath) {
          currentLevel = existingPath.children;
        } else {
          currentLevel.push({ label: part, slugPaths, children: [] });
          currentLevel = [];
        }
      }
    }

    return tree;
  }

  getPath(levelArray: any[], part: string) {
    let index = 0;
    while (index < levelArray.length && levelArray[index].label !== part) { index++; };

    if (index < levelArray.length) {
      return levelArray[index]
    }

    return undefined;
  }

  categoryClick(event: any, catSlug: string) {
    this.aciveCategory = catSlug;
    if (this.filterParams['category_hierarchy'] != catSlug) {
      this.filterParams['category_hierarchy'] = catSlug;
      this.filterProducts.emit(this.filterParams);
    }
  }

  emitFilterSeach() {
    this.filterProducts.emit(this.filterParams);
  }

  checkboxChange(event: any, key: string, value: string) {
    if (event.target.checked) {
      if (this.filters[key]?.type == 'BooleanFilter') {
        this.filterParams[key] = [value];
      } else {
        this.filterParams[key].push(value);
      }
    } else {
      this.filterParams[key] = this.filterParams[key].filter((v: any) => v != value)
    }

    this.filterProducts.emit(this.filterParams);
  }

  RadioChange(event: any, key: string) {
    this.filterParams[key] = event.checked;
    this.filterProducts.emit(this.filterParams);
  }

  seeMore(key: string) {
    this.seeMoreKey = !this.seeMoreKey || this.seeMoreKey != key ? key : ''
  }

  closeModal() {
    this.close.emit(true);
  }
}
