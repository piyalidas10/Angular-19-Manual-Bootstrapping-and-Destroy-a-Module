import { Component, input, OnInit, output } from '@angular/core';
import { ChatStateService } from '../chat-app/chat-state.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: false,
})
export class HomePageComponent implements OnInit {
  readonly isChatOpen = input.required<boolean>();
  isHomePage = output<boolean>();
  constructor(public chatState: ChatStateService) {}

  ngOnInit(): void {}

  onClick() {
    this.isHomePage.emit(true);
  }
}
