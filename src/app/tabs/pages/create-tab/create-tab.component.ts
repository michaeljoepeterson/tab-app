import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthInfo } from 'src/app/models/users/authInfoInterface';
import {AuthService} from '../../../services/auth-service.service';
import { TabService } from '../../services/tab-service.service';
/**
 * used for creating and editing tabs
 */
@Component({
  selector: 'app-create-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-tab.component.html',
  styleUrls: ['./create-tab.component.css']
})
export class CreateTabComponent implements OnInit {
  currentToken:string = null;
  subscriptions:Subscription[] = [];
  authInfo:AuthInfo = null;
  selectedTab:any = null;

  constructor(
    private authService:AuthService,
    private ref:ChangeDetectorRef,
    private route:ActivatedRoute,
    private tabService:TabService,
    //private router: Router
  ) { }

  ngOnInit(): void {
    //need this?
    /*
    let routerSub = this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        console.log(val); 
        const tab = this.route.snapshot.paramMap.get('tab');
        console.log(tab);
        if(!tab){
          this.tabService.newTab();
        }
      }
    });
    this.subscriptions.push(routerSub);
    */

    const tab = this.route.snapshot.paramMap.get('tab');
    //console.log(tab);
    
    if(!tab){
      this.tabService.newTab();
    }
    
    let authSub = this.authService.currentToken.subscribe(auth => {
      this.authInfo = auth;
      this.ref.markForCheck();
    });

    this.subscriptions.push(authSub);
    
    let sub = this.tabService.getTest().subscribe({
      next:response =>{
        console.log('res',response);
      },
      error:err =>{
        console.warn('error getting test: ',err);
      },
      complete:() => {
        sub.unsubscribe();
      }
    })
    
  }

  ngOnDestroy(){
    try{
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    catch(e){
      console.warn('Error cleaning up: ',e);
    }
  }
}
