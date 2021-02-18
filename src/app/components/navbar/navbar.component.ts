import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthInfo } from '../../models/users/authInfoInterface';
import { AuthService } from '../../services/auth-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserLoginComponent } from '../sub-components/user-login/user-login.component';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  subscriptions:Subscription[] = [];
  authInfo:AuthInfo = null;
  loginModal:MatDialogRef<any,any> = null;

  constructor(
    private authService:AuthService,
    private ref:ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let sub = this.authService.currentToken.subscribe(auth => {
      this.authInfo = auth;
      if(this.loginModal){
        this.loginModal.close();
      }
      this.ref.markForCheck();
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(){
    try{
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    catch(e){
      console.warn('error cleaning up navbar ',e);
    }
  }

  logout(){
    let sub = this.authService.logout().subscribe({
      next:response => {
        sub.unsubscribe()
      },
      error:err => {
        sub.unsubscribe();
        console.warn('Error logging out: ',err);
      }
    })
  }

  opneLoginModal(){
    this.loginModal = this.dialog.open(UserLoginComponent);
  }
}
