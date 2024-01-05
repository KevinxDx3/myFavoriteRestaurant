import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@NgModule({
  declarations: [LoginComponent],
  imports: [FormsModule], // Agrega FormsModule a los imports
  // Otros imports y configuraciones
})
export class LoginModule {}
