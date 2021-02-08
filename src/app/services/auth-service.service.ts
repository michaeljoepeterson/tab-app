import { Injectable } from '@angular/core';
import 'firebase/auth';
import firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  googleAuthProvider:any;

  private token:BehaviorSubject<string> = new BehaviorSubject(null);
  currentToken = this.token.asObservable();

  constructor(
    public afAuth: AngularFireAuth
  ) {
    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.authState.subscribe(async (user) => {
      console.log(user);
      let token = null;
      if(user){
        token = await user.getIdToken();
      }
      this.token.next(token);
    });
  }

  googleSignIn():Observable<any>{
    return from(this.afAuth.signInWithPopup(this.googleAuthProvider))
  }
}
