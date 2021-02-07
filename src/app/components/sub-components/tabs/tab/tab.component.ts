import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { InstrumentString } from 'src/app/models/tabs/instrumentString';
import { Tab } from 'src/app/models/tabs/tab';

interface KeyMap{
  arrowright:string;
  arrowleft:string;
  arrowup:string;
  arrowdown:string;
  space:string;
  backspace:string;
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
    space:'space',
    backspace:'backspace'
  };
  defaultNoteNum:number = 20;
  /**
   * @isNoteView - toggle between note view and tab view
   */
  isNoteView:boolean = false;
  selectedString:number = 0;
  selectedNote:number = 0;
  tabIsSelected:boolean = false;
  numberIdentifiers:string[] = ['numpad','digit'];
  /**
   * 
   * @param event handle keyboard controls
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    const key = event.code.toLowerCase();
    console.log(key);
    const isNum = this.numberIdentifiers.find(indentifier => {
      return key.includes(indentifier);
    });
    if((this.keyMap[key] || isNum) && this.tabIsSelected){
      //console.log(key);
      if(key.includes('arrow')){
        this.handleArrowKeys(key)
      }
      else if(isNum){
        this.handleNumberPressed(key);
      }
      else if(key === this.keyMap.backspace){
        this.handleDeletePress();
      }
    }
  }

  constructor(
    private ref: ChangeDetectorRef
  ) { }

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
  /**
   * handle cursor highlighting when arrow keys pressed
   * @param key string name for key pressed
   */
  handleArrowKeys(key:string){
    try{
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
      console.log(this.selectedString,this.selectedNote);
    }
    catch(e){
      console.warn('error setting cursor: ',e);
    }
  }
  /**
   * take the passed number key and assign number to selected note/fret
   * @param key numpad or digit key string
   */
  handleNumberPressed(key:string){
    try{
      let numRegex = /\d{1}/g;
      let number = key.match(numRegex);
      let selectedNote = this.selectedTab.strings[this.selectedString].notes[this.selectedNote];
      selectedNote.fretNumber = Number(number);
      this.selectedTab.strings[this.selectedString].notes[this.selectedNote] = selectedNote;
      console.log(this.selectedString,this.selectedNote);
    }
    catch(e){
      console.warn('error setting note: ',e);
    }
  }

  handleDeletePress(){
    let selectedNote = this.selectedTab.strings[this.selectedString].notes[this.selectedNote];
    selectedNote.fretNumber = null;
    this.selectedTab.strings[this.selectedString].notes[this.selectedNote] = selectedNote;
  }

  tabSelected(){
    this.tabIsSelected = true;
  }

  tabBlurred(){
    this.tabIsSelected = false;
  }

  selectFret(stringIndex:number,fretIndex:number){
    this.selectedString = stringIndex;
    this.selectedNote = fretIndex;
  }
}
