import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-mobile-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './mobile-navbar.html',
  styleUrl: './mobile-navbar.css',
})
export class MobileNavbar {

  constructor(public authService: AuthService) {}

}
