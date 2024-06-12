import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription, filter, take, takeUntil } from 'rxjs';
import { FormGeneric } from 'src/@core/models/form-generic';
import { LOGIN_FORM, USER_FORM } from 'src/@core/models/form.model';
import { Login } from 'src/@core/models/models';
import { UserRegister } from 'src/@core/models/userRegister';
import { AlertsService } from 'src/@core/services/alerts.service';
import { AuthService } from 'src/@core/services/auth.service';
import { GenerateInformationsService } from 'src/@core/services/generate-informations.service';
import { UserService } from 'src/@core/services/user.service';
declare var google: any;

@Component({
  selector: 'app-login-or-register',
  templateUrl: './login-or-register.component.html',
  styleUrls: ['./login-or-register.component.scss']
})
export class LoginOrRegisterComponent implements OnInit, OnDestroy {
  public loginFields: any = [];
  public registerFields: any = [];
  public timeOut: any;
  public socialSubject: Subscription;
  public form: any;
  public isRegister = false;
  public errors: any = [];
  public withError = false;
  public fieldsState = false;
  public isValidEmail = false;
  public isMailExist = false;
  public emailEntred = null;
  public showLoader = false;
  public facebookLoader = false
  public googleLoader = false
  public counterInfo = 20;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fieldsControl: GenerateInformationsService,
    private authServiceSocial: SocialAuthService,
    private spinner: NgxSpinnerService,
    private alertsService: AlertsService
  ) {
    this.form = new FormGeneric(fb)
    this.form.group = this.fb.group(LOGIN_FORM);
  }

  // @HostListener('window: resize', ['$event'])
  // onWindowResize(event: any) {
  //   if (this.socialSubject) {
  //     this.socialSubject.unsubscribe();
  //   }

  //   // this.renderGoogleButton();
  // }

  ngOnInit() {
    this.renderGoogleButton();
    this.form.group.reset();
    this.getLoginFields();
  }

  ngAfterViewChecked(): void {
    const ele = document.getElementById('credential_picker_iframe');
    if (ele) {
      ele.style.display = "none";
    }
  }

  renderGoogleButton(): void {
    this.socialSubject = this.authServiceSocial.initState
      .pipe(filter((state) => state), take(1))
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(_ => {
        google.accounts.id.initialize({
          client_id: "908028250457-odvbtaaitlo23bnpg251qpbf4l5s44km.apps.googleusercontent.com",
          auto_select: false,
          callback: (res: any) => {
            this.googleLoader = true;
            this.refresh(res);
          }
        });

        const settings = localStorage.getItem('regionalSettings');
        const selectedLang = settings ? JSON.parse(settings)?.language : '';

        google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          {
            type: 'standard',
            size: "large",
            width: document.getElementById("googleBtnContainer")?.offsetWidth,
            theme: "outline",
            class: " login",
            locale: selectedLang === 'fr' ? "fr_FR" : 'en-EN'
          }
        );
        google.accounts.id.prompt();
      });
  }

  refresh(res: any) {
    this.spinner.show();
    this.googleLoader = true
    this.authService.convertGoogleToken(res.credential)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: data => {
          if (data) {
            this.spinner.hide();
            this.googleLoader = false
            this.loginSuccess();
          }
        },
        error: err => {
          this.googleLoader = false;
          this.spinner.hide();
          if (err?.error?.message?.error_description) {
            this.alertsService.messageError(err.error.message.error_description);
          }
        }
      });
  }

  checkEmailValidation(event: any) {
    this.isMailExist = false;
    this.emailEntred = null;
    this.isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(event.target.value);
    if (this.isValidEmail) {
      this.emailEntred = event.target.value;
    }
  }

  checkUser() {
    this.showLoader = true;
    if (this.emailEntred) {
      this.userService.checkUser(this.emailEntred)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (res) => {
            this.isMailExist = true;
            this.showLoader = false;
          },
          error: err => {
            this.register();
            this.isMailExist = false;
            this.showLoader = false;
          }
        });
    }
  }

  goToLogin() {
    this.form.group.reset();
    this.form.group = this.fb.group(LOGIN_FORM);
    this.form.group.get("email").setValue(this.emailEntred);
    this.isRegister = false;
    this.getLoginFields();
  }

  getLoginFields(): any {
    const fields: any = localStorage.getItem("fieldsControlLogin");
    this.fieldsState = true;

    if (fields) {
      this.loginFields = JSON.parse(fields);
      this.fieldsState = false;
    } else {
      this.fieldsControl.getInformationToken()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (fields) => {
            this.fieldsState = false;
            this.loginFields = [];

            const list = fields.actions.POST;
            for (const [key, value] of Object.entries(list)) {
              if (key != 'first_name' && key != 'last_name') {
                this.loginFields = [...this.loginFields, { key, value }];
              }
            }

            localStorage.setItem("fieldsControlLogin", JSON.stringify(this.loginFields));
          }, error: (err) => {
            this.fieldsState = false
          }
        });
    }
  }

  getRegisterFields(): any {
    const fields: any = localStorage.getItem("fieldsControlRegister");
    this.fieldsState = true;

    if (fields) {
      this.registerFields = JSON.parse(fields);
      this.fieldsState = false;
    } else {
      this.fieldsControl.getInformationUser()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (fields) => {
            this.fieldsState = false;
            this.registerFields = [];

            const list = fields.actions.POST;
            for (const [key, value] of Object.entries(list)) {
              this.registerFields = [...this.registerFields, { key, value }];
              localStorage.setItem("fieldsControlRegister", JSON.stringify(this.registerFields));
            }
          }, error: (err) => {
            this.fieldsState = false
          }
        });
    }
  }

  submit(): void {
    this.errors = [];
    this.withError = false;

    if (this.isRegister) {
      const user = {} as UserRegister;
      this.form.assign(user);
      this.userService.register(user)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          {
            next: response => {
              if (response) {
                this.loginSuccess();
              }
            },
            error: (err) => {
              if (err) {
                if (err.status === 400) {
                  for (const [key, value] of Object.entries(err.error)) {
                    this.errors = [...this.errors, { key, value }];
                  }
                } else if (err.status === 401) {
                  this.withError = true;
                  for (const [key, value] of Object.entries(err.error)) {
                    this.errors = [...this.errors, { key, value }];
                  }
                }
              }
            }
          });
    } else {
      const login = {} as Login;
      this.form.assign(login);
      login.email = login.email?.toLocaleLowerCase();
      this.authService.login(login)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          {
            next: response => {
              if (response) {
                this.loginSuccess();
              }
            },
            error: (err) => {
              if (err.status === 400) {
                for (const [key, value] of Object.entries(err.error)) {
                  this.errors = [...this.errors, { key, value }];
                }
              } else if (err.status === 401) {
                this.withError = true;
                for (const [key, value] of Object.entries(err.error)) {
                  this.errors = [...this.errors, { key, value }];
                }
              }
            }
          });
    }
  }

  register(): void {
    clearTimeout(this.timeOut);
    this.getRegisterFields();
    this.isRegister = true;
    this.form.group.reset();
    this.form.group = this.fb.group(USER_FORM);
    this.errors = [];

    this.isValidEmail = true;
    this.counterInfo = 20;
    this.showTimer()
  }

  showTimer() {
    if (this.counterInfo > 0) {
      this.timeOut = setTimeout(() => {
        this.counterInfo = this.counterInfo - 1;
        this.showTimer()
      }, 1000);
    }
  }

  signInWithFB(): void {
    this.authServiceSocial.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authServiceSocial.authState
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: user => {
          if (user && user.provider == "GOOGLE") {
            this.googleLoader = true
            this.form.assign(user);
            this.authService.convertGoogleToken(user.idToken)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe({
                next: data => {
                  this.googleLoader = false;
                  if (data) {
                    this.loginSuccess()
                  }
                }, error: err => {
                  this.googleLoader = false
                  if (err?.error?.message?.error_description) {
                    this.alertsService.messageError(err.error.message.error_description);
                  }
                }
              });
          } else if (user && user.provider == "FACEBOOK") {
            this.spinner.show();
            this.facebookLoader = true
            this.form.assign(user);
            this.authService.convertFacebokToken(user.authToken)
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe({
                next: data => {
                  this.facebookLoader = false
                  this.spinner.hide();
                  if (data) {
                    this.loginSuccess()
                  }
                },
                error: err => {
                  this.facebookLoader = false
                  this.spinner.hide();
                  if (err?.error?.message?.error_description) {
                    this.alertsService.messageError(err.error.message.error_description);
                  }
                }
              });
          }
        },
        error: err => {
          this.facebookLoader = false;
          this.spinner.hide();
          this.authServiceSocial.signOut()
        }
      });

  }

  loginSuccess() {
    this.navigateToReurnUrlIfExists();
    this.activeModal.close();
  }

  navigateCGU(): any {
    this.router.navigate(['/legal/terms-of-use']);
  }

  openForgotPassword(): any {
    this.activeModal.close();
    this.router.navigate(['/forgot-password'])
  }

  navigateToReurnUrlIfExists() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || undefined;
    if (returnUrl) {
      const urlParts = returnUrl.split("#")
      const mainUrl = urlParts[0];
      const fragment = urlParts[1];

      this.router.navigate([mainUrl], { fragment: fragment, state: history.state });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}