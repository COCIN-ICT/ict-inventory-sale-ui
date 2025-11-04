import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';



const API_URL = `${environment.apiUrl}/auth/refresh`;

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(private http: HttpClient) { }

//   refreshToken() {
//   const refreshToken = localStorage.getItem('refresh_token');
//   return this.http.post(`${API_URL}`, { refreshToken });
// }

refreshToken(refreshToken: string): Observable<any> {
    return this.http.post<any>(`${API_URL}`, { refreshToken });
  }


}