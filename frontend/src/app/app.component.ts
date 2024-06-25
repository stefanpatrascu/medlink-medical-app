import { Component, OnInit } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { NgxEditorModule } from 'ngx-editor';
import { MessageService } from 'primeng/api';
import { Router, RouterOutlet } from '@angular/router';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    MessageModule,
    MessagesModule,
    ToastModule,
    HttpClientModule,
    NgxEditorModule,
  ],
  providers: [
    MessageService
  ]
})
export class AppComponent implements OnInit {

  constructor(private router: Router,
              private title: TitleService) {
  }

  ngOnInit(): void {
    this.onChangeRoute();
  }

  onChangeRoute(): void {
    this.router.events.subscribe((event: any) => {
      if (event.snapshot?.data?.title) {
        this.title.updateTitle(event.snapshot.data.title);
      }
    });
  }

}
