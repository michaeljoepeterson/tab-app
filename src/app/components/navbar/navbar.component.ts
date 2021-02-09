import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit(): void {
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
