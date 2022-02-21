/**
 * The Description component is used to display a discription of a movie in a dialog box when 
 * the user clicks the description button on a movie card.
 * 
 * @module DescriptionComponent
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-description-view',
  templateUrl: './description-view.component.html',
  styleUrls: ['./description-view.component.scss']
})
export class DescriptionViewComponent implements OnInit {

  /**
   * 
   * @param data An object containing movie data. Must have Title and Description parameters 
   * both containing strings.
   * 
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Title: string,
      Description: string
    }
  ) { }

  ngOnInit(): void {
  }

}
