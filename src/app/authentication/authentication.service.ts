// authentication.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  user$: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.afAuth.authState;
  }

  async signIn(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/tabs']); // Redirige al usuario después de iniciar sesión
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Puedes manejar el error aquí o lanzar una excepción para manejarlo en el componente
      throw error;
    }
  }

  async signOut() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']); // Redirige al usuario después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
