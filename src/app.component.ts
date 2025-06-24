import {
  ApplicationRef,
  Component,
  NgZone,
  OnInit,
  PlatformRef,
  inject,
  signal,
} from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ChatAppModule } from './chat-app/chat-app.module';
import { ChatStateService } from './chat-app/chat-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent implements OnInit {
  isShowMessage: boolean = false;
  hasNewMessage$!: Observable<boolean>;
  chat = inject(ChatStateService);
  appRef = inject(ApplicationRef);
  platformRef = inject(PlatformRef);
  ngZone = inject(NgZone);
  isChatOpen = signal(false);
  chatModuleRef: any;

  constructor() {
    console.log('Service instance in AppComponent: ', this.chat.id);
  }

  ngOnInit(): void {
    this.hasNewMessage$ = this.chat.newMessages$.pipe(
      tap(() => {
        queueMicrotask(() => this.appRef.tick());
      }),
      map((value) => !!value)
    );
  }

  onClickOpenChat() {
    this.bootstrapChatModule();
  }

  bootstrapChatModule() {
    if (document.getElementsByTagName('app-chat')?.length === 0) {
      const element = document.createElement('app-chat');
      document.body.appendChild(element);
    }
    // Note: We need to create the NgZone _before_ we instantiate the module
    this.ngZone.runOutsideAngular(() => {
      this.platformRef
        .bootstrapModule(ChatAppModule)
        .then((chatModuleRef) => {
          // appRef is of type ApplicationRef
          // Store this appRef if you need to destroy it later
          // e.g., window['myAngularAppRef'] = appRef;
          this.chatModuleRef = chatModuleRef;
          console.log('Chat => ', chatModuleRef);
        })
        .catch((err) => console.error(err));
      this.isChatOpen.set(true);
      this.isShowMessage = true;
    });
  }

  switchToHomePage(value: boolean) {
    if (value) {
      if (this.chatModuleRef) {
        this.chatModuleRef.destroy();
        // (window as any)['chatModuleRef'] = null; // Clear the reference
        this.isChatOpen.set(false);
        this.isShowMessage = false;
      }
    }
  }
}
