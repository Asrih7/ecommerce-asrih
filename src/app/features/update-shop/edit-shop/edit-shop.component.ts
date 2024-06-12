import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.scss']
})
export class EditDetailShopComponent {
  @Input() shopCurrent: any;
  @Input() newImgChange: any;
}
