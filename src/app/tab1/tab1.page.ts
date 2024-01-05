// tab1.page.ts
import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../service/photo.service';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  restaurants: any[] = [];

  constructor(
    public photoService: PhotoService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.loadRestaurants();
  }

  async loadRestaurants() {
    this.photoService.getRestaurants().subscribe((restaurants) => {
      this.restaurants = restaurants;
    });
  }

  async deleteRestaurant(id: string) {
    try {
      await this.photoService.deleteRestaurant(id);
      console.log('Restaurante eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el restaurante:', error);
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            // Aquí deberías implementar la lógica para confirmar y luego llamar a deleteRestaurant
            console.log('Eliminar restaurante');
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        }
      ]
    });
    await actionSheet.present();
  }
}
