import { Component } from '@angular/core';
import { PhotoService } from '../service/photo.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  newRestaurant = { name: '', description: '', image: '' };

  constructor(
    private actionSheetController: ActionSheetController,
    public photoService: PhotoService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  async uploadImage(base64Data: string | undefined, path: string): Promise<string> {
    if (!base64Data) {
      throw new Error('Base64 Data no definido');
    }

    const storagePath = `restaurants/${path}`;
    const ref = this.storage.ref(storagePath);

    // Convierte el Base64 a Blob
    const blob = this.base64toBlob(base64Data);

    // Sube el Blob a Storage
    const task = ref.putString(base64Data, 'base64', { contentType: 'image/png' });

    return new Promise<string>((resolve, reject) => {
      task.then((snapshot: firebase.default.storage.UploadTaskSnapshot) => {
        snapshot.ref.getDownloadURL().then((url: string) => {
          resolve(url);
        });
      }).catch((error: any) => {
        console.error('Error al subir la imagen:', error);
        reject(error);
      });
    });
  }

  private base64toBlob(base64Data: string): Blob | null {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
  
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'image/png' });
    } catch (error) {
      console.error('Error al convertir Base64 a Blob:', error);
      return null;
    }
  }
  

  async convertBlobFormat(blobData: any, newFormat: string): Promise<Blob | null> {
    return new Promise((resolve) => {
      const img = new Image();

      // Manejar la carga de la imagen
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, img.width, img.height);

        // Convertir el lienzo a Blob con el nuevo formato
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(null);
          }
        }, newFormat);
      };

      // Manejar el error al cargar la imagen
      img.onerror = (error) => {
        console.error('Error al cargar la imagen:', error);
        resolve(null);
      };

      // Establecer la fuente de la imagen como la cadena de datos
      img.src = 'data:image/jpeg;base64,' + blobData;
    });
  }


  async addPhotoToGallery() {
    try {
      const isCameraAvailable = await this.photoService.isCameraAvailable();
  
      if (isCameraAvailable) {
        const source = await this.photoService.selectImageSource();
  
        if (source !== null) {
          const capturePhoto = await this.photoService.takePhoto(source);
  
          if (capturePhoto && capturePhoto.base64String) {
            this.newRestaurant.image = capturePhoto.base64String;
          } else {
            console.error('Error al capturar la foto desde la cámara.');
          }
        }
      } else {
        const selectedPhoto = await this.photoService.selectImage();
  
        if (selectedPhoto && selectedPhoto.base64String) {
          this.newRestaurant.image = selectedPhoto.base64String;
        } else {
          console.error('Error al seleccionar la foto desde la galería.');
        }
      }
    } catch (error) {
      console.error('Error al capturar la foto:', error);
    }
  }
  
  

  async addRestaurant() {
    try {
      // Asegúrate de tener la propiedad 'image' en newRestaurant
      if (!this.newRestaurant.image) {
        console.error('La propiedad image en newRestaurant no está definida.');
        return;
      }
  
      const downloadURL = await this.uploadImage(
        this.newRestaurant.image,
        this.newRestaurant.name  // Puedes usar el nombre como 'path'
      );
  
      if (downloadURL) {
        // Almacena la URL de descarga en la base de datos, en lugar de la URL temporal local
        this.newRestaurant.image = downloadURL;
  
        // Añade el restaurante a la base de datos de Firestore
        await this.firestore.collection('restaurants').add(this.newRestaurant);
  
        // Limpia los campos después de agregar el restaurante
        this.newRestaurant = { name: '', description: '', image: '' };
  
        console.log('Restaurante agregado a Firebase');
      } else {
        console.error('No se pudo obtener la URL de descarga de la imagen.');
      }
    } catch (error) {
      console.error('Error al agregar el restaurante:', error);
    }
  }

}
