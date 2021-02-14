import { Injectable } from '@angular/core';
import 'firebase/auth';
import firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { switchMap,map } from 'rxjs/operators';
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
        let token = null;
        if(user){
          console.log('user: ',user.displayName);
          return user.getIdToken();
        }
        else{
          return of(token)
        }
      })
      ).subscribe((token) => {
        //console.log(token)
        let auth = new AuthInfo();
        auth.token = token;
        this.token.next(auth);
    });
  }

  googleSignIn():Observable<any>{
    return from(this.afAuth.signInWithPopup(this.googleAuthProvider)).pipe(
      map((result:any) => {
        if(result){
          console.log('create app user: ',result.user.email);
        }
        return result;
      })
    );
  }

  logout():Observable<any>{
    return from(this.afAuth.signOut());
  }

  getToken():string{
    return this.token.value ? this.token.value.token : null;
  }

  signInEmail(email:string,pass:string){
    return from(this.afAuth.signInWithEmailAndPassword(email,pass))
  }

  createUserEmail(email:string,pass:string){
    return from(this.afAuth.createUserWithEmailAndPassword(email,pass))
  }

  createAppUser(){

  }
}
