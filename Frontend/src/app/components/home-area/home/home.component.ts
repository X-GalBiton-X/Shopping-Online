import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { RoleModel } from 'src/app/models/role.model';
import { UserModel } from 'src/app/models/user.model';
import { authStore } from 'src/app/redux/auth.state';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

    public user: UserModel;
    private unsubscribe: Unsubscribe;

    constructor (private router: Router) { }

    public ngOnInit(): void {
        this.user = authStore.getState().user;
        this.unsubscribe = authStore.subscribe(() => {
            this.user = authStore.getState().user;
        });
        if (this.user?.role === RoleModel.Admin) {
            this.router.navigateByUrl("/admin-page");
        }
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

}