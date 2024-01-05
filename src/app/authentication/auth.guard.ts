import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.afAuth.authState.pipe(take(1)).subscribe((user) => {
        if (user) {
          // El usuario está autenticado
          resolve(true);
        } else {
          // El usuario no está autenticado, redirige a la página de inicio de sesión
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
