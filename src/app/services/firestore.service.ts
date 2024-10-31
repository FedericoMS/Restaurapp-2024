import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
} from '@angular/fire/storage';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}
  storage: AngularFireStorage = inject(AngularFireStorage);

  //Agregar un usuario
  async addUsuario(user : Usuario) {
    const colImagenes = this.firestore.collection('usuarios');
    const documento = colImagenes.doc();
    user.id = documento.ref.id;
    await documento.set({ ...user });
  }

  //Obtener los usuarios
  getUsuarios() : any {
    const col = this.firestore.collection('usuarios').valueChanges();
    return col;
  }

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  updateUserByUID(usuario: any) {
    return this.firestore
      .doc<any>(`usuarios/${usuario.uid}`)
      .update(usuario);
  }

  updateUser(usuario: any) {
    return this.firestore
      .doc<any>(`usuarios/${usuario.id}`)
      .update(usuario);
  }

  getUserProfile(userId: string) {
    return this.firestore.collection('usuarios').doc(userId).get();
  }
}
