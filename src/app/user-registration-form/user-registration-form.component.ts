/**
 * Renders a registration form for users to make a new account.  
 * The user must supply a valid Username, Password, Email, and 
 * (optional) Birthday.
 * 
 * @module UserRegistrationFormComponent
 */

import { Component, OnInit, Input } from '@angular/core';
//to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
// display notification back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})

export class UserRegistrationFormComponent implements OnInit {

/**
  * The input userData is empty strings by default.
  * This is updated when the suer types into the form fields.
  */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };
  

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router) { }


  ngOnInit(): void {
  }

/**
  * function is sending the form input to the backend
  * Attempts to register the user with the input credentials.  
  * Upon sucessful registration, the user can then log in.  
  * If registration fails, the user sees a snackbar dialog 
  * warning them that the credentials are invalid.
  */
   registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      this.dialogRef.close(); // closes the modal
      this.openUserLoginDialog(this.userData.Username);
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  openUserLoginDialog(
    username: string
  ): void {
    this.dialog.open(UserLoginFormComponent, {
      data: username,
      width: '320px'
    });
  }

}