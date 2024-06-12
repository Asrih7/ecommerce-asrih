import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-indicator',
  templateUrl: './loader-indicator.component.html',
  styleUrls: ['./loader-indicator.component.scss']
})
export class LoaderIndicatorComponent implements OnInit {
  @Input() bg: string = "";
  constructor() { }

  ngOnInit(): void {
  }

}
