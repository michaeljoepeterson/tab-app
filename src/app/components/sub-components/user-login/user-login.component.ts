import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth-service.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit(): void {
  }

  
  googleSignIn(){
    this.authService.googleSignIn().subscribe({
      next:response => {
        console.log('response: ',response);
      },
      error:err => {
        console.warn('error logging in: ',err);
      }
    })
  }

}
