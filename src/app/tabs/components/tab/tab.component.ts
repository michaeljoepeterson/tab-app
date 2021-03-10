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
  selectedMeasure:number = 0;
  tabIsSelected:boolean = false;
  numberIdentifiers:string[] = ['numpad','digit'];
  minNoteWidth:number;
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
  
  ngAfterViewInit(){
    this.initMinNoteWidth();
  }

  ngOnDestroy(){
    try{
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    catch(e){
      console.warn('Error cleaning up tab: ',e);
    }
  }
  /**
   * init the min width for the notes
   */
  initMinNoteWidth(){
    const noteWidth = this.refNote ? this.refNote.nativeElement.getBoundingClientRect().width : this.noteWidth;
    this.noteWidth = noteWidth;
    this.tabService.setNoteWidth(this.noteWidth);
    this.ref.markForCheck();
  }

  /**
   * handle moving cursor
   * @param direction string direction to move the cursor
   */
  moveCursor(direction:string){
    if(direction === this.up){
      //move up to next measure bottom string
      if(this.selectedString === 0 && this.selectedMeasure > 0){
        this.selectedMeasure -= 1;
        //check if current measure has more notes
        this.selectedString = this.selectedTab.measures[this.selectedMeasure].length - 1;
      }
      else if(this.selectedMeasure === 0 && this.selectedString === 0){
        this.selectedString = 0;
      }
      else{
        this.selectedString = this.selectedString - 1;
      }
    }
    else if(direction === this.down){
      let maxString = this.selectedTab.measures[this.selectedMeasure].length - 1;
      let maxMeasure = this.selectedTab.measures.length - 1;
      if(this.selectedString === maxString && this.selectedMeasure < maxMeasure){
        this.selectedMeasure += 1;
        this.selectedString = 0;
        let measureMaxNote = this.selectedTab.measures[this.selectedMeasure][this.selectedString].notes.length - 1;
        this.selectedNote = this.selectedNote > measureMaxNote ? measureMaxNote : this.selectedNote; 
      }
      else if(this.selectedString === maxString && this.selectedMeasure === maxMeasure){
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
      let maxNote = this.selectedTab.measures[this.selectedMeasure][this.selectedString].notes.length - 1;
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
      let selectedNote = this.tabService.getSelectedNote(this.selectedString,this.selectedNote,this.selectedMeasure);
      selectedNote.fretNumber = Number(number);
      this.tabService.setSelectedNote(this.selectedString,this.selectedNote,this.selectedMeasure,selectedNote);
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
    let selectedNote = this.tabService.getSelectedNote(this.selectedString,this.selectedNote,this.selectedMeasure);
    selectedNote.fretNumber = null;
    this.tabService.deleteNote(this.selectedString,this.selectedNote,this.selectedMeasure);
    this.moveCursor(this.left);
  }

  /**
   * add space to all strings at index selected
   */
  handleSpacePress(){
    //this.tabService.insertNotesInMeasure(this.selectedMeasure,this.selectedNote);
    this.tabService.insertNotes(this.selectedNote);
    this.tabService.initTabMeasures(this.noteWidth,true);
  }

  /**
   * add space to all strings at index selected
   */
  handleDeletePressed(){
    this.tabService.removeNotes(this.selectedNote);
    this.tabService.initTabMeasures(this.noteWidth,true);
  }

  tabSelected(){
    this.tabIsSelected = true;
  }

  tabBlurred(){
    this.tabIsSelected = false;
  }

  selectFret(stringIndex:number,fretIndex:number,measureIndex:number){
    this.selectedString = stringIndex;
    this.selectedNote = fretIndex;
    this.selectedMeasure = measureIndex;
  }

}
