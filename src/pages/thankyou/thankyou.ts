import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';


 @IonicPage()
@Component({
  selector: 'page-thankyou',
  templateUrl: 'thankyou.html'
})
export class ThankyouPage {
  constructor( ) {
    localStorage.removeItem('Cart');
  }
}
