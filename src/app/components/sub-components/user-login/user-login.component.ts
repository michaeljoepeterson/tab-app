import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';
import {NotificationsService} from '../../../services/notifications.service';

@Component({
  selector: 'app-user-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  email:string = '';
  username:string = '';
  loginPass:string = '';

  createPass:string = '';
  confirmPass:string = '';

  isCreatingUser:boolean = false;

  constructor(
    private authService:AuthService,
    private notificationService:NotificationsService
  ) { }

  ngOnInit(): void {
  }

  
  googleSignIn(){
    let sub = this.authService.googleSignIn().subscribe({
      next:response => {
        sub.unsubscribe();
        //console.log('response: ',response);
      },
      error:err => {
        sub.unsubscribe();
        console.warn('error logging in: ',err);
      }
    });
  }

  /**
   * @displayCreate - toggle create form
   */
  displayCreate(isCreate:boolean){
    this.isCreatingUser = isCreate;
  }

  createUser(event:Event){
    event.preventDefault();
    if(!this.email || !this.username || !this.createPass){
      this.notificationService.displaySnackBar('Missing field');
      return;
    }

    if(this.createPass !== this.confirmPass){
      this.notificationService.displaySnackBar('Passwords do not match');
      return;
    }

    let sub = this.authService.createUserEmail(this.email,this.createPass).subscribe({
      next:response => {
        sub.unsubscribe();
      },
      error:err =>{
        const message = 'Error creating account'
        sub.unsubscribe();
        console.warn(message,err);
        this.notificationService.displayErrorSnackBar(message,err);
      }
    });
  }

  emailLogin(event:Event){
    event.preventDefault();
    let sub = this.authService.signInEmail(this.email,this.loginPass).subscribe({
      next:response => {
        sub.unsubscribe();
      },
      error:err =>{
        const message = 'Error signing in';
        sub.unsubscribe();
        console.warn(message,err);
        this.notificationService.displayErrorSnackBar(message,err);
      }
    });
  }
}
