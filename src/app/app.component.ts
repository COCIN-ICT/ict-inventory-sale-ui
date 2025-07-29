import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pims';
  constructor(private store: Store) {}
  ngOnInit() {
    this.store.dispatch(AuthActions.checkAuthStatus());
  }
}
