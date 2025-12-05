import { Component } from '@angular/core';
import { HighlightSection } from './highlight-section/highlight-section';

@Component({
  selector: 'app-home',
  imports: [HighlightSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
