import { Injectable } from '@angular/core';
import 'firebase/auth';
import firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { switchMap,map, concatMap } from 'rxjs/operators';
import {AuthInfo} from'../models/users/authInfoInterface';
import { Role } from '../models/users/role';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/users/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  googleAuthProvider:any;
  /**
   * *@roles array of possible user roles assignable by app
   */
  roles:Role[] = [];
  /**
   * @token - start with null value to allow for loading check by checking if value is null
   */
  private token:BehaviorSubject<AuthInfo> = new BehaviorSubject(null);
  currentToken = this.token.asObservable();
  
  tempAuth:AuthInfo = null;

  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth
  ) {
    
    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.authState.pipe(
      //wait for current user and get token
      switchMap(user => {
        this.tempAuth = new AuthInfo();
        let token = null;
        if(user){
          console.log('user: ',user.displayName);
          this.tempAuth.user = new User();
          this.tempAuth.user.email = user.email;
          return user.getIdToken();
        }
        else{
          return of(token)
        }
      }),
      //get corresponding app user if they exist
      switchMap(token => {
        this.tempAuth.token = token;
        if(this.tempAuth.user){
          return this.getAppUser(this.tempAuth.user.email,token)
        }
        else{
          return of(null);
        }
      }),
      switchMap((response) => {
        //console.log(token)
        if(response && response.user){
          this.tempAuth.user = new User(response.user);
        }
        if(!this.roles || this.roles.length === 0){
          return this.getRoles();
        }
        else{
          return of(null);
        }
      })
      ).subscribe((response) => {
        this.token.next({...this.tempAuth});
        console.log(this.roles);
        this.tempAuth = null;
    });
  }

  updateAuthUser(){
    
  }

  googleSignIn():Observable<any>{
    return from(this.afAuth.signInWithPopup(this.googleAuthProvider)).pipe(
      switchMap(async (result:any) => {
        if(result){
          console.log('create app user: ',result.user.email);
          let token = await result.user.getIdToken();
          return this.getAppUser(result.user.email,token)
        }
        else{
          return of({});
        }
      }),
      //swithcMap again to sub to getapp user, issues seens to be from 
      switchMap(response => {
        return response;
      }),
      map(response => {
        console.log(response);
        return new User(response.user);
      })
      //create user if they don't exist
      //may need to update token at end with created user to avoid race condition
    );
  }
  //extract user checking into this function to make pipe reusable
  checkAppUser(result:any):Observable<any>{
    return of(null);
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
  /**
   * get a app user based off current credentials
   * @param email user email to find
   * @param token fb auth token
   */
  getAppUser(email:string,token?:string):Observable<any>{
    let headers = new HttpHeaders();
    token = token ? token : this.getToken();
    headers = headers.append('authtoken',token);
    let options = {
      headers:headers
    };
    let url = `${environment.apiUrl}users/${email}`;
    return this.http.get(url,options);
  }

  /**
   * create a app user optionally pass a role to add for the user
   * @param role optional role string for
   */
  createAppUser(role?:string){

  }

  /**
   * @getRoles get client facing roles
   */
  getRoles():Observable<Role[]>{
    let url = `${environment.apiUrl}roles`;
    return this.http.get(url).pipe(map((response:any) => {
      if(response && response.roles){
        this.roles = response.roles.map(role => new Role(role));
      }
      return response;
    }));
  }
}
