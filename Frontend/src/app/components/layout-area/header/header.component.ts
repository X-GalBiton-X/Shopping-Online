import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    public user: UserModel;
    private unsubscribe: Unsubscribe;

    constructor(private authService: AuthService, private router: Router) { }

    public ngOnInit(): void {
        this.user = authStore.getState().user;
        this.unsubscribe = authStore.subscribe(() => {
            this.user = authStore.getState().user;
        });
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

    public logout() {
        try {
            this.authService.logout();
            this.router.navigateByUrl("/home");
        }
        catch (err: any) {
            alert(err.message);
        }
    }

}