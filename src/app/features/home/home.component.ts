import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  token: any;
  uidb64: any;
  behavoirSubscribe: Subscription[] = [];

  constructor(private routerActive: ActivatedRoute) { }

  ngOnInit(): void {
    this.token = this.routerActive.snapshot.params["token"];
    this.uidb64 = this.routerActive.snapshot.params["uidb64"];

  }

  ngOnDestroy(): void {
    this.behavoirSubscribe.map((subject) => subject.unsubscribe());
  }
}
