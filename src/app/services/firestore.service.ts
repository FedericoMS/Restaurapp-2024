import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Empleado } from '../clases/empleado';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}
  storage: AngularFireStorage = inject(AngularFireStorage);

  //Agregar un empleado
  async addUsuario(emp: Empleado) {
    const colImagenes = this.firestore.collection('usuarios');
    const documento = colImagenes.doc();
    emp.id = documento.ref.id;
    await documento.set({ ...emp });
  }

  //Obtener los empleados
  getUsuario() {
    const col = this.firestore.collection('usuarios');
    return col;
  }

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  updateUser(usuario: any) {
    return this.firestore
      .doc<any>(`usuarios/${usuario.uid}`)
      .update(usuario);
  }
}
