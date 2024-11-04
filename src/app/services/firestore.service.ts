import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
} from '@angular/fire/storage';
import { Encuesta } from '../clases/encuesta';
import { Usuario } from '../clases/usuario';
import { arrayUnion } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}
  storage: AngularFireStorage = inject(AngularFireStorage);

  //Agregar un usuario
  async addUsuario(user: Usuario) {
    const colImagenes = this.firestore.collection('usuarios');
    const documento = colImagenes.doc();
    user.id = documento.ref.id;
    await documento.set({ ...user });
  }

  //Obtener los usuarios
  getUsuarios(): any {
    const col = this.firestore.collection('usuarios').valueChanges();
    return col;
  }

  getMesas(): any {
    const col = this.firestore.collection('mesas').valueChanges();
    return col;
  }

  getPedidos(): any {
    const col = this.firestore.collection('pedidos').valueChanges();
    return col;
  }

  //Encuesta
  async addEncuesta(
    encuesta: Encuesta,
    collection: 'clientes' | 'empleados' | 'supervisor' = 'clientes'
  ) {
    const encuestas = this.firestore.collection('encuesta_' + collection);
    const documento = encuestas.doc(encuesta['question']);
    await documento.set({ ...encuesta });
  }

  //Obtner cualquier collection
  getCollection(path: string) {
    const col = this.firestore.collection(path);
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
    return this.firestore.doc<any>(`usuarios/${usuario.uid}`).update(usuario);
  }

  
  updateUser(usuario: any) {
    return this.firestore.doc<any>(`usuarios/${usuario.id}`).update(usuario);
  }
  
  updateOrder(pedido: any) {
    return this.firestore.doc<any>(`pedidos/${pedido.id}`).update(pedido);
  }
    

  getUserProfile(userId: string) {
    return this.firestore.collection('usuarios').doc(userId).get();
  }

// Método todavía no testeado.
async addProductosAPedido(id: string, productos: { nombre: string, precio: number }[]) {
  try {
    // Usa arrayUnion para agregar los productos sin sobrescribir el contenido existente
    await this.firestore.doc(`pedidos/${id}`).update({
      listaProductos: arrayUnion(...productos)
    });
    console.log('Productos añadidos al pedido exitosamente');
  } catch (error) {
    console.error('Error al añadir productos al pedido: ', error);
  }
}

  

}
