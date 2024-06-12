import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import _ from 'lodash';
// import { FormGeneric } from 'src/@core/models/form-generic';
// import { ShortDatePipe } from 'src/app/shared/pipes/short-date.pipe';
// import { ShareableObjectsService } from 'src/@core/services/shareable-objects.service';
// import { scrollTop0 } from 'src/@core/utils/helpers';
// import { Profile } from 'src/@core/models/profile';

@Component({
  selector: 'app-first-step',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss']
})
export class FirstStepComponent implements OnInit {
  @Output() accessFirstStep: EventEmitter<number> = new EventEmitter();
  @Output() languageStore: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  updateUser(): any {
    this.accessFirstStep.emit(1);
  }
}
