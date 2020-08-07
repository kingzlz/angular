import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class UserRegisterComponent implements OnDestroy, OnInit {
  constructor(fb: FormBuilder, private router: Router, public http: _HttpClient, public msg: NzMessageService, private doms: DomSanitizer) {
    this.form = fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
      confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]],
      phonePrefix: ['+86'],
      phone: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      verify: [null, [Validators.required]],
    });
  }

  // #region fields

  get email(): AbstractControl {
    return this.form.controls.email;
  }
  get password(): AbstractControl {
    return this.form.controls.password;
  }
  get confirm(): AbstractControl {
    return this.form.controls.confirm;
  }
  get phone(): AbstractControl {
    return this.form.controls.phone;
  }
  get verify(): AbstractControl {
    return this.form.controls.verify;
  }
  form: FormGroup;
  error = '';
  type = 0;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception',
  };
  verifyCode: SafeHtml;
  // #endregion

  // #region get captcha

  count = 0;
  interval$: any;

  static checkPassword(control: FormControl): void {
    if (!control) {
      return null;
    }
    const self: any = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'pool';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  static passwordEquar(control: FormControl): { equar: boolean } | null {
    if (!control || !control.parent) {
      return null;
    }
    if (control.value !== control.parent.get('password').value) {
      return { equar: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.getVrifyCode();
  }

  getVrifyCode(): void {
    this.http.get('api/verify?_allow_anonymous=true', null, { responseType: 'text' }).subscribe((res) => {
      this.verifyCode = this.doms.bypassSecurityTrustHtml(res);
    });
  }
  getCaptcha(): void {
    if (this.phone.invalid) {
      this.phone.markAsDirty({ onlySelf: true });
      this.phone.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  submit(): void {
    this.error = '';
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }

    const data = this.form.value;
    this.http.post('api/register?_allow_anonymous=true', data).subscribe((res) => {
      console.log(res);
      this.msg.success(res.message);
      this.router.navigateByUrl('/passport/login');
      // this.router.navigateByUrl('/passport/register-result', {
      //   queryParams: { email: data.mail },
      // });
    });
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
