import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/@core/services/category.service';
import { mainMenu } from 'src/@core/utils/helpers';
import { _menuMobile } from 'src/@core/utils/main';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  @Input() categoriesChanged: boolean = false;
  @ViewChildren('subCategories') subCategories: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('menuBurger') menuBurger: ElementRef<HTMLElement>;

  public topLevelCategories: any[] = [];
  public level1Category: any;
  public allCategories: any;
  public activeBottomLevel: number | undefined;

  fieldsState = false;
  screenWidth = 0;



  constructor(
    public translate: TranslateService,
    private categoryService: CategoryService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 1097) {
      this.getTopLevelCategories()
    }
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth >= 1097 && (this.topLevelCategories.length == 0)) {
        this.getTopLevelCategories();
      }
    });

    mainMenu();
  }

  getTopLevelCategories(): any {
    const allCat = localStorage.getItem("top-categorie")
    if (allCat != undefined && allCat != null) {
      this.topLevelCategories = JSON.parse(allCat);
      this.getAllCategories()
    }
    else {
      this.fieldsState = true;
      this.getAllCategories()
      this.categoryService.getTopLevelCategories().subscribe({
        next: (data) => {
          if (data) {
            localStorage.setItem("top-categorie", JSON.stringify(data))
            setTimeout(() => {
              this.topLevelCategories = data;
            }, 50);


          }
        },
        error: err => this.fieldsState = false
      });
    }
  }

  getAllCategories(): any {
    let allCat: any = localStorage.getItem("all-categorie")
    if (allCat) {
      allCat = JSON.parse(allCat)
      this.allCategories = allCat.filter((d: any) => d.level == 0 && d.parent == null).reduce((a: any, v: any) => ({ ...a, [v.id]: v }), {})
      this.setChildren(Object.values(this.allCategories), 1, allCat.filter((d: any) => d.level !== 0 || d.parent !== null), { d: 0 });

    } else {
      this.categoryService.getCategories().subscribe(data => {
        if (data) {
          const filtredData = data.filter(d => d.level <= 3)
          localStorage.setItem("all-categorie", JSON.stringify(filtredData))
          this.getAllCategories();
        }
      })
    }
  }

  setChildren(parents: any[], level: number, data: any[], depth: { d: number }) {
    if (parents && parents.length > 0) {
      parents.forEach(parent => {
        if (!parent.parent) { depth.d = 0; }
        depth.d = parent.level > depth.d ? parent.level : depth.d;
        const childrens = data.filter(d => d.level == level && d.parent == parent.id)
        parent.children = childrens
        this.setChildren(childrens, level + 1, data.filter(d => d.level !== level || d.parent !== parent.id), depth);
        parent.depth = depth.d + 1
      });
    }
  }

  onSubCategorHover(l1Category: any) {
    this.level1Category = l1Category
  }

  getAllcategorieMobile(event: any, l1Category: any, idx: number) {
    if (this.screenWidth > 1097) {
      return;
    }

    _menuMobile(event.currentTarget, idx + 1);
    if (this.allCategories) {
      this.level1Category = this.allCategories[l1Category.id]?.children[0];
    } else {
      this.getAllCategories()
    }
  }

  onTopCategoryover(l1Category: any) {
    if (this.screenWidth > 1097) {
      if (this.allCategories) {
        this.level1Category = this.allCategories[l1Category.id]?.children[0];
      } else {
        this.getAllCategories();
      }
    }
  }

  getCategeryProducts(event: any, idx: number, level0Cat: any, level1Cat?: any, level2Cat?: any, level3Cat?: any) {
    event.stopPropagation()

    const urls = ['products', level0Cat.translations[this.translate.currentLang]?.slug,
      (level1Cat ? level1Cat.translations[this.translate.currentLang]?.slug : undefined),
      (level2Cat ? level2Cat.translations[this.translate.currentLang]?.slug : undefined),
      (level3Cat ? level3Cat.translations[this.translate.currentLang]?.slug : undefined)
    ];

    this.closeSubCategorie(idx);
    const urlSegments = urls.filter(u => !!u);
    if (event.ctrlKey) {
      const url = this.router.serializeUrl(this.router.createUrlTree(urlSegments));
      window.open(url, '_blank');
    } else {
      this.router.navigate(urlSegments);
    }
  }

  getPromotionProducts(event: any) {
    const urlSegments = ['products', 'promotions'];
    if (event.ctrlKey) {
      const url = this.router.serializeUrl(this.router.createUrlTree(urlSegments));
      window.open(url, '_blank');
    } else {
      this.router.navigate(urlSegments);
    }

    if (this.screenWidth < 1097) {
      this.menuBurger.nativeElement.click();
    }
  }

  closeSubCategorie(idx: number) {
    const subCat = this.subCategories.get(idx);
    this.level1Category = undefined;

    if (this.screenWidth < 1097) {
      this.menuBurger.nativeElement.click();
    }

    if (subCat) {
      subCat.nativeElement.style.pointerEvents = 'none';
      let interval = setInterval(() => {
        this.subCategories.forEach(el => el.nativeElement.style.pointerEvents = 'unset');
        clearInterval(interval);
      }, 10);
    }
  }
}
