import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { DescriptionViewComponent } from '../description-view/description-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {

 // empty states that gets populated in functions
  movies: any[] = [];
  favorited: any[] = [];
  isInFavs: boolean = false;
  username: any = localStorage.getItem('user');
  user: any = JSON.parse(this.username);
  currentUser: any = null;
  currentFavs: any = null;


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }


  ngOnInit(): void {
    this.getMovies()
    this.getFavorites()
    this.getCurrentUser(this.user.Username);
  }

  getCurrentUser(username: string): void {
    this.fetchApiData.getUser(username).subscribe((resp: any) => {
      this.currentUser = resp;
      this.currentFavs = resp.Favorites;
      return (this.currentUser, this.currentFavs);
    });
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

  openProfile(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }


  getFavorites(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.favorited = resp.FavoriteMovies((movie: any) => movie._id);
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

  toggleFavs(movieId: string): void {
    if (this.currentFavs.filter(function (e: any) { return e._id === movieId; }).length > 0) {
      this.removeFavMovie(movieId);
      this.isInFavs = false;
    } else {
      this.addFavMovie(movieId)
      this.isInFavs = true;
    }
  }

  
  inFavorited(movieId: string): boolean {
    if (this.favorited.includes(movieId)) {
      return true;
    } else {
      return false;
    }
  }
}