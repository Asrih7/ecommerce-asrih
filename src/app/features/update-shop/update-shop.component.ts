import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Shop } from 'src/@core/models/shop';
import { ShopService } from 'src/@core/services/shop.service';

@Component({
  selector: 'app-update-shop',
  templateUrl: './update-shop.component.html',
  styleUrls: ['./update-shop.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UpdateShopComponent implements OnInit, OnDestroy {
  public shopName: string;
  public shop: Shop;

  /// use shope.logo instead
  public newImgChange: any;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private routerActive: ActivatedRoute,
    private shopService: ShopService
  ) { }

  ngOnInit() {
    this.shopName = this.routerActive.snapshot.params["name"];
    this.shopService.getShopByName(this.shopName?.toLocaleLowerCase() ?? '')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: shops => {
          if (shops?.length) {
            this.shop = shops[0];
            this.shopName = this.shop.name;
          }
        },
        error: error => { console.log(error); }
      });
  }

  editShopLogo(e: any): any {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) { this.shop.logo = reader.result as any; }
    };

    if (file) {
      reader.readAsDataURL(file);
      this.newImgChange = file;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}