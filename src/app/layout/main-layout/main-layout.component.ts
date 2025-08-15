import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    HeaderComponent,
    SidebarComponent,
  ],
  template: `
    <div class="layout-container">
      <app-header (sidenavToggle)="drawer.toggle()"></app-header>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav
          #drawer
          class="sidenav"
          fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false"
        >
          <app-sidebar></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [
    `
      .layout-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .sidenav-container {
        flex: 1;
      }

      .sidenav {
        width: 280px;
        border-right: 1px solid #e0e0e0;
      }

      .main-content {
        background-color: #f5f5f5;
      }

      .content-wrapper {
        padding: 24px;
        min-height: calc(100vh - 64px);
      }

      @media (max-width: 768px) {
        .content-wrapper {
          padding: 16px;
        }
      }

      @media (max-width: 480px) {
        .content-wrapper {
          padding: 12px;
        }
      }
    `,
  ],
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
