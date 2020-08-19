import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Login } from '../../../store/actions/user.action';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy, OnInit {
  // #region fields

  get userName(): AbstractControl {
    return this.form.controls.userName;
  }
  get password(): AbstractControl {
    return this.form.controls.password;
  }
  get mobile(): AbstractControl {
    return this.form.controls.mobile;
  }
  get captcha(): AbstractControl {
    return this.form.controls.captcha;
  }
  get verify(): AbstractControl {
    return this.form.controls.verify;
  }
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;
  // #region get captcha

  count = 0;
  interval$: any;
  verifyCode: SafeHtml;
  // #endregion
  constructor(
    fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    private doms: DomSanitizer,
    private store$: Store,
  ) {
    this.form = fb.group({
      // userName: [null, [Validators.required, Validators.pattern(/^(admin|user)$/)]],
      // password: [null, [Validators.required, Validators.pattern(/^(ng\-alain\.com)$/)]],
      // mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      verify: [null, [Validators.required]],
      remember: [true],
    });
  }

  ngOnInit(): void {
    this.getVrifyCode();
  }

  switch({ index }: { index: number }): void {
    this.type = index;
  }

  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
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
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      this.verify.markAsDirty();
      this.verify.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.verify.markAsDirty();
      this.verify.updateValueAndValidity();
      if (this.mobile.invalid || this.verify.invalid) {
        return;
      }
    }
    this.loading = true;
    this.store$.dispatch(new Login(this.userName.value, this.password.value, this.verify.value)).subscribe(
      () => {
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        this.error = (err && err.message) || '';
      },
    );

    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    // this.http
    //   .post('api/login?_allow_anonymous=true', {
    //     name: this.userName.value,
    //     password: this.password.value,
    //     verify: this.verify.value,
    //   })
    //   .subscribe(({ token }) => {
    //     // 清空路由复用信息
    //     this.reuseTabService.clear();
    //     // 设置用户Token信息
    //     // TODO: Mock expired value
    //     // res.user.expired = +new Date() + 1000 * 60 * 5;
    //     this.tokenService.set({ token });
    //     // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
    //     this.startupSrv.load().then(() => {
    //       // let url = this.tokenService.referrer.url || '/';
    //       // if (url.includes('/passport')) {
    //       //   url = '/';
    //       // }
    //       this.router.navigateByUrl('/index');
    //     });
    //   });
  }

  // #region social

  open(type: string, openType: SocialOpenType = 'href'): void {
    let url = ``;
    let callback = ``;
    // tslint:disable-next-line: prefer-conditional-expression
    if (environment.production) {
      callback = 'https://ng-alain.github.io/ng-alain/#/callback/' + type;
    } else {
      callback = 'http://localhost:4200/#/callback/' + type;
    }
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe((res) => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  getVrifyCode(): void {
    this.http.get('api/verify?_allow_anonymous=true', null, { responseType: 'text' }).subscribe((res) => {
      this.verifyCode = this.doms.bypassSecurityTrustHtml(res);
    });
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
