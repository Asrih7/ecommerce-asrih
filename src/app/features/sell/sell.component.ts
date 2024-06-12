import { Component } from '@angular/core';
import { scrollTop0 } from 'src/@core/utils/helpers';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent {
  constructor(
  ) { }

  goSectionSellers(): any {
    scrollTop0();
  }
}
