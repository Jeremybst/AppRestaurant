import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database'


@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html'
})

export class CheckoutPage {
  date: any;
  orderId: any;
  tagHide1: boolean = true;
  tagHide2: boolean = true;
  cart: Array<any>;
  grandTotal: any;
  order: any = {};
  address: any = {};
  cardDetails: any = {};
  cod: any;
  userId: any;
  userDetails = {
    email: '',
    name: '',
    mobileNo: '',
    userid: ''
  };
  checkout: FirebaseListObservable<any>;
  userDetail: FirebaseObjectObservable<any>;
  bookings: FirebaseObjectObservable<any>;
  color: any
  str: any

  constructor(public af: AngularFireAuth,
              public db: AngularFireDatabase,
              public navCtrl: NavController,
              public navParams: NavParams) {
    this.str = '#';
    var num = Math.floor(Math.random() * 900000) + 100000;
    this.color = this.str.concat(num);
      if (this.af.auth.currentUser) {
        this.userId =this.af.auth.currentUser.uid;
      }
    this.grandTotal = this.navParams.get('grandTotal');
    this.userDetail = this.db.object('/users/' + this.userId);
    this.userDetail.subscribe((res) => {
      this.userDetails = {
        email: res.email,
        name: res.name,
        mobileNo: res.mobileNo,
        userid: this.userId
      };

    });
    this.cart = JSON.parse(localStorage.getItem('Cart'));
    this.checkout = db.list('/orders');

    this.order.cod = 'cod';
  }


  onCheckOut(form: NgForm) {
    this.date = new Date();
    this.orderId = Math.floor(Math.random() * 90000) + 10000;
    this.order.orderId = this.orderId;
    this.order.cart = this.cart;
    this.order.address = this.address;
    this.order.userDetails = this.userDetails;
    this.order.grandTotal = this.grandTotal;
    this.order.userId = this.userId;
    this.order.createdAt = Date.parse(this.date);
    this.order.status = "pending";
    if (this.order.cod) {
      this.order.cod = "cod";
    } else {
      this.order.cardDetails = this.cardDetails;
    }
    this.checkout.push(this.order);
    this.navCtrl.push("ThankyouPage");


  }


  toggle2() {
    this.order.cod = '';
    this.tagHide2 = this.tagHide2 ? false : true;
  }

  toggle3() {
    this.tagHide2 = true;
    this.order.cod = 'cod';
  }

}
