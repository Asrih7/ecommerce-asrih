import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { PermissionsService } from "../services/permissions.service";

export const canActivateRoute: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(PermissionsService).canActivate(state.url);
    };