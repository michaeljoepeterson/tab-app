import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';

@Component({
  selector: 'app-user-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  email:string;
  username:string;
  loginPass:string;

  createPass:string;
  confirmPass:string;

  isCreatingUser:boolean = false;

  constructor(
    private authService:AuthService
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

  createUser(){
    let sub = this.authService.createUserEmail(this.email,this.createPass).subscribe({
      next:response => {
        sub.unsubscribe();
      },
      error:err =>{
        sub.unsubscribe();
        console.warn('Error creating account in',err);
      }
    })
  }
}
