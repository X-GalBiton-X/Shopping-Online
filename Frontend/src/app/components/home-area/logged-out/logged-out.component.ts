import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsModel } from 'src/app/models/credentials.model';
import { RoleModel } from 'src/app/models/role.model';
import { authStore } from 'src/app/redux/auth.state';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-logged-out',
    templateUrl: './logged-out.component.html',
    styleUrls: ['./logged-out.component.css']
})
export class LoggedOutComponent {

    public credentials = new CredentialsModel();
    public role: RoleModel;

    constructor(private authService: AuthService, private router: Router) { }

    public async send() {
        try {
            await this.authService.login(this.credentials);
            alert("You are now logged in!");
            this.role = authStore.getState().user.role;
            if (this.role === RoleModel.Admin) {
                this.router.navigateByUrl("/admin-page");
            }
        }
        catch (err: any) {
            alert(err.message);
        }
    }

}