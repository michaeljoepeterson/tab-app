import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {AuthService} from '../../services/auth-service.service';
import { Tab } from '../models/tab';
import { Note } from '../models/note';
import { InstrumentString } from '../models/instrumentString';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private _selectedTab:BehaviorSubject<Tab> = new BehaviorSubject(new Tab());
  selectedTab = this._selectedTab.asObservable();

  constructor(
    private http: HttpClient,
    private authService:AuthService
  ) { }
  //eventually add this to base request builder
  getTest():Observable<any>{
    let headers = new HttpHeaders();
    let token = this.authService.getToken();
    headers = headers.append('authtoken',token);
    let options = {
      headers:headers
    };
    let url = `${environment.apiUrl}test`;
    return this.http.get(url,options);
  }

  newTab(instrument?:string){
    if(!instrument){
      let tab = new Tab();
      tab.initGuitarTab();
      this._selectedTab.next(tab);
    }
  }

  setTab(tab:Tab){
    this._selectedTab.next(tab);
  }
  /**
   * get a note at a string and index
   * @param selectedString string index
   * @param selectedNote note index
   */
  getSelectedNote(selectedString:number,selectedNote:number):Note{
    return this._selectedTab.value.strings[selectedString].notes[selectedNote];
  }
  /**
   * set a note at a selected string and note
   * @param selectedString string index
   * @param selectedNote note index 
   * @param note new note for the specified note
   */
  setSelectedNote(selectedString:number,selectedNote:number,note:Note){
    let currentTab = this._selectedTab.value;
    currentTab.strings[selectedString].notes[selectedNote] = note;
    this.setTab(currentTab);
  }
  /**
   * insert notes at a specific index across all strings
   * @param noteIndex 
   */
  insertNotes(noteIndex:number){
    let currentTab = this._selectedTab.value;
    currentTab.insertNotes(noteIndex);
    this.setTab(currentTab);
    console.log('currentTab',currentTab);
  }
  /**
   * remove notes from a specific index across all strings
   * @param noteIndex 
   */
  removeNotes(noteIndex:number){
    let currentTab = this._selectedTab.value;
    currentTab.removeNotes(noteIndex);
    this.setTab(currentTab);
  }
  /**
   * delete a note at a sepecifc string and note index
   * @param selectedString string index
   * @param selectedNote note index 
   */
  deleteNote(selectedString:number,selectedNote:number){
    let currentTab = this._selectedTab.value;
    let note = this.getSelectedNote(selectedString,selectedNote);
    note.fretNumber = null;
    currentTab.strings[selectedString].notes[selectedNote] = note;
    this.setTab(currentTab);
  }
  /**
   * break up tab into measures based off max note length
   * @param maxNoteLength max note length for each strings note array
   */
  getTabMeasures(maxNoteLength:number):Array<InstrumentString[]>{
    return this._selectedTab.value.buildMeasures(maxNoteLength);
  }

  initTabMeasures(noteWidth:number,forceBuild?:boolean){
    let currentTab = this._selectedTab.value;
    if(!currentTab.measures || currentTab.measures.length === 0 || forceBuild){
      currentTab.initMeasures(noteWidth,forceBuild);
      this.setTab(currentTab);
    }
  }
}
