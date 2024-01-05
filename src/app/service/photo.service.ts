import { Injectable } from '@angular/core';
import { Camera, CameraSource, Photo, CameraResultType } from '@capacitor/camera';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActionSheetController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(
    private firestore: AngularFirestore,
    private actionSheetController: ActionSheetController,
    private storage: AngularFireStorage,
  ) { }

  async isCameraAvailable(): Promise<boolean> {
    const cameraPermissions = await Camera.checkPermissions();
    return cameraPermissions.camera === 'granted';
  }

  async uploadImage(imageData: string): Promise<string | null> {
    const path = `your-storage-path/${new Date().getTime()}.png`; // Cambia "your-storage-path"
    const ref = this.storage.ref(path);

    try {
      const task = await ref.putString(imageData, 'data_url', { contentType: 'image/png' });
      const downloadURL = await task.ref.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return null;
    }
  }


  async selectImageSource(): Promise<CameraSource | null> {
    const buttons = [
      {
        text: 'Usar Cámara',
        handler: () => CameraSource.Camera,
      },
      {
        text: 'Seleccionar de la Galería',
        handler: () => CameraSource.Photos,
      },
    ];

    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar fuente de la imagen',
      buttons: buttons as any,
    });

    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    return role === 'cancel' ? null : role as CameraSource;
  }

  async takePhoto(source: CameraSource): Promise<Photo | undefined> {
    try {
      const capturePhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source,
        quality: 100,
      });
  
      // Devuelve el objeto Photo actualizado
      return {
        base64String: capturePhoto.base64String,
        format: capturePhoto.format,
        saved: false, // Puedes ajustar esto según tus necesidades
      };
    } catch (error) {
      console.error('Error al capturar la foto desde la cámara.', error);
      return undefined;
    }
  }



  async selectImage(): Promise<Photo | undefined> {
    const selectedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100,
    });

    return selectedPhoto;
  }




  async addNewToGallery() {
    const capturePhoto = await this.takePhoto(CameraSource.Camera);
    if (capturePhoto) {
      const downloadURL = await this.uploadImage(capturePhoto.base64String || '');
      if (downloadURL) {
        const restaurant = { name: 'Nuevo Restaurante', description: 'Descripción del restaurante', image: downloadURL };
        await this.addRestaurant(restaurant);
      }
    }
  }


  // Método para obtener la lista de restaurantes
  getRestaurants(): Observable<any[]> {
    return this.firestore.collection('restaurants').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  // Método para agregar un restaurante
  addRestaurant(restaurant: any): Promise<any> {
    return this.firestore.collection('restaurants').add(restaurant);
  }

  // Método para eliminar un restaurante
  deleteRestaurant(id: string): Promise<void> {
    return this.firestore.collection('restaurants').doc(id).delete();
  }
}
