import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/@core/services/user.service';
import { NewsletterService } from 'src/@core/services/newsletter.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { AuthService } from 'src/@core/services/auth.service';
@Component({
  selector: 'app-newsletter-section',
  templateUrl: './newsletter-section.component.html',
  styleUrls: ['./newsletter-section.component.scss']
})
export class NewsletterSectionComponent implements OnInit, OnDestroy {
  public newsletterForm = new FormGroup({ email: new FormControl<string | undefined>(undefined, [Validators.email]) });
  public subscriptionSuccessful?: boolean = false;
  public emailPlaceholder?: string = undefined;
  public isLoggedIn: boolean;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private settingsService: RegionalSettingsService,
    private newsletterService: NewsletterService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.isConnectedUser();

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: settings => {
          if (settings?.language) {
            this.getEditEmailFields();
          }
        }
      });
  }

  isConnectedUser(): void {
    this.authService.userTokens$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: tokens => {
          const accessToken = tokens?.access;
          this.isLoggedIn = !!accessToken && this.authService.isValideAccessToken(accessToken);
          this.getEditEmailFields();
        }
      })
  }

  getEditEmailFields(): void {
    this.newsletterService.getNewsLetterInfo()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: options => {
          this.emailPlaceholder = options.actions.POST['email']['help_text'];
          this.newsletterForm.reset();
          this.subscriptionSuccessful = false;
        },
        error: error => {
          this.emailPlaceholder = undefined;
          this.newsletterForm.setErrors({ 'email': error?.error?.detail });
          this.subscriptionSuccessful = false;
        }
      })
  }

  loadUserAndSubmit(): void {
    this.userService.profile$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.newsletterForm.patchValue({ email: response?.email });
          this.submitToNewsLetter();
        },
        error: (error: any) => {
          this.newsletterForm.patchValue({ email: undefined });
        }
      });
  }

  submitToNewsLetter(): void {
    let email = this.newsletterForm.get("email")?.value ?? undefined;
    if (email) {
      this.newsletterService.submitToNewsLetter(email)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (result: any) => {
            this.subscriptionSuccessful = true;
          },
          error: (error: any) => {
            this.newsletterForm.setErrors({ 'email': Object.values(error.error)[0] })
            this.subscriptionSuccessful = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
