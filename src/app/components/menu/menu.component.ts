import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from './menu.interface';
import { NgClass, NgFor } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, map } from 'rxjs';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule, NgFor, RouterModule, NgClass],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let dark: boolean = false;
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['dark']) {
            dark = route!.snapshot.data['dark'];
          }
          return dark;
        })
      )
      .subscribe((dark: boolean) => {
        this.dark = dark;
      });
  }
  dark: boolean = false;
  @Input() buttons: MenuItem[] = [];
}
