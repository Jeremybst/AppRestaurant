import {Component} from '@angular/core';
import {NavController,IonicPage, ToastController} from 'ionic-angular';
import {ModalController, PopoverController, AlertController, LoadingController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database'

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  Cart: any[] = [];
  public settings: any = {};
  subTotal: any;
  GrandTotal: any;
  otherTaxes = 0.00;
  setting: FirebaseObjectObservable<any>;
  noOfItems: any;
  total: any;
  coupons: any = [];


  constructor(public db:AngularFireDatabase,
              public navCtrl: NavController,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {

    this.Cart = JSON.parse(localStorage.getItem('Cart'));
    if (this.Cart != null) {
      this.noOfItems = this.Cart.length;
      this.callFunction();
    }
    this.db.list('/coupons', {
      query: {
        orderByChild: 'value'
      }
    })
      .subscribe(response => {
        this.coupons = response;
      })
  }

  couponDiscount: any = 0;
  deductedPrice:number

  applyCoupon() {
    var subTotals = this.subTotal;
    this.deductedPrice=(this.couponDiscount / 100 * subTotals);
    subTotals = subTotals - (this.couponDiscount / 100 * subTotals);
    //console.log("subtotal--"+this.subTotal);
    this.GrandTotal = subTotals + this.total;
    this.createToaster('Coupon applied successfully', '3000');

  }

  createToaster(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }


  deleteItem(itemId) {
    for (var i = 0; i <= this.Cart.length - 1; i++) {
      if (this.Cart[i].item.itemId == itemId) {
        this.Cart.splice(i, 1);
        this.callFunction();
        localStorage.setItem('Cart', JSON.stringify(this.Cart));
        this.Cart = JSON.parse(localStorage.getItem('Cart'));
        this.noOfItems = this.noOfItems - 1;
      }
    }
  }

  callFunction() {
    this.setting = this.db.object('/settings')
    let subTotal = 0;
    this.setting.subscribe((data) => {
      this.settings = data;
      for (var i = 0; i <= this.Cart.length - 1; i++) {
        subTotal = subTotal + this.Cart[i].itemTotalPrice;
      }
      this.subTotal = subTotal;
      this.total = (this.subTotal) * this.settings.totalVat / 100;
      this.GrandTotal = this.subTotal + this.total;
    })
  }

  nav() {
    if (localStorage.getItem('uid') == null) {
      let alert = this.alertCtrl.create({
        title: 'SORRY!',
        subTitle: 'You Have to Login First!',
        buttons: [
          {
            text: 'Ok',
            handler: data => {
              this.navCtrl.push("LoginPage");
            }
          }
        ]
      });
      alert.present();
    }
    else {
      this.navCtrl.push("CheckoutPage", {
        grandTotal: this.GrandTotal
      });
    }
  }

  add(data) {
    if (data.item.itemQunatity < 20) {
      data.item.itemQunatity = data.item.itemQunatity + 1;
      for (let i = 0; i <= this.Cart.length - 1; i++) {
        let ExtotalPrice = 0;
        let totalPrice = 0;
        if (this.Cart[i].item.itemId == data.item.itemId) {
          this.Cart[i].item.itemQunatity = data.item.itemQunatity;
          for (let j = 0; j <= this.Cart[i].item.extraOptions.length - 1; j++) {
            ExtotalPrice = ExtotalPrice + this.Cart[i].item.extraOptions[j].value;
          }
          if (this.Cart[i].item.price.specialPrice) {
            totalPrice = ExtotalPrice + this.Cart[i].item.price.specialPrice;
          } else {
            totalPrice = ExtotalPrice + this.Cart[i].item.price.value;
          }
          this.Cart[i].itemTotalPrice = totalPrice * data.item.itemQunatity;
        }
      }
      localStorage.setItem('Cart', JSON.stringify(this.Cart));
      this.callFunction();
    }
  }

  remove(data) {
    if (data.item.itemQunatity > 1) {
      data.item.itemQunatity = data.item.itemQunatity - 1;
      for (let i = 0; i <= this.Cart.length - 1; i++) {
        let ExtotalPrice = 0;
        let totalPrice = 0;
        if (this.Cart[i].item.itemId == data.item.itemId) {
          this.Cart[i].item.itemQunatity = data.item.itemQunatity;
          for (let j = 0; j <= this.Cart[i].item.extraOptions.length - 1; j++) {
            ExtotalPrice = ExtotalPrice + this.Cart[i].item.extraOptions[j].value;
          }
          if (this.Cart[i].item.price.specialPrice) {
            totalPrice = ExtotalPrice + this.Cart[i].item.price.specialPrice;
          } else {
            totalPrice = ExtotalPrice + this.Cart[i].item.price.value;
          }
          this.Cart[i].itemTotalPrice = totalPrice * data.item.itemQunatity;
        }
      }
      localStorage.setItem('Cart', JSON.stringify(this.Cart));
      this.callFunction();
    }
  }

    isCart():boolean {
     if (localStorage.getItem('Cart') == null || this.Cart.length == 0) {
        return false;
    }
       else {
        return true;
    }
}

     gotoHome(){
         localStorage.removeItem('Cart');
         this.navCtrl.push("HomePage");
      }


}
