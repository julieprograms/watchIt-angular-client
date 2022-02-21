/**
 * Renders a form for users to update their account information and 
 * an array of movie cards corresponding to their favorite movies.  
 * 
 * Also renders a BannerComponent.
 * 
 * @module ProfileComponent
 */

import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';




@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

/**
  * Starts the value of each form field as an empty string. When the user types 
  * into the field, the updatedUserData is updated as well.
  */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' }


/**
  * Grabs the user information from the database on the backend 
  */
  UserFromStorage: any = localStorage.getItem('user');
  currentUser: any = (JSON.parse(this.UserFromStorage));
  currentUsername: any = this.currentUser.Username;
  currentFavs: any = this.currentUser.Favorites;
  favsEmpty: boolean = true;


  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }


/**
   * Fetches data for the logged in user.  
   * Then, downloads all the movie data and maps
   * the user's favorites to favoriteMovies.  
   * 
   * If the API call fails for some reason, the user will 
   * be logged out and returned to the welcome screen.
   */
  ngOnInit(): void {
    this.getCurrentUser(this.currentUsername);
  }


  backToMovies(): void {
    this.router.navigate(['movies']);
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }

/**
  * What pulls up when a user logs in and accesses their current info
  */
  getCurrentUser(currentUser: string): void {
    this.fetchApiData.getUser(currentUser).subscribe((resp: any) => {
      this.currentUser = resp;
      this.currentFavs = this.currentUser.Favorites;
      this.areFavsEmpty();
      return this.currentUser;
    });
  }

/**
   * Tests if there are favorite movies or not
   */
  areFavsEmpty(): any {
    if (this.currentFavs.length == 0) {
      this.favsEmpty = true;
    } else {
      this.favsEmpty = false;
    }
    return this.favsEmpty;
  }


/**
  * How a user deletes the favorites
  */
  removeFromFavs(movieId: string): void {
    this.fetchApiData.deleteFavMovie(this.currentUsername, movieId).subscribe((resp: any) => {
      this.ngOnInit();
      this.snackBar.open('Removed from favs', 'OK', { duration: 2000 });
    });
    this.ngOnInit();
  }


/**
   * Updates the user's data. Only sends data to the server for fields 
   * that have been filled in.
   */
  editUserInfo(): void {
    const updatedData = {
      Username: this.userData.Username ? this.userData.Username : this.currentUser.Username,
      Password: this.userData.Password ? this.userData.Password : this.currentUser.Password,
      Email: this.userData.Email ? this.userData.Email : this.currentUser.Email,
      Birthday: this.userData.Birthday ? this.userData.Birthday : this.currentUser.Birthday,
    }

    this.fetchApiData.editUser(updatedData).subscribe((resp: any) => {
      this.snackBar.open("Profile updated", "OK", {
        duration: 4000
      });
      localStorage.setItem('user', resp.Username)
      this.getCurrentUser(this.currentUser.Username)
    }, (resp: any) => {
      this.snackBar.open("Failed to update", "OK", {
        duration: 4000
      });
    })
  }

}