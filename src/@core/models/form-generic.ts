import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

export class FormGeneric {
    group = {} as FormGroup;

    constructor(private fb: FormBuilder, private formModel?: any) {
        if (fb && formModel) {
            this.group = this.fb.group(this.formModel);
        }
    }

    populateForm(object: any): any {
        this.group.patchValue(object);
    }

    assign(object: any): any {
        const value = this.group.value;
        _.assign(object, value);
    }

    hasErrorAfterTouched(fieldName: string, errorType: string): boolean | undefined | null {
        return this.group.get(fieldName)?.touched && this.group.get(fieldName)?.hasError(errorType);
    }

    hasErrorAfterTouchedRequired(fieldName: string): boolean | undefined | null {
        return this.hasErrorAfterTouched(fieldName, 'required');
    }

    getFieldValue(fieldName: string): any {
        return this.group.get(fieldName)?.value;
    }

}
