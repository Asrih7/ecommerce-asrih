import { Component } from '@angular/core';
import {map} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import { timer } from 'rxjs';

@Component({
  selector: 'app-faq-seller-fr',
  templateUrl: './faq-fr.component.html',
  styleUrls: ['./faq-fr.component.scss']
})
export class FaqSellerFrComponent {
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
