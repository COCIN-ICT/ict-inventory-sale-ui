import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pims';
  constructor(private store: Store<AppState>) {}
  ngOnInit() {
    this.store.dispatch(AuthActions.checkAuthStatus());
  }
}
