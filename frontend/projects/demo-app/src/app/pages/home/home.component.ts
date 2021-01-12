import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';

import { UsersService } from '@t4d-wnow/user-lib';
import { CurrentUser } from '@t4d-wnow/user-lib';
import { LoginForm } from '@t4d-wnow/user-lib';
import { Observable } from 'rxjs';
import { ClearErrorMessage, SetErrorMessage } from '../../actions/error-message.actions';
import { AppState } from '../../models/AppState';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @Select((state: { app: AppState }) => state.app.errorMessage)
  public errorMessage$: Observable<string> | undefined;

  get currentUser(): CurrentUser | null {
    return this.usersSvc.getCurrentUser();
  }

  constructor(
    private usersSvc: UsersService,
    private store: Store,
  ) { }

  ngOnInit(): void {
  }

  doLogin(loginForm: LoginForm): void {
    this.usersSvc.loginEmployee(loginForm.username, loginForm.password).subscribe({
      next: () => {
        // this.errorMessage = '';
        this.store.dispatch(new ClearErrorMessage());
      },
      error: (err) => {
        if (err.status === 404) {
          // this.errorMessage = 'Username and password not found.';
          this.store.dispatch(new SetErrorMessage('Username and password not found.'));
        } else {
          // this.errorMessage = 'Unknown login error.';
          this.store.dispatch(new SetErrorMessage('Unknown login error.'));
        }
      }
    });
  }

  doClear(): void {
    console.log('clicked clear');
    // this.errorMessage = '';
    this.store.dispatch(new ClearErrorMessage());
  }

}
