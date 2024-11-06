import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, arrowBackCircleOutline} from 'ionicons/icons';
import {  Router } from '@angular/router';


import { DayNamePipe } from 'src/app/pipes/day-name.pipe';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [DayNamePipe,IonButton, IonIcon, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChatPage implements OnInit, AfterViewInit {
  @ViewChild('scrollAnchor', { static: false }) private scrollAnchor!: ElementRef;
  section: string;
  arrayMessages!: any;
  message! : string;
  currentUser = 'lautaro'

  constructor(private location : Location, private router : Router,private firestore : FirestoreService) { 
    addIcons({arrowBackCircleOutline,sendOutline});
    this.section = '';
  }

  ngOnInit() {

    this.firestore.getMessages()
    .subscribe( (response : any) => {
      this.arrayMessages = [];
      for(let message of response)
      {
        this.arrayMessages.push(message);
      }
      this.scrollToBottom();
    })
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom(){
    setTimeout(() => {
      if (this.scrollAnchor) {
        this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }


  goBack() : void{
    this.router.navigateByUrl('home-mozo');
  }

  sendMessage() : void{
    if (this.message != '') {
      // this.database.sendMessage(this.auth.nameUser,this.message, this.section);
      // this.message = '';
    }
  }
  
  validateSameDay(date: Date, index: number): boolean {
    if (index === 0) {
      return true;
    }

    const previousMessageDate = new Date(this.arrayMessages[index - 1].time);
  
    const isSameDay = 
      date.getDate() === previousMessageDate.getDate() &&
      date.getMonth() === previousMessageDate.getMonth() &&
      date.getFullYear() === previousMessageDate.getFullYear();
  
    return !isSameDay;

  }



}
