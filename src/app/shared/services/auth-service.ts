import { Injectable } from '@angular/core';
import { RefreshTokenHttp } from './refresh-token-http';
import { map, Observable, ReplaySubject, tap, BehaviorSubject } from 'rxjs';
import { LogoutHttp } from './logout-http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Questi variabili determinano lo stato di autenticazione del'user

  // Se il token c'è, ritorna TRUE, quindi è loggato
  private loggedSubject = new BehaviorSubject<boolean>(this.hasToken()); 

  // Rende lo stato leggibile per altri classi
  public logged$ = this.loggedSubject.asObservable();

  // Ritorna l'email attualmente loggato
  private emailSubject = new BehaviorSubject<string | null>(this.getStoredEmail());
  public email$ = this.emailSubject.asObservable();

  // Ritorna TRUE, se l'utente loggato è Admin
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private httpRefresh: RefreshTokenHttp, private httpLogout: LogoutHttp) {
    // Serve per mantenere il ruolo dell'admin ADMIN,
    // Perché ci sono casi che se si ricarica la pagina con F5, il ruolo da admin può essere non considerato
    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    if (token) {
      const isAdmin = this.extractIsAdminFromToken(token);
      this.isAdminSubject.next(isAdmin);
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwtToken') || !!sessionStorage.getItem('jwtToken');
  }

  private getStoredEmail(): string | null {
    return localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
  }

  /**
   * ci permette di salvare il token
   * al localStorage o al sessionStorage
   * @param isLogged 
   * @param token 
   * @param email 
   * @param persistent 
   */
  SetJwtInfo(isLogged: boolean, token: string = '', email?: string, persistent: boolean = true) {
    if (isLogged) {
      // Token STORAGE
      if (persistent) {
        localStorage.setItem('jwtToken', token);
        if (email) localStorage.setItem('userEmail', email);
        sessionStorage.clear();
      } else {
        sessionStorage.setItem('jwtToken', token);
        if (email) sessionStorage.setItem('userEmail', email);
        localStorage.clear();
      }

      const isAdmin = this.extractIsAdminFromToken(token);
      this.isAdminSubject.next(isAdmin);

      // Reactive updates
      this.loggedSubject.next(true);
      if (email) this.emailSubject.next(email);

    } else {
      // Clear everything
      localStorage.clear();
      sessionStorage.clear();

      // Reactive updates
      this.loggedSubject.next(false);
      this.emailSubject.next(null);
      this.isAdminSubject.next(false);
    }
  }

  private refreshInProgress = false;
  private refreshSubject = new ReplaySubject<string>(1);

  refreshToken(): Observable<string> {

    const refreshRequest = this.httpRefresh.HttpPostRefreshToken();

    // If a refresh request is already running → queue this request
    if (this.refreshInProgress) {
      return this.refreshSubject.asObservable();
    }

    // Begin refresh process
    this.refreshInProgress = true;

    return refreshRequest.pipe(
      tap(response => {
        const newToken = response.body?.token;
        const email = this.getStoredEmail();

        if (newToken) {
          console.log(
            '%c[AUTHENTICATION SERVICE] NEW ACCESS TOKEN HAS BEEN PROVIDED.',
            'color: limegreen; font-weight: bold;'
          );
          this.SetJwtInfo(true, newToken, email ?? undefined, true);
        }

      }),
      map(response => response.body?.token as string),
      tap(newToken => {
        this.refreshInProgress = false;
        this.refreshSubject.next(newToken);
      })
    );
  }

  logoutBackend() {
    return this.httpLogout.HttpPostLogout()
      .pipe(
        tap(() => this.SetJwtInfo(false, '')));
  }

  /**
   * controlla il ruolo dell'utente tramite il token ricevuto
   * @param token 
   * @returns true se l'utente è un Admin
   */
  private extractIsAdminFromToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role === 'Admin';
    } catch {
      return false;
    }
  }


}
