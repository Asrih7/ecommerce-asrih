import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, tap} from "rxjs/operators";

@Component({
  selector: 'app-faq-buyer-fr',
  templateUrl: './faq-fr.component.html',
  styleUrls: ['./faq-fr.component.scss']
})
export class FaqBuyerFrComponent {

  sub = this.ar.fragment.pipe(
      map((params)=>{
        return {
          delivery: params === 'delivery',
          return: params === 'return',
          payment: params === 'payment',
        }
      })
  )
  constructor(private ar: ActivatedRoute) {

  }


}
