import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-method-payment-transfert',
  templateUrl: './method-payment-transfert.component.html',
  styleUrls: ['./method-payment-transfert.component.scss']
})
export class MethodPaymentTransfertComponent implements OnInit {
  @Output() methodPayment: EventEmitter<any> = new EventEmitter();
  @Input() errorsTransferType: any;
  @Input() resetPaymentChoose: any;
  constructor() { }

  ngOnInit(): void {
  }
  getTypePayment(e: any): any {
    this.methodPayment.emit(e.target.value);
  }
}
