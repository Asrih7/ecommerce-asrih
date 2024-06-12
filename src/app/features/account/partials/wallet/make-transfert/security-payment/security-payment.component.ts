import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-security-payment',
  templateUrl: './security-payment.component.html',
  styleUrls: ['./security-payment.component.scss']
})
export class SecurityPaymentComponent implements OnInit {
  @Input() password: any;
  @Input() errorsPassword: any;
  @Input() formGroup: any;
  @Output() passwordhandler: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  sendPassword(e: any): any {
    this.passwordhandler.emit(e.target.value);
  }
}
