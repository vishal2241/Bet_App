// Import Lib
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Subscription } from 'rxjs/Subscription';
import { MenuController } from 'ionic-angular';

// Import Pages - Components
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { Login } from '../pages/login/login';

// Import Providers - Services
import { UserServiceProvider } from '../providers/user-service/user-service';
import { PubSubProvider } from '../providers/pub-sub/pub-sub';
import { BusinessProvider } from '../providers/business/business'
import { ActiveBetPage } from '../pages/active-bet/active-bet';
import { RankingPage } from '../pages/ranking/ranking';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // Define Variable
  rootPage: any = TabsPage;
  count: number;
  isLogged: boolean;
  pages: Array<{ title: string, component: any, icon: string }>;
  subscription: Subscription;

  // Define Providers - Services
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    private userService: UserServiceProvider,
    private pubsub: PubSubProvider,
    private business: BusinessProvider) {
  }

  // Init function
  ngOnInit() {
    // Define Component on Menu
    this.pages = [
      { title: 'Home', component: TabsPage, icon: 'ios-home' }
    ];

    this.isLogged = false;// isLogged is variable to defined Logged In or Not - Default value: False (Not Logged In)
    this.business.checkLogin().then((result) => {
      if (result) {
        this.isLogged = true;
        this.changeMenuItem();
      }
    });

    // Subcribe value
    this.subscription = this.pubsub.subcribeLogin().subscribe(value => {
      this.isLogged = value;
      this.changeMenuItem();
    });

    // Call initializeApp Function
    this.initializeApp();
  };

  // Change item in Left Menu
  changeMenuItem() {
    // Define items to add into Left Menu
    this.count = 0;
    let items = [
      { title: 'Active Bet', component: ActiveBetPage, icon: 'ios-football' },
      { title: 'Rankings', component: RankingPage, icon: 'ios-trophy' }
    ];
    if (this.isLogged) {
      for (var i = 0; i < this.pages.length; i++) {
        if (this.pages[i].title === 'Active Bet') {
          this.count = 1;
          break;
        }
      }
      if (this.count === 0) {
        items.forEach(item => {
          this.pages.push(item);
        });
      }
    } else {
      for (i = 0; i <= this.pages.length; i++) {
        if (this.pages[i].title === 'Active Bet') {
          this.pages.splice(i, 1);
        } else {
          break;
        }
      };
    }
  };

  // Destroy Event Function
  ngOnDestroy() {
    // Unsubscribe
    this.subscription.unsubscribe();
  };

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleLightContent();
        this.splashScreen.hide();
      }
    });
  };

  // Logout Function
  logOut() {
    this.userService.signout().then((result) => {
      if (result.success) {
        this.nav.setRoot(Login);
        this.menuCtrl.close();
      }
    });
  };

  // Login Function
  logIn() {
    this.nav.push(Login);
    this.menuCtrl.close();
  };

  // Navigate to Profile
  openProfile() {
    if (this.isLogged) {
      this.nav.setRoot(ProfilePage);
      this.menuCtrl.close();
    }
  };

  // Navigate page on Menu
  openPage(page) {
    this.nav.setRoot(page.component);
    // Close side menu
    this.menuCtrl.close();
  };
}
