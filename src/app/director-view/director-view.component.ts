/**
 * The Director component renders information about a director and is implemented when 
 * clicking the "director" button on a movie card. 
 * 
 * @module DirectorComponent
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-view',
  templateUrl: './director-view.component.html',
  styleUrls: ['./director-view.component.scss']
})
export class DirectorViewComponent implements OnInit {

/**
   * 
   * @param data An object containing director data. Must have Name, Bio, and BirthYear 
   * properties (all strings)
   */  
 constructor(
  @Inject(MAT_DIALOG_DATA)
  public data: {
    Name: string,
    Bio: string,
    Birth: string,
    Death: string,
  }
) { }


  ngOnInit(): void {
  }

}
