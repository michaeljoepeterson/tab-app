import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

/**
 * @NotificationsService - service meant to handle snack bars, popups,etc
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  defaultDuration:number = 4000;
  defaultAction:string = 'Close';
  
  private _noScroll:BehaviorSubject<boolean> = new BehaviorSubject(false);
  /**
   * @noScroll - used to toggle html scroll for popups or overlays
   */
  noScroll = this._noScroll.asObservable();
  /**
   * boolean to toggle global loading icon
   */
  private _isLoading:BehaviorSubject<boolean> = new BehaviorSubject(false);
  isLoading = this._isLoading.asObservable();

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  displaySnackBar(message:string, action?:string, duration?:number){
    action = action ? action : this.defaultAction;
    duration = duration ? duration : this.defaultDuration;
    this._snackBar.open(message, action, {
      duration: duration,
    });
  }

  displayErrorSnackBar(message:string, error:any, action?:string, duration?:number){
    action = action ? action : this.defaultAction;
    duration = duration ? duration : this.defaultDuration;
    const errorMessage = `Error: ${message.trim()} Message: ${error.message}`;
    this._snackBar.open(errorMessage, action, {
      duration: duration,
    });
  }

  setLoading(loading:boolean){
    console.log(loading);
    this._isLoading.next(loading);
  }
}
