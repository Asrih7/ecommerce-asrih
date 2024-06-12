import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormGeneric } from 'src/@core/models/form-generic';
import { SHOP_INFOS } from 'src/@core/models/form.model';
import * as _ from 'lodash';
import { Shop } from 'src/@core/models/shop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ambassador-second-step',
  templateUrl: './ambassador-second-step.component.html',
  styleUrls: ['./ambassador-second-step.component.scss']
})
export class AmbassadorSecondStepComponent implements OnInit, OnChanges {
  @Input() ambassadorFileds: any;
  @Input() submitFormCheck: any;
  @Input() errors: any;
  @Input() shopCurrent: Shop | undefined;
  errorObg = {};
  errs = [];
  form: FormGeneric = new FormGeneric(this.fb);
  @Output() formAmbassadorShared: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder, private router: Router) {
    this.form.group = this.fb.group(SHOP_INFOS);
    this.form?.group.get('ambassador')?.valueChanges.subscribe(
      {
        next: (value) => {
          this.formAmbassadorShared.emit(value)
        }
      })
  }

  ngOnInit(): void {
  }
  ngOnChanges(): void {
    if (this.errors) {
      this.errors.forEach((element: any) => {
        this.errorObg = element.value;
      });
      for (const [key, value] of Object.entries(this.errorObg)) {
        this.errors = [...this.errors, { key, value }];
      }
      this.errors = _.uniqBy(this.errors, 'key');
    }
    if (this.submitFormCheck) {
      this.formAmbassadorShared.emit(this.form.group.value);
    }
  }
}
