import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-step-two',
    templateUrl: './step-two.component.html',
    styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit {

    public user = new UserModel();
    public cities: object;

    constructor(private authService: AuthService, private router: Router) { }

    public async ngOnInit() {
        try {
            this.cities = await this.authService.getAllCities();
        }
        catch (err: any) {
            alert(err.message);
        }
    }

    public async send() {
        try {
            this.user.userId = this.authService.midRegister.userId;
            this.user.username = this.authService.midRegister.username;
            this.user.password = this.authService.midRegister.password;
            await this.authService.register(this.user);
            alert("You have completed registration!");
            this.router.navigateByUrl("/home");
        }
        catch (err: any) {
            alert(err.message);
        }
    }

}