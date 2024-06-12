export interface ConfirmResetPassword {
    newPassword1: string;
    newPassword2: string;
    message: string;
}
export interface SetPasswordPartial {
    password: string;
    newPassword1: string;
    newPassword2: string;
    message: string;
}
export interface SetEmailPartial {
    current_email: string;
    new_email1: string;
    new_email2: string;
    message: string;
}
