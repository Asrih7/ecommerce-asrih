import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderBuyer } from 'src/@core/models/orderBuyer';
import { OrderSeller } from 'src/@core/models/orderSeller';
import { OrderService } from 'src/@core/services/order.service';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detail-command',
  templateUrl: './detail-command.component.html',
  styleUrls: ['./detail-command.component.scss']
})
export class DetailCommandComponent implements OnInit, OnDestroy {
  public ordersOfSeller: any[] = [];
  public ordersOfBuyer: any[] = [];
  public listFieldSeller: any = [];
  public listFieldSellerfiltred: any = [];
  public listFieldBuyerfiltred: any = [];
  public listFieldBuyer: any = [];
  public StatusListSeller: any = [];
  public StatusListBuyer: any = [];
  public StatusListSellerById: any = [];
  public StatusListBuyerById: any = [];
  public LinesFiledSeller = {} as any;
  public LinesFiledBuyer = {} as any;
  public formatDate: any;
  public p2: any;
  public p3: any;
  public selectedFile: any;
  public orderModified = {} as any;
  public activeTab: string = 'acheteur';
  private _unsubscribeAll: Subject<any> = new Subject();
  loadingOrdersOfBuyer = true;
  loadingOrdersOfSeller = true;
  public isStatusListBuyerByIdEmpty: boolean = true;
  public isStatusListSellerByIdEmpty: boolean = true;
  public selectedStatus: any;
  fieldLabelStatus: any;
  public modalstar: boolean = false;
  public modalcoment: boolean = false;
  modalType: string | null = null;
  stars: boolean[] = [false, false, false, false, false];
  public tempOrderModified = {} as any;
  public infoPut = {} as any;
  public refusalReason: any;
  public trackingUrl: any;
  public merchanComment: any;
  errors: any[] = [];
  public enableInputs : boolean = false;
  statusTooltipMessage: string = '';
  evalBuyerTooltipMessage: string = '';
  evalSellerTooltipMessage: string = '';



  constructor(
    private orderService: OrderService,
    private router: Router,
    private settingsService: RegionalSettingsService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getOrderFields();
    this.getAllOrdersBuyer();
    this.getAllOrdersSeller();

    this.settingsService.settingsChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (settings: any) => {
          if (settings?.language) {
            this.getOrderFields();
          }
        }
      });


  }

  getOrderFields(): any {
    this.listFieldSeller = [];
    this.listFieldBuyer = [];
    this.readControlFieldBuyer();
    this.readControlFieldSeller();

    if (localStorage.getItem('language') === 'fr') {
      this.formatDate = 'dd-MM-yyyy';
    } else {
      this.formatDate = 'yyyy-MM-dd';
    }
  }

  getAllOrdersSeller(): any {
    this.loadingOrdersOfSeller = true;
    this.orderService.getOrdersSeller()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((orders: any) => {
        this.ordersOfSeller = orders;
        this.loadingOrdersOfSeller = false;
        this.setStatusTooltipMessageForInitialOrder(); 
      });
  }

  getAllOrdersBuyer(): any {
    this.loadingOrdersOfBuyer = true;
    this.orderService.getOrdersBuyer()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((orders: any) => {
        this.ordersOfBuyer = orders;
        this.loadingOrdersOfBuyer = false;
        this.setStatusTooltipMessageForInitialOrder(); 
      });
  }





  setStatusTooltipMessageForInitialOrder(): void {
    const initialOrder = this.ordersOfSeller.length > 0 ? this.ordersOfSeller[0] : this.ordersOfBuyer[0];
    this.setStatusTooltipMessage(initialOrder);
  }
  
  setStatusTooltipMessage(order: any): void {
    if (order.is_completed === false) {
      this.statusTooltipMessage = this.translate.instant('commandes.status_not_completed');
      if(order.status != 22 ){
        this.evalBuyerTooltipMessage = this.translate.instant('commandes.rate_buyer_not_completed');
        this.evalSellerTooltipMessage = this.translate.instant('commandes.rate_seller_not_completed');
      }
      
    } else if (order.is_completed === true) {
      this.statusTooltipMessage = this.translate.instant('commandes.status_completed');
      if(order.status != 22 ){
      this.evalBuyerTooltipMessage = this.translate.instant('commandes.rate_buyer_completed');
      this.evalSellerTooltipMessage = this.translate.instant('commandes.rate_seller_completed');
      }
    }
  }

  getOrderSellerById(id: string): void {
    this.orderService.getOrderSellerById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (fields: any) => {
          const listPutSeller = fields.actions.PUT;
          if (listPutSeller) {
            this.infoPut = listPutSeller;
          }
          for (const [key, value] of Object.entries(listPutSeller)) {
            if (key === 'status') {
              this.StatusListSellerById = (value as any).choices;
            }
          }
        }
      });
  }



  getOrderBuyerById(id: string): void {
    this.orderService.getOrderBuyerById(id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (fields: any) => {
          const listPutBuyer = fields.actions.PUT;
          this.infoPut = listPutBuyer;
          for (const [key, value] of Object.entries(listPutBuyer)) {
            if (key === 'status') {
              this.StatusListBuyerById = (value as any).choices;
              break;
            }
          }
          this.initializeStars(this.orderModified.customer_note);
        }
      });
  }

  readControlFieldSeller(): any {
    this.listFieldSeller = [];
    this.orderService.getFieldsOrderSeller()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((fields: any) => {
        const list = fields.actions.GET;

        for (const [key, value] of Object.entries(list)) {
          this.listFieldSeller = [...this.listFieldSeller, { key, value }];
          if (key === 'status') {
            this.StatusListSeller = (value as any).choices;
            this.selectedFile = this.StatusListSeller[0];
          }

          if (key === 'lines') {
            this.LinesFiledSeller = (value as any).child.children.status.choices;
          }
        }

        this.listFieldSellerfiltred = this.listFieldSeller.filter((field: any) =>
          field.key === 'reference_number' ||
          field.key === 'taxless_total_price_seller' || field.key === 'created_on' || field.key === 'shop' ||
          field.key === 'status'
        );
        [this.listFieldSellerfiltred[0], this.listFieldSellerfiltred[1]] = [this.listFieldSellerfiltred[1], this.listFieldSellerfiltred[0]];
      });
  }

  readControlFieldBuyer(): any {
    this.listFieldBuyer = [];
    this.orderService.getFieldsOrderBuyer()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((fields: any) => {
        const list = fields.actions.GET;

        for (const [key, value] of Object.entries(list)) {
          this.listFieldBuyer = [...this.listFieldBuyer, { key, value }];
          if (key === 'status') {
            this.StatusListBuyer = (value as any).choices;
            this.selectedFile = this.StatusListBuyer[0];
          }
          if (key === 'lines') {
            this.LinesFiledBuyer = (value as any).child.children.status.choices;
          }
        }

        this.listFieldBuyerfiltred = this.listFieldBuyer.filter((field: any) =>
          field.key === 'reference_number' ||
          field.key === 'taxful_total_price_buyer' || field.key === 'created_on' || field.key === 'shop' ||
          field.key === 'status'
        );
        [this.listFieldBuyerfiltred[0], this.listFieldBuyerfiltred[1]] = [this.listFieldBuyerfiltred[1], this.listFieldBuyerfiltred[0]];
      });
  }

  gotoDetailBuyer(order: any): void {
    this.router.navigate(['/single-command'], { queryParams: { orderType: 'buyer', id: order.id } });
    localStorage.setItem('order', JSON.stringify(order));
    localStorage.setItem('orderType', 'buyer');
  }

  gotoDetailSeller(order: any): void {
    this.router.navigate(['/single-command'], { queryParams: { orderType: 'seller', id: order.id } });
    localStorage.setItem('order', JSON.stringify(order));
    localStorage.setItem('orderType', 'seller');
  }

  patchSeller(id: string, orderSeller: OrderSeller): any {
    this.errors = [];
    this.orderService.patchOrdersSeller(id, orderSeller)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (this.modalType === 'edit') {
            this.toaster.success(orderSeller.referenceNumber + ' ' + this.translate.instant('commandes.confirmation_status'));
          } else if (this.modalType === 'evalSeller') {
            this.toaster.success(orderSeller.referenceNumber + ' ' + this.translate.instant('commandes.confirmation_evaluation'));
          }
          this.getAllOrdersBuyer();
          this.getAllOrdersSeller();
          this.hideModal();
        },
        error: (err: any) => {
          if (err) {
            this.errors = [];
            for (const [key, value] of Object.entries(err.error)) {
              this.errors.push({ key, value });
            }
          } if (Array.isArray(err.error)) {
            this.errors.push(err.error);
            }
        }
      });
  }
  
  patchBuyer(id: string, orderBuyer: OrderBuyer): any {
    this.errors = [];
    this.orderService.patchOrdersBuyer(id, orderBuyer)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          if (this.modalType === 'edit') {
            this.toaster.success(orderBuyer.referenceNumber + ' ' + this.translate.instant('commandes.confirmation_status'));
          } else if (this.modalType === 'evalBuyer') {
            this.toaster.success(orderBuyer.referenceNumber + ' ' + this.translate.instant('commandes.confirmation_evaluation'));
          }
          this.getAllOrdersBuyer();
          this.getAllOrdersSeller();
          this.hideModal();
        },
        error: (err: any) => {
          if (err) {
            this.errors = [];
            for (const [key, value] of Object.entries(err.error)) {
              this.errors.push({ key, value });
            }
          } if (Array.isArray(err.error)) {
            this.errors.push(err.error);
            }
        }
      });
  }
  
 

  patchOrder(order: any): any {
    if (order.taxful_total_price_buyer) {
      this.patchBuyer(order.id, order);
    }
    if (order.taxful_total_price_seller) {
      this.patchSeller(order.id, order);
    }
  }

  onchangestatus(event: any): void {
    this.orderModified.status = event.value;
    this.enableInputs = this.orderModified.status == '21';

    if(this.orderModified.status == '22'){
      if(this.orderModified.refusal_reason){
        this.orderModified.refusal_reason ="";
      }
    }
  }
  

  showModal(order: any): void {
    this.orderModified = { ...order };
    this.modalType = 'edit';
    this.orderModified.status = null;
    document.querySelector('body')?.classList.add('overlflow');
    if (order.taxful_total_price_buyer) {
      this.getOrderBuyerById(order.id);
    }
    if (order.taxful_total_price_seller) {
      this.getOrderSellerById(order.id);
    }
  }

  showModalEvalBuyer(order: any) {
    this.orderModified = order ;
    this.modalType = 'evalBuyer';
    document.querySelector('body')?.classList.add('overlflow');
    this.initializeStars(order.customer_note);
    if (order.taxful_total_price_buyer) {
      this.getOrderBuyerById(order.id);
    }
  }

  showModalEvalSeller(order: any) {
    this.orderModified = order;
    this.modalType = 'evalSeller';
    document.querySelector('body')?.classList.add('overlflow');
    if (order.taxful_total_price_seller) {
      this.getOrderSellerById(order.id);
    }
  }

  hideModal() {
    this.modalType = null;
    document.querySelector('body')?.classList.remove('overlflow');
  }

  rateStar(index: number) {
    this.stars = this.stars.map((_, i) => i <= index);
    this.orderModified.customer_note = index + 1;
  }

  sendRatingBuyer(id: string, orderBuyer: OrderBuyer) {
    const currentOrder = this.ordersOfBuyer.find(order => order.id === id);
    if (currentOrder) {
      orderBuyer.status = currentOrder.status;
      this.patchBuyer(id, orderBuyer);
    }
  }

  sendCommentSeller(id: string, orderSeller: OrderSeller) {
    const currentOrder = this.ordersOfSeller.find(order => order.id === id);
    if (currentOrder) {
      orderSeller.status = currentOrder.status;
       this.patchSeller(id, orderSeller);
    }
  }

  sendComment(order: any): any {
    if (order.taxful_total_price_buyer) {
      this.sendRatingBuyer(order.id, order);
    } else if (order.taxful_total_price_seller) {
      this.sendCommentSeller(order.id, order);
    }
  }
  initializeStars(note?: number): void {
    this.stars = [false, false, false, false, false]; 
    if (note != null && note > 0) { 
      for (let i = 0; i < note; i++) {
        this.stars[i] = true; 
      }
    }
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
