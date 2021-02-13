import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthInfo } from 'src/app/models/users/authInfoInterface';
import {AuthService} from '../../../services/auth-service.service';
import {TabService} from '../../../services/tab-service.service';

@Component({
  selector: 'app-create-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-tab.component.html',
  styleUrls: ['./create-tab.component.css']
})
export class CreateTabComponent implements OnInit {
  currentToken:string = null;
  subscribers:Subscription[] = [];
  tokenObservable:Observable<AuthInfo> = new Observable(null);

  constructor(
    private authService:AuthService,
    private ref:ChangeDetectorRef,
    private tabService:TabService
  ) { }

  ngOnInit(): void {
    this.tokenObservable = this.checkToken();

    let sub = this.tabService.getTest().subscribe({
      next:response =>{
        console.log('res',response);
      },
      error:err =>{
        console.warn('error getting test: ',err);
      },
      complete:() => {
        console.log('clean up');
        sub.unsubscribe();
      }
    })
  }

  ngOnDestroy(){
    try{
      this.subscribers.forEach(sub => sub.unsubscribe());
    }
    catch(e){
      console.warn('Error cleaning up: ',e);
    }
  }

  checkToken():Observable<AuthInfo>{
    return this.authService.currentToken;
  }
}
