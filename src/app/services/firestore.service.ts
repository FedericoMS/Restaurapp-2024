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
import {  Firestore, collection, collectionData,query,orderBy, addDoc} from '@angular/fire/firestore';
import { map } from 'rxjs';
import { arrayUnion } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore, private fs : Firestore) {}
  storage: AngularFireStorage = inject(AngularFireStorage);

  //Agregar un usuario
  async addObject(object: any, databaseName : string) {
    const colImagenes = this.firestore.collection(databaseName);
    const documento = colImagenes.doc();
    object.id = documento.ref.id;
    await documento.set({ ...object });
  } 


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
  
  /*getProductos(): any {
    const col = this.firestore.collection('productos').valueChanges();
    return col;
  }*/

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

  getUserProfile(userId: string) {
    return this.firestore.collection('usuarios').doc(userId).get();
  }


  updateDatabase(colection : string, object: any) {
    return this.firestore.doc<any>(`${colection}/${object.id}`).update(object);
  }
    
  removeObjectDatabase(colection : string, id: any){
    return this.firestore.doc<any>(`${colection}/${id}`).delete();
  }
 
  getMessages(): any {
    const data = query(collection(this.fs, 'chats'), orderBy('time', 'asc'));
    return collectionData<any>(data)
    .pipe(map( (messages : any) => {
        return messages.map( (message : any) => ({
          username: message.username,
          message: message.message,
          time: message.time.toDate(),
          id_user: message.id_user,
          nroMesa: message.nroMesa
        }));
      })
    ) 
  }

  sendMessage(username : string, message: string, id_user:string, nroMesa:number) : void
  {
    try {
      const date = new Date();
      addDoc(collection(this.fs,"chats"),{
        username: username,
        message: message,
        time: date,
        id_user: id_user,
        nroMesa: nroMesa
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }



  
  updateUser(usuario: any) {
    return this.firestore.doc<any>(`usuarios/${usuario.id}`).update(usuario);
  }
  
  updateOrderAndProducts(pedido: any, nuevoEstadoPedido: string, nuevoEstadoProductos: string) {
    pedido.estado = nuevoEstadoPedido;
    pedido.listaProductos = pedido.listaProductos.map((producto: any) => ({
      ...producto,
      estado: nuevoEstadoProductos
    }));
    return this.firestore.doc<any>(`pedidos/${pedido.id}`).update(pedido);
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
