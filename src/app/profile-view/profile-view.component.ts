import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' }

  movies: any[] = []
  fav: any[] = []
  favMovie: any = []
  user: any = {}

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.getUser()
    this.getMovies()
    this.getFav()
  }

 getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  filterFav(): void {
    this.movies.forEach((movie: any) => {
      if (this.fav.includes(movie._id)) {
        this.favMovie.push(movie.Title);
      }
    });
    console.log(this.favMovie);
    return this.favMovie;
  }


  getFav(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.fav = resp.FavoriteMovies((movie: any) => movie._id);
      console.log(this.fav);
      return this.filterFav();
    });
  }

  removeFav(movieId: string, title: string): void {

    this.fetchApiData.deleteMovie(movieId).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(`Removed ${title} from Watchlist`, 'OK', {
        duration: 4000,
      });
    });
    this.ngOnInit();
    return this.getFav();
  }



  getUser(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.user = resp
      return this.user
    })
  }


  editUserInfo(): void {
    const updatedData = {
      Username: this.userData.Username ? this.userData.Username : this.user.Username,
      Password: this.userData.Password ? this.userData.Password : this.user.Password,
      Email: this.userData.Email ? this.userData.Email : this.user.Email,
      Birthday: this.userData.Birthday ? this.userData.Birthday : this.user.Birthday,
    }

    this.fetchApiData.editUser(updatedData).subscribe((resp: any) => {
      console.log(resp)
      this.snackBar.open("Profile updated", "OK", {
        duration: 4000
      });
      localStorage.setItem('user', resp.Username)
      this.getUser()
    }, (resp: any) => {
      console.log(resp)
      this.snackBar.open("Failed to update", "OK", {
        duration: 4000
      });
    })
  }
}