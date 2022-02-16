import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { DescriptionViewComponent } from '../description-view/description-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { GenreViewComponent } from '../genre-view/genre-view.component';



@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {

 // empty states that gets populated in functions
  movies: any[] = [];
  favorited: any[] = [];


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.getMovies()
    this.getFavorites()
  }


  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

 
  openDescriptionView(Title: string, Description: string): void {
    this.dialog.open(DescriptionViewComponent, {
      data: { Title, Description }
    })
  }


  openGenreView(Name: string, Description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: { Name, Description }
    })
  }


  openDirectorView(Name: string, Bio: string, Birth: string, Death: string): void {
    this.dialog.open(DirectorViewComponent, {
      data: { Name, Bio, Birth, Death }
    })
  }


  getFavorites(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.favorited = resp.FavoriteMovies;
      console.log(this.favorited);
      return this.favorited;
    });
  }


  addFavMovie(movieId: string): void {
    this.fetchApiData.addFavoriteMovies(movieId).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(`Added movie to Watchlist`, 'OK', {
        duration: 4000,
      });
      this.getFavorites()
      this.ngOnInit();
    });
  }


  removeFavMovie(movieId: string): void {
    this.fetchApiData.deleteMovie(movieId).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(`Removed movie from Watchlist`, 'OK', {
        duration: 4000,
      });
      this.getFavorites()
      this.ngOnInit();
    });
  }

  
  inFavorited(movieId: string): boolean {
    if (this.favorited.includes(movieId)) {
      return true;
    } else {
      return false;
    }
  }
}