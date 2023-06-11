import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MidRegisterModel } from 'src/app/models/mid-register.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-step-one',
    templateUrl: './step-one.component.html',
    styleUrls: ['./step-one.component.css']
})
export class StepOneComponent {

    public midRegister = new MidRegisterModel();
    public confirmPassword: string;

    constructor(private authService: AuthService, private router: Router) { }

    public next() {
        try {
            if(this.confirmPassword !== this.midRegister.password) {
                alert("'Confirm Password' must be equal to 'Password'");
                return;
            }
            this.authService.midRegister = this.midRegister;
            alert("✅");
            this.router.navigateByUrl("/step-two");
        }
        catch (err: any) {
            alert(err.message);
        }
    }

}