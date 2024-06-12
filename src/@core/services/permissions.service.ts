import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginOrRegisterComponent } from 'src/app/layout/header/login-or-register/login-or-register.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(
    private _router: Router,
    public _auth: AuthService,
    private _modalService: NgbModal
  ) { }

  canActivate(url: string): boolean {
    const isConnected = this._auth.isAuthenticated();
    if (isConnected) {
      return true;
    } else {
      this._router.navigate([this._router.url], { queryParams: { returnUrl: url } });
      this._modalService.open(LoginOrRegisterComponent, { size: 'xs', windowClass: 'modal-login' });
      return false;
    }
  }
}
