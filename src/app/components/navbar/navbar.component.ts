import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthInfo } from '../../models/users/authInfoInterface';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  subscriptions:Subscription[];
  authInfo:AuthInfo = null;

  constructor(
    private authService:AuthService,
    private ref:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let sub = this.authService.currentToken.subscribe(auth => {
      this.authInfo = auth;
      this.ref.markForCheck();
    });
  }

  logout(){
    let sub = this.authService.logout().subscribe({
      next:response => {
        sub.unsubscribe()
      },
      error:err => {
        sub.unsubscribe();
        console.warn('Error logging out: ',err);
      }
    })
  }

}
