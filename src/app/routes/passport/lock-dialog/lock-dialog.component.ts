import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService, User } from '@delon/theme';

@Component({
  selector: 'app-lock-dialog',
  templateUrl: './lock-dialog.component.html',
  styleUrls: ['./lock-dialog.component.less'],
})
export class LockDialogComponent {
  f: FormGroup;

  get user(): User {
    return this.settings.user;
  }

  constructor(
    fb: FormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private settings: SettingsService,
    private router: Router,
  ) {
    this.f = fb.group({
      password: [null, Validators.required],
    });
  }

  submit(): void {
    // tslint:disable-next-line:forin
    for (const i in this.f.controls) {
      this.f.controls[i].markAsDirty();
      this.f.controls[i].updateValueAndValidity();
    }
    if (this.f.valid) {
      console.log('Valid!');
      console.log(this.f.value);
      this.router.navigate(['dashboard']);
    }
  }
}
