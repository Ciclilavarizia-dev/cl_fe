import { Component, ElementRef, HostListener, ViewChild, Output, EventEmitter } from '@angular/core';
import { MainCategoriesBar } from './main-categories-bar/main-categories-bar';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth-service';
import { SearchBar } from '../../../features/search-bar/search-bar';
import { AlertService } from '../../../shared/services/alert-service';
import { CartBadgeComponent } from '../navbar/cart-badge/cart-badge';

@Component({
  selector: 'app-navbar',
  imports: [MainCategoriesBar, RouterLink, CommonModule, SearchBar, CartBadgeComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  @Output() openAdvancedSearchModal = new EventEmitter<void>();

  isLogged = false;
  userEmail: string | null = null;

  // responsiveness
  showHamburgerMenu = false;

  // user menu
  showUserMenu = false;

  // for scrolling
  lastScroll = 0;
  offset = 0;
  navbarHeight = 0;

  @ViewChild('navbar', { static: true }) navbar!: ElementRef<HTMLElement>;

  childLinks = [
    { label: 'BIKES', path: '/bikes' },
    { label: 'COMPONENT', path: '/component' },
    { label: 'CLOTHING', path: '/clothing' },
    { label: 'ACCESSORIES', path: '/accessories' },
  ];

  // Costrutto per implementare il logout
  constructor(private router: Router, public authService: AuthService, private alertService: AlertService) { }

  ngAfterViewInit() {
    this.navbarHeight = this.navbar.nativeElement.offsetHeight;
  }

  ngOnInit() {
    // Subscribe to login updates
    this.authService.logged$.subscribe(v => this.isLogged = v);
    this.authService.email$.subscribe(e => this.userEmail = e);
  }

  logout() {
    this.authService.logoutBackend().subscribe(() => {

      this.alertService.showAlert('logged out successfully', 'success');

      this.router.navigate(['/login']);
      console.log('logout successful');
    });
  }

  // Hover behavior only when logged in
  private hideTimeout: any;

  showMenuNow(state: boolean) {
    if (!this.isLogged) return;
    clearTimeout(this.hideTimeout);
    this.showUserMenu = state;
  }

  hideMenuWithDelay() {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.showUserMenu = false;
    }, 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 727 && this.showHamburgerMenu) {
      this.showHamburgerMenu = false;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const current = window.scrollY;
    const delta = current - this.lastScroll;

    // scrolling down -> move up
    if (delta > 0) {
      this.offset = Math.max(this.offset - delta, -this.navbarHeight);
    }

    // scrolling up -> move down
    if (delta < 0) {
      this.offset = Math.min(this.offset - delta, 0);
    }

    // per far apparire subito quando ritorni su
    if (current === 0) {
      this.offset = 0;
    }

    this.lastScroll = current;
  }

  toggleMenu() {
    this.showHamburgerMenu = !this.showHamburgerMenu;
  }
}
