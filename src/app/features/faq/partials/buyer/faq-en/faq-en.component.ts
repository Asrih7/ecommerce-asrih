import { Component } from '@angular/core';
import {map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-faq-buyer-en',
  templateUrl: './faq-en.component.html',
  styleUrls: ['./faq-en.component.scss']
})
export class FaqBuyerEnComponent {

  sub = this.ar.fragment.pipe(
      map((params)=>{
        // document.getElementById('params').scrollIntoView();
        this.router.navigate([], { fragment: params || '' });
        return {
          delivery: params === 'delivery',
          return: params === 'return',
          payment: params === 'payment',
        }
      })
  )
  constructor(private ar: ActivatedRoute, private router : Router) {

  }

}
