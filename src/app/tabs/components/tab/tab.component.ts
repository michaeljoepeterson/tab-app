import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabService } from '../../services/tab-service.service';
import { InstrumentString } from '../../models/instrumentString';
import { Note } from '../../models/note';
import { Tab } from '../../models/tab';

interface KeyMap{
  arrowright:string;
  arrowleft:string;
  arrowup:string;
  arrowdown:string;
  space:string;
  backspace:string;
  delete:string;
}

@Component({
  selector: 'app-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  //move to service?
  @Input() selectedTab:Tab;
  /**
   * @strings pass custom strings if needed
   */
  @Input() strings:InstrumentString[] = [];
  @Input() instrumentType:string = 'guitar';

  @ViewChild('refNote') refNote:ElementRef;

  noteWidth:number = 14;

  subscriptions:Subscription[] = [];

  //directions for cursor
  up:string = 'up';
  down:string = 'down';
  left:string= 'left';
  right:string= 'right';

  instrumentTypes:any = {
    guitar:'guitar'
  };

  keyMap:KeyMap = {
    arrowright:'arrowright',
    arrowleft:'arrowleft',
    arrowup:'arrowup',
    arrowdown:'arrowdown',
    space:'space',
    backspace:'backspace',
    delete:'delete'
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
   * @measures to ensure the tabs do not go beyond view width, use to construct measures
   * sourced from selected tab
   */
  measures:Array<InstrumentString[]> = [];
  /**
   * 
   * @param event handle keyboard controls
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(event.code){
      const key = event.code.toLowerCase();
      //console.log(key);
      const isNum = this.numberIdentifiers.find(indentifier => {
        return key.includes(indentifier);
      });
      if((this.keyMap[key] || isNum) && this.tabIsSelected){
        //console.log(key);
        if(key.includes('arrow')){
          event.preventDefault();
          this.handleArrowKeys(key)
        }
        else if(isNum){
          this.handleNumberPressed(key);
        }
        else if(key === this.keyMap.backspace){
          this.handleBackSpacePress();
        }
        else if(key === this.keyMap.delete){
          this.handleDeletePressed();
        }
        else if(key === this.keyMap.space){
          event.preventDefault();
          this.handleSpacePress();
        }
      }
    }
  }

  constructor(
    private tabService:TabService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let tabSub = this.tabService.selectedTab.subscribe(tab => {
      this.selectedTab = tab;
      const noteWidth = this.refNote ? this.refNote.nativeElement.offsetWidth : this.noteWidth;
      this.tabService.initTabMeasures(noteWidth);
    });

    this.subscriptions = [tabSub];
  }

  ngOnDestroy(){
    try{
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    catch(e){
      console.warn('Error cleaning up tab: ',e);
    }
  }
  //move to tab class
  //once delete and adding setup to work with measures no longer need to force build
  buildMeasures(forceBuild?:boolean){
    const maxMeasureWidth = window.innerWidth * .9;
    const noteWidth = this.refNote ? this.refNote.nativeElement.offsetWidth : this.noteWidth;
    let currentNoteWidth = noteWidth * this.selectedTab.strings[0].notes.length;
    let numMeasures = Math.ceil(currentNoteWidth / maxMeasureWidth);
    let currentMeasures = this.measures.length;
    if(currentMeasures < numMeasures || forceBuild){
      let maxNoteLength = Math.floor(maxMeasureWidth / noteWidth);
      //let maxNoteLength = 3;
      console.log('build measures component');
      console.log(maxMeasureWidth,currentNoteWidth,maxNoteLength);    
      //this.measures = this.tabService.getTabMeasures(maxNoteLength);
      this.tabService.initTabMeasures(noteWidth,forceBuild);
    }
    console.log(this.measures);
  }

  /**
   * handle moving cursor
   * @param direction string direction to move the cursor
   */
  moveCursor(direction:string){
    if(direction === this.up){
      if(this.selectedString === 0){
        this.selectedString = 0
      }
      else{
        this.selectedString = this.selectedString - 1;
      }
    }
    else if(direction === this.down){
      let maxString = this.selectedTab.strings.length - 1;
      if(this.selectedString === maxString){
        this.selectedString = maxString;
      }
      else{
        this.selectedString += 1;
      }
    }
    else if(direction === this.left){
      if(this.selectedNote === 0){
        this.selectedNote = 0
      }
      else{
        this.selectedNote = this.selectedNote - 1;
      }
    }
    else if(direction === this.right){
      let maxNote = this.selectedTab.strings[0].notes.length - 1;
      if(this.selectedNote === maxNote){
        this.selectedNote = maxNote;
      }
      else{
        this.selectedNote += 1;
      }
    }
  }

  /**
   * handle cursor highlighting when arrow keys pressed
   * @param key string name for key pressed
   */
  handleArrowKeys(key:string){
    try{
      if(key === this.keyMap.arrowdown){
        this.moveCursor(this.down)
      }
      else if(key === this.keyMap.arrowup){
        this.moveCursor(this.up);
      }
      else if(key === this.keyMap.arrowleft){
        this.moveCursor(this.left);
      }
      else if(key === this.keyMap.arrowright){
        this.moveCursor(this.right);
      }
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
      let selectedNote = this.tabService.getSelectedNote(this.selectedString,this.selectedNote);
      selectedNote.fretNumber = Number(number);
      this.tabService.setSelectedNote(this.selectedString,this.selectedNote,selectedNote);
      this.moveCursor(this.right);
    }
    catch(e){
      console.warn('error setting note: ',e);
    }
  }
  /**
   * delete currently highlighted note
   */
  handleBackSpacePress(){
    let selectedNote = this.tabService.getSelectedNote(this.selectedString,this.selectedNote);
    selectedNote.fretNumber = null;
    this.tabService.deleteNote(this.selectedString,this.selectedNote);
    this.moveCursor(this.left);
  }

  /**
   * add space to all strings at index selected
   */
  handleSpacePress(){
    let maxNote = this.selectedTab.strings[0].notes.length - 1;
    if(this.selectedNote === maxNote){
      this.tabService.insertNotes(maxNote);
    }
    else{
      this.tabService.insertNotes(this.selectedNote);
    }
    this.buildMeasures(true);
  }

  /**
   * add space to all strings at index selected
   */
  handleDeletePressed(){
    this.tabService.removeNotes(this.selectedNote);
    this.buildMeasures(true);
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
