import { Injectable } from '@angular/core';
import 'firebase/auth';
import firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {AuthInfo} from'../models/users/authInfoInterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  googleAuthProvider:any;
  /**
   * @token - start with null value to allow for loading check by checking if value is null
   */
  private token:BehaviorSubject<AuthInfo> = new BehaviorSubject(null);
  currentToken = this.token.asObservable();

  constructor(
    public afAuth: AngularFireAuth
  ) {
    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.authState.pipe(
      switchMap(user => {
        //console.log('user: ',user);
        let token = null;
        if(user){
          return user.getIdToken();
        }
        else{
          return of(token)
        }
      })
      ).subscribe((token) => {
        this.token.next({token});
    });
  }

  googleSignIn():Observable<any>{
    return from(this.afAuth.signInWithPopup(this.googleAuthProvider));
  }

  logout():Observable<any>{
    return from(this.afAuth.signOut());
  }

  getToken():string{
    return this.token.value.token;
  }
}
