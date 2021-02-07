import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from '@angular/core';
import { InstrumentString } from 'src/app/models/tabs/instrumentString';
import { Tab } from 'src/app/models/tabs/tab';

interface KeyMap{
  arrowright:string;
  arrowleft:string;
  arrowup:string;
  arrowdown:string;
  space:string;
}

@Component({
  selector: 'app-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  @Input() selectedTab:Tab;
  /**
   * @strings pass custom strings if needed
   */
  @Input() strings:InstrumentString[] = [];
  @Input() instrumentType:string = 'guitar';

  instrumentTypes:any = {
    guitar:'guitar'
  };
  keyMap:KeyMap = {
    arrowright:'arrowright',
    arrowleft:'arrowleft',
    arrowup:'arrowup',
    arrowdown:'arrowdown',
    space:'space'
  };
  defaultNoteNum:number = 20;
  /**
   * @isNoteView - toggle between note view and tab view
   */
  isNoteView:boolean = false;
  selectedString:number = 0;
  selectedNote:number = 0;
  /**
   * 
   * @param event handle keyboard controls
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    let key = event.code.toLowerCase();
    //console.log(event.code);
    if(this.keyMap[key]){
      console.log(key);
      if(key.includes('arrow')){
        this.handleArrowKeys(key)
      }
    }
  }

  constructor() { }

  ngOnInit(): void {
    if(!this.selectedTab){
      this.selectedTab = new Tab();
      this.initTab();
    }
  }

  initTab(){
    if(this.strings.length === 0 || this.instrumentType === this.instrumentTypes.guitar){
      this.selectedTab.initGuitarTab(this.defaultNoteNum);
      console.log(this.selectedTab);
    }
  }

  handleArrowKeys(key:string){
    if(key === this.keyMap.arrowdown){
      let maxString = this.selectedTab.strings.length - 1;
      if(this.selectedString === maxString){
        this.selectedString = maxString;
      }
      else{
        this.selectedString += 1;
      }
    }
    else if(key === this.keyMap.arrowup){
      if(this.selectedString === 0){
        this.selectedString = 0
      }
      else{
        this.selectedString = this.selectedString - 1;
      }
    }
    else if(key === this.keyMap.arrowleft){
      if(this.selectedNote === 0){
        this.selectedNote = 0
      }
      else{
        this.selectedNote = this.selectedNote - 1;
      }
    }
    else if(key === this.keyMap.arrowright){
      let maxNote = this.selectedTab.strings[0].notes.length - 1;
      if(this.selectedNote === maxNote){
        this.selectedNote = maxNote;
      }
      else{
        this.selectedNote += 1;
      }
    }
  }

}
