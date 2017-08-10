import {Component} from '@angular/core';
import {IonicPage, NavController,LoadingController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database'



@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html'
})
export class OrdersPage {
  ordersDetails: any[] = [];

  constructor(public af: AngularFireAuth,
              public db: AngularFireDatabase,
              public navCtrl: NavController,
              public loadingCtrl:LoadingController) {

        if (this.af.auth.currentUser) {
           let loader = this.loadingCtrl.create({
            content: "Please wait...",
          });
           loader.present().then(() => {
          let userID = this.af.auth.currentUser.uid;
          this.db.list('/orders', {
            query: {
              orderByChild: 'userId',
              equalTo: userID,
            }
          }).subscribe(response => {
            this.ordersDetails = response;
            loader.dismiss();
          }
          ,
        (error)=>{
          console.error(error);
            loader.dismiss();
      })
        })
        }
  }


  orderDetails(key, index) {
    //console.log(index+"----index");
    this.navCtrl.push("OrderDetailsPage", {
      orderId: key,
      index: index
    });
  }

  isOrders(): boolean {
    if (this.ordersDetails.length == 0) {
      return false;
    }
    else {
      return true;
    }
  }

  navcart() {
    this.navCtrl.push("CartPage")
  }
}
