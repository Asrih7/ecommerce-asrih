import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/@core/services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { UserService } from 'src/@core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { initRespensive, _menuMobile } from 'src/@core/utils/main';
import { Subject, takeUntil } from 'rxjs';
import { Profile } from 'src/@core/models/profile';
import { Wallet } from 'src/@core/models/wallet';
import { MessagesService } from 'src/@core/services/messages.service';
import { ShopService } from 'src/@core/services/shop.service';
import { Router } from '@angular/router';
import { WalletService } from 'src/@core/services/wallet.service';
import { LoginOrRegisterComponent } from './login-or-register/login-or-register.component';
import { Logout } from 'src/@core/models/models';
import { BasketService } from 'src/@core/services/basket.service';
import { WishlistService } from 'src/@core/services/wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() lang?: string;
  @Output() showSettingsModal = new EventEmitter<boolean>();
  @ViewChild('userMenuContainer') userMenuContainer: any;
  @ViewChild('userShopsContainer') userShopsContainer: any;

  public searchTerm = '';
  public currentUser: Profile | null;
  public userShops: any[] = [];
  public wallet: Wallet | null;
  public unreadMsgs: any[] = [];
  public nbrBasketItems: number = 0;
  public nbrWishlistItems: number = 0;

  public isConnectedUser = false;
  public userCardOpened = false;
  public userShopsOpened = false;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private authService: AuthService,
    private authServiceSocial: SocialAuthService,
    private userService: UserService,
    private messageService: MessagesService,
    private basketService: BasketService,
    private wishlistService: WishlistService,
    private shopService: ShopService,
    private walletService: WalletService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  @HostListener('document: click', ['$event'])
  offClickHandler(event: any) {
    if ((this.userMenuContainer && !this.userMenuContainer.nativeElement.contains(event.target))) {
      this.userCardOpened = false;
    }

    if ((this.userShopsContainer && !this.userShopsContainer.nativeElement.contains(event.target))) {
      this.userShopsOpened = false;
    }
  }

  ngOnInit(): void {
    initRespensive();
    this.authService.userTokens$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: tokens => {
        const accessToken = tokens?.access;
        this.isConnectedUser = !!accessToken && this.authService.isValideAccessToken(accessToken);
        this.getUserShops(tokens?.id);
        this.getUserProfile();
        this.getUnreadMsgs(tokens?.id);
        this.getWallet();
        this.getBasket();
        if (this.isConnectedUser)
          this.getWishlist();
      }
    });

    this.messageService.messagesChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: changed => {
        this.getUnreadMsgs(this.currentUser?.id);
      }
    });

    this.getBasket();
    this.basketService.basket$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: basket => {
        this.nbrBasketItems = basket?.items?.length ?? 0
      }
    });
    this.wishlistService.wishlist$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: wishlist => {
        this.nbrWishlistItems = wishlist?.products?.length ?? 0
      }
    });
  }

  getBasket() {
    this.basketService.getBasket()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  getWishlist() {
    this.wishlistService.getWishlist()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  getUserShops(id: number | undefined): any {
    if (id && this.isConnectedUser) {
      this.shopService.getListShops('', id.toString(), '', '', '', '')
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data): any => {
          this.userShops = data as any ?? [];
        });
    } else {
      this.userShops = [];
    }
  }

  getUnreadMsgs(id: number | undefined): any {
    if (id && this.isConnectedUser) {
      this.messageService.getMessages()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
          this.unreadMsgs = (data ?? []).filter(conversation => (conversation.recipient === id && conversation.read_at === null));
        });
    } else {
      this.unreadMsgs = [];
    }
  }

  getWallet(): any {
    this.walletService.walet$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: wallet => { this.wallet = wallet }
      });

    if (this.isConnectedUser) {
      this.walletService.getWallet()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({ error: err => { } });
    } else {
      this.wallet = null;
    }
  }

  getUserProfile(): void {
    if (this.isConnectedUser) {
      this.userService.getUserCurrent()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: user => {
            this.currentUser = user ?? null;
          },
          error: error => {
            this.currentUser = null;
          }
        })
    } else {
      this.currentUser = null;
    }
  }

  logout(): void {
    this.isConnectedUser = false;
    this.authService.logout({ refresh: localStorage.getItem('refresh') } as Logout)
      .subscribe({
        next: res => {
          this.authService.setLogoutTokens();
        },
        error: err => {
          this.authService.setLogoutTokens();
        }
      });
    this.authServiceSocial.signOut().catch(err => { });
  }

  toggleUserMenu(): void {
    this.userCardOpened = !this.userCardOpened;
  }

  openLogin(): void {
    this.modalService.open(LoginOrRegisterComponent, { size: 'xs', windowClass: 'modal-login' });
  }

  toggleUserShops(): any {
    this.userShopsOpened = !this.userShopsOpened;
  }

  showSettings(): void {
    this.showSettingsModal.emit(true);
  }

  navigateToShop(name: string, event: any) {
    if (event.ctrlKey) {
      const url = this.router.serializeUrl(this.router.createUrlTree(['/shop/update-shop', name]));
      window.open(url, '_blank');
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/shop/update-shop', name]));
    }
  }

  searchProducts() {
    if (this.searchTerm) {
      this.router.navigate(['/products/search', this.searchTerm])
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
