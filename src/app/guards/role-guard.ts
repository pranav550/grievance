import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {


  constructor(private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const admin = localStorage.getItem('isAdmin');

    if (admin) {
      return true;
    }

    // navigate to not found page
    this._router.navigate(['/404']);
    return false;
  }

}
