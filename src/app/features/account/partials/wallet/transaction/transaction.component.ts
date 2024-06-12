import { Component, Input, OnInit } from '@angular/core';
import { WalletService } from 'src/@core/services/wallet.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @Input() wallet: any;

  transactions: any[] = [];
  p2: any;
  listFields: any = [];
  formatDate: any;
  listState: any = [];
  showLoader = false;
  isAPICallInProgress = false;

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.initializePagination();
    this.refreshData();
    this.isAPICallInProgress = true
    // this.loadTransaction();
  }

  refreshData(): any {
    this.loadTransaction();

    // this.shareableService.refreshTransaction$.subscribe(response => {
    //   if (!this.isAPICallInProgress) {
    //     this.isAPICallInProgress = true;
    //     this.loadTransaction();
    //   }
    // });
  }

  loadTransaction(): void {
    this.listFields = [];
    this.listState = [];
    this.transactions = [];
    this.readControlFields();
    this.listTransactions();
    if (localStorage.getItem('language') === 'fr') {
      this.formatDate = 'dd-MM-yyyy';
    } else {
      this.formatDate = 'yyyy-MM-dd';
    }
  }

  initializePagination(): any {
    this.p2 = 0;
  }

  listTransactions(): any {
    this.showLoader = true
    this.walletService.getTransaction().subscribe(data => {
      this.showLoader = false
      if (data) {
        this.transactions = data;
        this.isAPICallInProgress = false;
      }
    }, err => {
      this.showLoader = false
      this.isAPICallInProgress = false;
    });
  }

  readControlFields(): any {
    this.walletService.getFieldsTransaction().subscribe((fields) => {
      const list = fields.actions.GET;
      this.listFields = [];
      for (const [key, value] of Object.entries(list)) {
        this.listFields = [...this.listFields, { key, value }];
      }
      
      this.listFields.forEach((items: any) => {
        if (items.key === 'status') {
          items.value.choices.forEach((element: any) => {
            this.listState.push(element);
          });
        }
      });
      this.listFields = this.listFields.filter((field: any) => field.key !== 'wallet' && field.key !== 'id');
    });
  }
}
