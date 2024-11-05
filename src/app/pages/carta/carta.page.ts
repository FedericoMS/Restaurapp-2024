import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-carta',
  templateUrl: './carta.page.html',
  styleUrls: ['./carta.page.scss'],
  standalone: true,
  schemas : [CUSTOM_ELEMENTS_SCHEMA] ,
  imports: [IonButton, IonCol, IonRow, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonList, IonSegmentButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CartaPage implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  carrito: any[] = []; 
  filtroActual: string = 'todo';
  total: number = 0;
  nroMesa: number = 0; 
  idCliente : any = ''

  constructor(private firestoreService: FirestoreService, private userService : UserService) {}

  ngOnInit() {
    this.cargarProductos();
    this.idCliente = this.userService.getProperty('id');
  }

  cargarProductos() {
    this.firestoreService.getCollection('productos').valueChanges().subscribe((data: any) => {
      this.productos = data;
      this.filtrarProductos();
    });
  }

  filtrarProductos() {
    if (this.filtroActual === 'todo') {
      this.productosFiltrados = this.productos;
    } else {
      console.log("hola");
      this.productosFiltrados = this.productos.filter(producto => producto.tipo === this.filtroActual);
    }
  }

  agregarProducto(producto: any) {
    const productoEnCarrito = this.carrito.find(item => item.nombre === producto.nombre);
    if (!productoEnCarrito) {
      this.carrito.push({ nombre: producto.nombre, tiempoPreparacion: producto.tiempoPreparacion });
      this.total += producto.precio;
    }
  }

  quitarProducto(producto: any) {
    const index = this.carrito.findIndex(item => item.nombre === producto.nombre);
    if (index > -1) {
      this.carrito.splice(index, 1);
      this.total -= producto.precio;
    }
  }

  async realizarPedido() {
    if (this.carrito.length === 0) {
      this.userService.showToast('El carrito está vacío', 'red', 'center', 'error', 'white', true);
      console.log("El carrito está vacío");
      return;
    }
    
    const pedido = {
      estado: 'pendiente',
      //idCliente: this.idCliente, // Puedes reemplazar esto con el ID real del cliente
      idCliente: 'ID DEL CLIENTE',
      listaProductos: this.carrito,
      monto: this.total,
      nroMesa: this.nroMesa,
      tiempoPreparacion: this.carrito.reduce((acc, item) => Math.max(acc, item.tiempoPreparacion), 0)
    };
    
    try {
      await this.firestoreService.addObject(pedido, 'pedidos');
      console.log("Pedido realizado exitosamente");
      this.carrito = []; // Limpiar carrito
      this.total = 0; // Reiniciar total
      this.userService.showToast('Pedido realizado exitosamente', 'lightgreen', 'center', 'success', 'black', true);
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
    }
  }
  
  swiperSlideChanged(e : any)
  {
    console.log('changed', e);
  }

  cambiarTipo(tipo : string)
  {
    this.filtroActual = tipo;
    this.filtrarProductos();
    console.log(this.filtroActual);
  }
}


