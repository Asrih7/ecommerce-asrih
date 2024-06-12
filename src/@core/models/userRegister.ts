import { HttpErrorResponse } from '@angular/common/http';

export interface UserRegister {
    firstName: string;
    lastName: string;
    email?: string;
    code?: string;
    password: string;
}
export interface APIErrorResponse extends HttpErrorResponse {
    error: {
        links?: [];
    };
}
