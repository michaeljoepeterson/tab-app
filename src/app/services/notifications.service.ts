import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * @NotificationsService - service meant to handle snack bars, popups,etc
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  defaultDuration:number = 4000;
  defaultAction:string = 'Close';

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
}
