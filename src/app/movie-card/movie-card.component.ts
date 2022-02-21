/**
 * Renders a responsive grid of movie cards for each movie in the database.  
 * Each movie card has an image, links to open dialogs for genre, director, and description 
 * components, and a toggle button to add or remove the movie from the user's favorites.  
 *   
 * Also renders a BannerComponent.
 * 
 * @module MovieCardComponent
 */

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

  movies: any = [];
  Favorites: any[] = [];
  user: any[] = [];


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }


  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }


/**
   * When the user loads the `/movies` page, loads in the movies and
   * renders movie card elements.  
   * Then, an array of the user's favorite movies by ID is fetched from
   * the server and each movie that is in that list is marked as favorite.  
   * 
   * If this fails for any reason 
   * (likely because the user is not logged in, or the token expired) 
   * the localStorage gets cleared (logout) 
   * and the user is redirected to the home page.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

/**
   * Fetches the logged in user's favorite movies from the server.  
   * This function is called from [[MovieCardComponent.getMovies]].
   */
  getFavoriteMovies(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.Favorites = resp.FavoriteMovies;
      console.log(this.Favorites);
    });
  }


/**
   * 
   * @param movie {Title: <string>, Summary: <string>, ... }  
   * Opens a dialog box with a DescriptionComponent, passing the movie data
   * into the component.
   */
  openDescriptionDialog(title: string, description: string): void {
    this.dialog.open(DescriptionViewComponent, {
      data: { Title: title, Description: description },
      width: '300px',
    });
  }

/**
   * @param director {Name: <string>, Bio: <string>, BirthYear: <string>}  
   * Opens a dialog box with a DirectorComponent, passing the director 
   * data into the component.
   */
  openDirectorDialog(
    name: string,
    bio: string,
    birth: string,
    death: string
  ): void {
    this.dialog.open(DirectorViewComponent, {
      data: { Name: name, Bio: bio, Birth: birth, Death: death },
      width: '300px',
    });
  }

/**
   * 
   * @param genre {Name: <string>, Description: <string>}  
   * Opens a dialog box with a GenreComponent, passing the genre data
   * into the component.
   */
   openGenreDialog(Name: string, Description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: { Name: Name, Description: Description },
      width: '300px',
    });
  }

  openProfile(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }

/**
   * @param id string containing the ID of a movie to be added to the user's 
   * list of favorite movies.  
   * 
   * Adds a movie to a user's list of favorites with a POST request via 
   * [[FetchApiDataService.addFavoriteMovie]].  
   * Then, changes the movie's star icon from emtpy to filled in 
   * and displays a confirmation message.
   */
  addFavoriteMovie(MovieID: string, title: string): void {
    this.fetchApiData.addFavoriteMovie(MovieID, this.user).subscribe((resp: any) => {
      this.snackBar.open(`${title} has been added to your Watchlist!`, 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

/**
   * @param id string containing the ID of a movie to be removed from the user's
   * list of favorite movies.
   * 
   * Removes a movie from a user's list of favorites with a DELETE request via
   * [[FetchApiDataService.removeFavoriteMovie]]. 
   * Then, changes the movie's star icon from filled in to empty
   * and displays a confirmation message.
   */
  removeFavoriteMovie(MovieId: string, title: string): void {
    this.fetchApiData.deleteFavMovie(MovieId, this.user).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(
        `${title} has been removed from your Watchlist!`,
        'OK',
        {
          duration: 4000,
        }
      );
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  isFavorite(MovieID: string): boolean {
    return this.Favorites.some((movie) => movie._id === MovieID);
  }


/**
   * Sets the isFavorite attribute of each movie to true or false.  
   * This is called after fetching the favorites with 
   * [[MovieCardComponent.getFavoriteMovies]] from within 
   * [[MovieCardComponent.getMovies]].
   */
  toggleFavorite(movie: any): void {
    this.isFavorite(movie._id)
      ? this.removeFavoriteMovie(movie._id, movie.Title)
      : this.addFavoriteMovie(movie._id, movie.Title);
  }
}


