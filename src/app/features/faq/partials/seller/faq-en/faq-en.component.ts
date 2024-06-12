import { Component } from '@angular/core';
import {map} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-faq-seller-en',
  templateUrl: './faq-en.component.html',
  styleUrls: ['./faq-en.component.scss']
})
export class FaqSellerEnComponent {
  sub = this.ar.fragment.pipe(
      map((params)=>{
        return {
          affiliate: params === 'affiliate',
          ambassador: params === 'ambassador'
        }
      })
  )
  constructor(private ar: ActivatedRoute) {

  }
}
