import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-description-view',
  templateUrl: './description-view.component.html',
  styleUrls: ['./description-view.component.scss']
})
export class DescriptionViewComponent implements OnInit {


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
