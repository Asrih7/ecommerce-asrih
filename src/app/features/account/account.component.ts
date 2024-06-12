import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Logout } from 'src/@core/models/models';
import { Wallet } from 'src/@core/models/wallet';
import { AuthService } from 'src/@core/services/auth.service';
import { WalletService } from 'src/@core/services/wallet.service';
import { Location } from '@angular/common';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  public wallet: Wallet | null;
  public walletBalance: string;
  public fragment = 'settings';
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private authServiceSocial: SocialAuthService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.fragment
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(fragment => {
        this.fragment = fragment ?? 'settings';
      });

    this.getWallet();
  }

  getWallet(): any {
    this.walletService.walet$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        {
          next: (wallet) => {
            this.wallet = wallet;
            this.walletBalance = wallet?.balance && wallet?.balance_currency ? ` (${wallet.balance} ${wallet.balance_currency})` : ''
          }, error: (err) => {
            if (err.status === 403) {
              const idUser = this.authService.getIdOfConnectedUser();
              this.walletBalance = '';
              this.wallet = {
                balance: '',
                balance_currency: '',
                id: parseInt(idUser ?? ''),
                user: parseInt(idUser ?? ''),
                messages: err.error.detail
              };
            }
          }
        });
  }

  logout(): void {
    this.authService.logout({ refresh: localStorage.getItem('refresh') } as Logout).subscribe(
      {
        next: res => {
          this.authService.setLogoutTokens();
        },
        error: err => {
          this.authService.setLogoutTokens();
        }
      }
    );
    this.authServiceSocial.signOut().catch(err => { });
  }

  navTabClick(tab: string) {
    if (tab == 'logout') {
      this.logout();
    }
    else {
      this.location.replaceState(`/account#${tab}`)
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
