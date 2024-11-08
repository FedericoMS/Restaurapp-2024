import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

@Component({
  selector: 'app-home-cocinero-bartender',
  templateUrl: './home-cocinero-bartender.page.html',
  styleUrls: ['./home-cocinero-bartender.page.scss'],
  standalone: true,
  imports: [IonFabList, IonFabButton, IonFab, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SpinnerComponent]
})
export class HomeCocineroBartenderPage implements OnInit {

  userRol : any = '';
  isLoading : boolean = false;
  listaPedidos: any[] = [];
  pedidosFiltrados: any[] = [];

  constructor(public userService: UserService, private firestoreService: FirestoreService) {

    setTimeout(() => {
      this.isLoading = true;
    }, 1100);

  }


  //Muy importante el async-await, ya que al ser un promise, 
  //se tiene que esperar a que se resuelva para obtener el rol
  async ngOnInit() {
    this.userRol = await this.userService.getRole();
    console.log('Mi rol es: ' + this.userRol);
    
    setTimeout(() => {
      this.isLoading = false;      
    }, 2600);
  
    this.firestoreService.getPedidos().subscribe((pedidos: any) => {
      this.listaPedidos = pedidos;
      this.filtrarProductos(); 
    });
  }
  

  filtrarProductos() {
    this.pedidosFiltrados = this.listaPedidos
      .map(pedido => {
        // Filtrar productos dentro de cada pedido según el rol del usuario y el estado "en preparación"
        const productosFiltrados = pedido.listaProductos.filter((producto: { tipo: string; estado: string }) => {
          const esProductoParaCocinero = (producto.tipo === 'comida' || producto.tipo === 'postre') && producto.estado === 'en preparación';
          const esProductoParaBartender = producto.tipo === 'bebida' && producto.estado === 'en preparación';
          
          // Retorna true si el producto corresponde al rol actual y está en "en preparación"
          return this.userRol === 'cocinero' ? esProductoParaCocinero : esProductoParaBartender;
        });
  
        // Si hay productos filtrados, devuelve el pedido con solo esos productos; si no, retorna null
        return productosFiltrados.length > 0 ? { ...pedido, listaProductos: productosFiltrados } : null;
      })
      .filter(pedido => pedido !== null); // Filtra los pedidos que no tienen productos relevantes para el usuario
  }
  
  
  

  updateProductStatus(pedido: any, productoId: string) {
    /*
    // Clonamos el pedido para evitar modificar el original
    let modOrder: any = { ...pedido };
  
    // Encontramos el producto específico y actualizamos solo su estado
    modOrder.listaProductos = modOrder.listaProductos.map((producto: any) =>
      producto.id === productoId ? { ...producto, estado: 'preparado' } : producto
    );
  
    // Verificamos si todos los productos están en "preparado"
    const todosProductosPreparados = modOrder.listaProductos.every((producto: any) => producto.estado === 'preparado');
  
    // Si todos los productos están "preparado", actualizamos el estado del pedido a "preparado"
    modOrder.estado = todosProductosPreparados ? 'preparado' : 'en preparación';
  
    // Actualizamos el pedido en Firestore con el cambio en el producto y el estado del pedido si es necesario
    this.firestoreService.updateOrderPartial(pedido.id, productoId, 'preparado', modOrder.estado);
  
    // Mensaje de confirmación
    Swal.fire({
      title: "Producto terminado!",
      confirmButtonText: "Continuar",
      heightAuto: false
    });*/
  }
  
  
  
  
  
  


}
