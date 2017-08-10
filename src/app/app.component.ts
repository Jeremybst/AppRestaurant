import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {OneSignal} from '@ionic-native/onesignal';
import {SocialSharing} from '@ionic-native/social-sharing';

@Component({
  templateUrl: 'app.html',
  selector: 'MyApp',
  providers: [StatusBar, SplashScreen, OneSignal, SocialSharing]
})
export class MyApp {
  Cart: any = [];
  noOfItemsInCart: any;
  noOfItemsInFevrt: any;
  noOfItemsInNews: any;
  noOfItemsInOffer: any;
  userID: any;
  name: any;

  @ViewChild(Nav) nav: Nav;

  rootPage: string = "LoginPage";


  constructor(public af: AngularFireAuth,
              public db: AngularFireDatabase,
              public platform: Platform,
              public statusbar: StatusBar,
              public splashscreen: SplashScreen,
              public socialSharing: SocialSharing,
              private oneSignal: OneSignal) {
    this.initializeApp();

    this.Cart = JSON.parse(localStorage.getItem('Cart'));
    if (localStorage.getItem('Cart') != null) {
      this.noOfItemsInCart = this.Cart.length;
    }
    //fevrt


    //console.log(JSON.stringify(res));
    if (this.af.auth.currentUser) {
      this.userID = this.af.auth.currentUser.uid;
      db.object('/users/' + this.userID).subscribe(res => {
        this.name = res.name;
      });
      db.list('/users/' + this.userID + '/favourite').subscribe(res => {
        this.noOfItemsInFevrt = res.length;
      })
    }

    //offer
    db.list('/menuItems', {
      query: {
        orderByChild: 'offer',
        equalTo: true
      }
    }).subscribe(queriedItems => {
      this.noOfItemsInOffer = queriedItems.length;
    });
    //news
    db.list('/news').subscribe((res) => {
      this.noOfItemsInNews = res.length;
    })
  }

  openPage(page) {
    // Reset the content nav to have ju
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initializeApp() {
    if (this.platform.ready()) {
      this.platform.ready().then((res) => {
        if (res == 'cordova') {
          // console.log("notification!");
          this.oneSignal.startInit('ace5d8a2-5018-4523-ab21-cff285d32524', '1058635440960');
          this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
          this.oneSignal.handleNotificationReceived().subscribe(() => {
            //console.log("notification recieved!");
          });
          this.oneSignal.handleNotificationOpened().subscribe(() => {
            // console.log("notification opened!");
          });
          this.oneSignal.endInit();
        }
      });
    }
  }

  home() {
    this.nav.setRoot("HomePage");
  }

  yourOrders() {
    this.nav.setRoot("OrdersPage");
  }

  addToCart() {
    this.nav.setRoot("CartPage");
  }

  catagory() {
    this.nav.setRoot("CategoryPage");
  }

  favourite() {
    this.nav.setRoot("FavouritePage");
  }

  offer() {
    this.nav.setRoot("OfferPage");
  }

  news() {
    this.nav.setRoot("NewsPage");
  }

  contact() {
    this.nav.setRoot("ContactPage");
  }

  aboutUs() {
    this.nav.setRoot("AboutUsPage");
  }

  settings() {
    this.nav.setRoot("Settings");
  }

  invite() {
    this.socialSharing.share("share Restaurant App with friends to get credits", null, null, 'https://ionicfirebaseapp.com/#/');
  }

  login() {
    this.nav.setRoot("LoginPage");
  }

  logout() {
    console.log("Log Out");
    this.af.auth.signOut();
    localStorage.removeItem('uid');
    this.nav.setRoot("LoginPage");
  }

  isLoggedin() {
    return localStorage.getItem('uid') != null;
  }

}
