import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../service/photo.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  restaurants$: Observable<any[]> = of([]); // Inicializa con un observable vacío

  constructor(public photoService: PhotoService) {}

  ngOnInit() {
    this.loadRestaurants();
  }

  loadRestaurants() {
    this.restaurants$ = this.photoService.getRestaurants();
  }

  deleteRestaurant(index: number) {
    // Implementa la lógica para eliminar el restaurante
  }
}
