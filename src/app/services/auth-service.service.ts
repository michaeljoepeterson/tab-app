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
          //console.log('user: ',user.displayName);
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
      //get possible user roles
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
        //console.log(this.roles);
        this.tempAuth = null;
    });
  }

  updateAuthUser(){
    
  }
  /**
   * login using google auth
   */
  googleSignIn():Observable<any>{
    return from(this.afAuth.signInWithPopup(this.googleAuthProvider)).pipe(
      switchMap(async (result:any) => {
        if(result){
          let token = await result.user.getIdToken();
          return this.checkAppUser(result,token);
        }
        else{
          return of({});
        }
      }),
      switchMap(response => {
        return response;
      })
    );
  }
  /**
   * reusable app check to see if user exists only need to do this check on google auth
   * @param result fb auth login result
   * @param token string token
   */
  checkAppUser(result:any,token?:string):Observable<any>{
    let res = null;
    return this.getAppUser(result.user.email,token).pipe(
      map((response:any) => {
        res = response;
        return new User(response.user);
      }),
      switchMap((user:User) => {
        if(user.email){
          return of(user);
        }
        else{
          return this.createAppUser(result.user.displayName,result.user.email,null,token);
        }
      }),
      map(user => {
        let currentAuth = {...this.token.value};
        currentAuth.user = user;
        this.token.next(currentAuth);
        return user;
      })
    );
  }
  /**
   *@logout logout current user
   */
  logout():Observable<any>{
    return from(this.afAuth.signOut());
  }

  getToken():string{
    return this.token.value ? this.token.value.token : null;
  }
  /**
   * sign in using email and password auth
   * @param email 
   * @param pass 
   */
  signInEmail(email:string,pass:string){
    return from(this.afAuth.signInWithEmailAndPassword(email,pass))
  }

  createUserEmail(email:string,pass:string,username:string){
    return from(this.afAuth.createUserWithEmailAndPassword(email,pass)).pipe(
      switchMap(async (result:any) => {
        if(result){
          let token = await result.user.getIdToken();
          return this.createAppUser(username,email,null,token);
        }
        else{
          return of({});
        }
      }),
      switchMap(response => {
        return response;
      })
    )
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
  createAppUser(username:string,email:string,level?:number,token?:string):Observable<any>{
    level = level ? level : 4;
    let foundRole = this.roles.find(role => role.level === level);
    let headers = new HttpHeaders();
    token = token ? token : this.getToken();
    headers = headers.append('authtoken',token);
    headers.append('Content-Type', 'application/json');
    let options = {
      headers:headers
    };
    let user = new User({
      username,
      email,
      role:foundRole.id
    });
    let userJson = user.getJson();
    let url = `${environment.apiUrl}users`;
    return this.http.post(url,userJson,options);
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
