import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class TitleService {

  private appName: string = 'MedLink';

  constructor(private titleService: Title) {
  }

  updateTitle(title: string | null | undefined): void {
    if (!title) {
      return;
    }
    this.titleService.setTitle(`${title} | ${this.appName}`);
  }
}
