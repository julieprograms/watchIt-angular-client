/**
 * The Genre component displays data about a genre and is implemented 
 * when clicking on the "genre" button on a movie card.
 * 
 * @module GenreComponent
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-view',
  templateUrl: './genre-view.component.html',
  styleUrls: ['./genre-view.component.scss']
})
export class GenreViewComponent implements OnInit {

   constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string,
      Description: string
    }
  ) { }

  ngOnInit(): void {
  }

}
