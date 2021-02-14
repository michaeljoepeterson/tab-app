import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthInfo } from './models/users/authInfoInterface';
import {AuthService} from './services/auth-service.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tab-app';
  subscribers:Subscription[] = [];
  authInfo:AuthInfo = null;

  constructor(
    private authService:AuthService,
    private ref:ChangeDetectorRef
  ) { }

  ngOnInit(){
    let sub = this.authService.currentToken.subscribe(auth => {
      this.authInfo = auth;
      this.ref.markForCheck();
    });

    this.subscribers.push(sub);
  }

  ngOnDestroy(){
    try{
      this.subscribers.forEach(sub => sub.unsubscribe());
    }
    catch(e){
      console.warn('Error cleaning up app ',e);
    }
  }
}
