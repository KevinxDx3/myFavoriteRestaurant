import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthenticationService, private router: Router) {}

  async onSubmit() {
    try {
      await this.authService.signIn(this.email, this.password);
      // Si el inicio de sesión es exitoso, redirige al usuario a la página de los tabs
      this.router.navigate(['/tabs']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Maneja el error de inicio de sesión si es necesario
    }
  }
}
