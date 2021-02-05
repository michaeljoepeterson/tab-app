import { Component, HostListener, Input, OnInit } from '@angular/core';
import { InstrumentString } from 'src/app/models/tabs/string';
import { Tab } from 'src/app/models/tabs/tab';

@Component({
  selector: 'app-tab',
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
  keyMap:any = {
    arrowright:true,
    arrowleft:true,
    arrowup:true,
    arrowdown:true,
    space:true
  };
  /**
   * 
   * @param event handle keyboard controls
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    let key = event.code.toLowerCase();
    console.log(event.code);
    if(this.keyMap[key]){
      console.log(key);
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
      this.selectedTab.initGuitarTab();
      console.log(this.selectedTab);
    }
  }

}
