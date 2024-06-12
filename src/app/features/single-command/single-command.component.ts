import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormGeneric } from 'src/@core/models/form-generic';
import { MESSAGE_FORM } from 'src/@core/models/form.model';
import { Message } from 'src/@core/models/message';
import { AuthService } from 'src/@core/services/auth.service';
import { MessagesService } from 'src/@core/services/messages.service';
import { OrderService } from 'src/@core/services/order.service';
import _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { RegionalSettingsService } from 'src/@core/services/regional-settings.service';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-single-command',
  templateUrl: './single-command.component.html',
  styleUrls: ['./single-command.component.scss']
})
export class SingleCommandComponent implements OnInit {
  type: string = "";
  orderType: string = "";
  order = {} as any;
  showContact = false;
  errors: any = [];
  lines = { 'product': '', 'quantity': "" } as any;
  ordersOfSeller: any = [];
  ordersOfBuyer: any = [];
  listFieldSeller: any = [];
  listFieldSellerfiltred: any = [];
  listFieldBuyerfiltred: any = [];
  listFieldBuyer: any = [];
  StatusListSeller: any = [];
  StatusListBuyer: any = [];
  LinesFiledSeller: any = {} as any;
  LinesFiledBuyer = {} as any;
  labelsDetails: any = { 'billing_address': "", 'shipping_address': "", 'shop': "", 'reference_number': "" };
  dateOrder: any;
  formData: any;
  formDataNoImage: any;
  message = {} as Message;
  form: FormGeneric = new FormGeneric(this.fb);
  file: any;
  fileUploaded: any;
  typeFileUploaded = false;
  id: any;
  OrderLines = [] as any;
  shippingList = [] as any;
  DiscountList = [] as any;
  RefundList = [] as any;
  ExchangeList = [] as any;
  arr: any;
  orderId: any;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private datePipe: DatePipe,
    private messagesService: MessagesService,
    private authService: AuthService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private settingsService: RegionalSettingsService
) {
    this.form.group = this.fb.group(MESSAGE_FORM);
  }

  ngOnInit(): void {
    this.orderType = this.route.snapshot.queryParams['orderType'];
    this.orderId = this.route.snapshot.queryParams['id'];
    this.getDetailsOrder();
    this.id = this.authService.getIdOfConnectedUser();
  }
  getCountryInformation(codeCountry:string){
    let infoCountry;
    this.settingsService.listCountries$.subscribe(data => {      
      infoCountry=data.find((el:any)=>el.value==codeCountry)?.display_name
    })
    return infoCountry;
   }
  getDetailsOrder(): any {
    this.type = localStorage.getItem('orderType') || "";
    if (this.type === 'buyer') {

      this.orderService.getOrdersBuyerById(this.orderId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((detailsOrderBuyer: any) => {
        this.order = detailsOrderBuyer;
        this.dateOrder = this.datePipe.transform(new Date(this.order.created_on));
        this.readControlFieldBuyer();
        this.prepareLigneCommande(this.order);
      });
     


    } else if (this.type === 'seller') {

      this.orderService.getOrdersSellerById(this.orderId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((detailsOrderSeller: any) => {
        this.order = detailsOrderSeller;
        this.dateOrder = this.datePipe.transform(new Date(this.order.created_on));
        this.readControlFieldSeller();
        this.prepareLigneCommande(this.order);
      });
      
    }

  }

  readControlFieldSeller(): any {
    this.orderService.getFieldsOrderSeller()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((fields: any) => {     
       const list = fields.actions.GET;
      for (const [key, value] of Object.entries(list)) {
        this.listFieldSeller = [...this.listFieldSeller, { key, value }];
      }
      this.listFieldSeller.forEach((element: any) => {
        if (element.key === 'status') {
          this.StatusListSeller = element.value.choices;
        }
        if (element.key === 'lines') {
          this.LinesFiledSeller = element.value.child.children;
          // this.sharedService.lineSeller$.next(this.LinesFiledSeller);
          this.lines = element.value.child.children;
        }
        if (element.key === 'billing_address') {
          this.labelsDetails.billing_address = element.value.label;
        }
        if (element.key === 'shipping_address') {
          this.labelsDetails.shipping_address = element.value.label;
        }
        if (element.key === 'shop' || element.key === 'reference_number' || element.key === 'gateway_commission' || element.key === 'gateway_commission' || element.key === 'affiliation_commission') {
          this.labelsDetails[element.key] = element.value.label;
        }

      });
      this.listFieldSellerfiltred = this.listFieldSeller.filter((field: any) =>
        field.key === 'reference_number' || field.key === 'delay_to_receive_order' ||
        field.key === 'taxless_total_price_seller' || field.key === 'taxless_total_price_seller_currency' ||
        field.key === 'is_completed' || field.key === 'status'
      );
    });
  }

  readControlFieldBuyer(): any {
    this.orderService.getFieldsOrderBuyer()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((fields: any) => {
      const list = fields.actions.GET;
      for (const [key, value] of Object.entries(list)) {
        this.listFieldBuyer = [...this.listFieldBuyer, { key, value }];
      }

      this.listFieldBuyerfiltred = this.listFieldBuyer.filter((field: any) =>
        field.key === 'reference_number' || field.key === 'delay_to_receive_order' ||
        field.key === 'taxful_total_price_buyer' || field.key === 'taxful_total_price_buyer_currency' ||
        field.key === 'is_completed' || field.key === 'status'
      );

      this.listFieldBuyer.forEach((element: any) => {
        if (element.key === 'status') {
          this.StatusListBuyer = element.value.choices;
        }
        if (element.key === 'lines') {
          this.LinesFiledBuyer = element.value.child.children;
          // this.sharedService.lineBuyer$.next(this.LinesFiledBuyer);
          this.lines = element.value.child.children;
        }
        if (element.key === 'billing_address') {
          this.labelsDetails.billing_address = element.value.label;
        }
        if (element.key === 'shipping_address') {
          this.labelsDetails.shipping_address = element.value.label;
        }
        if (element.key === 'shop' || element.key === 'reference_number' || element.key === 'gateway_commission' || element.key === 'affiliation_commission') {
          this.labelsDetails[element.key] = element.value.label
        }
      });
    });
  }

  clearCache(event: any) {
    event.target.value = null
  }

  openConatct(): any {
    this.showContact = !this.showContact;
  }

  sendMessage(): any {
    this.errors = [];
    this.prepareObjMessage();
    if (this.file) {
      this.prepareMessageWithImage(this.message, this.id);
      this.messagesService.postMessage(this.formData).subscribe(() => {
        this.fileUploaded = '';
        this.typeFileUploaded = false;
        this.form.group.reset();
        this.file = undefined;
        this.openConatct();
        this.toaster.success(this.translate.instant('messages.success'));
      },
        (err) => {
          if (err.status === 400) {
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
            }
          }
        }
      );
    } else {
      this.prepareMessageNoImage(this.message, this.id);
      this.messagesService.postMessage(this.formDataNoImage).subscribe(() => {
        this.form.group.reset();
        this.openConatct();
        this.toaster.success(this.translate.instant('messages.success'));
      },
        (err) => {
          if (err.status === 400) {
            for (const [key, value] of Object.entries(err.error)) {
              this.errors = [...this.errors, { key, value }];
            }
          }
        }
      );
    }
  }

  prepareObjMessage(): any {
    if (this.type === 'seller') {
      this.message = {
        body: this.form.group.get('body')?.value,
        file: this.fileUploaded,
        recipient: this.order.customer,
        recipient_name: this.order.shop,
        sender: this.id
      };
    } else {
      this.message = {
        body: this.form.group.get('body')?.value,
        file: this.fileUploaded,
        recipient: this.order.seller,
        recipient_name: this.order.shop,
        sender: this.id
      };
    }
  }

  prepareMessageWithImage(message: any, id: any): any {
    this.formData = new FormData();
    this.formData.append('body', message.body);
    this.formData.append('recipient', message.recipient);
    this.formData.append('file', this.file);
    this.formData.append('sender', id);
  }

  prepareMessageNoImage(message: any, id: any): any {
    this.formDataNoImage = new FormData();
    if (!_.isEmpty(this.form.group.get('body')?.value)) {
      this.formDataNoImage.append('body', message.body);
    }
    this.formDataNoImage.append('recipient', message.recipient);
    this.formDataNoImage.append('sender', id);
  }

  deleteImage(): void {
    this.fileUploaded = '';
    this.typeFileUploaded = false;
    delete this.file;
  }

  editPicture(e: any): any {
    this.file = undefined;
    this.file = e.target.files[0];
    const reader = new FileReader();
    document.getElementById("msg")?.focus();
    if (this.file.type.includes('image')) {
      this.typeFileUploaded = true;
      reader.onloadend = () => {
        this.fileUploaded = reader.result;
      };
    } else {
      this.typeFileUploaded = false;
      this.fileUploaded = this.file.name;
    }
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
    this.formData = new FormData();
  }

  prepareLigneCommande(order: any): any {
    order.lines.forEach((element: any) => {
      if (element.type === 1) {

        this.OrderLines.push(element);
      } else if (element.type === 2) {
        this.shippingList.push(element);
      } else if (element.type === 3) {
        this.DiscountList.push(element);
      } else if (element.type === 4) {
        this.RefundList.push(element);
      } else if (element.type === 5) {
        this.ExchangeList.push(element);
      }


    });

  }

  prepaCustomization(val: string): any {
    var re = /'/gi;
    var newstr = val.replace(re, '"');
    return JSON.parse(newstr);
  }

  checkString(str: string): boolean {
    if (str.includes('customization')) {
      return true;

    } else {
      return false;
    }
  }
}
