import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenModel, TokenService } from '@delon/auth';
import { MenuService, SettingsService, _HttpClient } from '@delon/theme';
import { Action, Actions, NgxsOnInit, ofActionSuccessful, Selector, State, StateContext } from '@ngxs/store';
import { throwSilenceError } from '@utils';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Edit, Login, Logout } from '../actions/user.action';
import { User } from '../models/user.model';

export class AuthStateModel {
  error?: any;
}

export class UserStateModel {
  userInfo: User;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    userInfo: null,
  },
})
@State<AuthStateModel>({
  name: 'auth',
  defaults: {},
})
@Injectable()
export class UserState implements NgxsOnInit {
  @Selector()
  static getLoginUser(state: UserStateModel): User {
    return state.userInfo;
  }
  constructor(
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN)
    private tokenService: TokenService,
    private settings: SettingsService,
    private actions: Actions,
    private menuService: MenuService,
    private aclService: ACLService,
    private router: Router,
    private http: _HttpClient,
    private startupSrv: StartupService,
  ) {}

  ngxsOnInit(ctx?: StateContext<any>): void | any {
    this.actions.pipe(ofActionSuccessful(Logout)).subscribe(() => {
      const loginUrl: string = this.tokenService.login_url || '/passport/login';
      this.router.navigateByUrl(loginUrl);
    });
    this.actions.pipe(ofActionSuccessful(Login)).subscribe(() => {
      this.clearApplicationStateWithoutToken();
    });
  }
  @Action(Edit)
  edit({ patchState, setState }: StateContext<UserStateModel>, action: Edit) {
    // console.log(action.payload);
    // 如果  @Select(UserState) userInfo$: Observable<User>; 用此行重新赋值
    // setState(action.payload);
    // 如用: @Select(UserState.getLoginUser) userInfo$: Observable<User>; 则注释上行
    patchState({
      userInfo: action.payload,
    });
  }

  @Action(Login, { cancelUncompleted: true })
  login({ patchState }: StateContext<AuthStateModel>, { username, password, verify }: Login) {
    // 登录之前先清空之前的状态
    this.clearApplicationStateWithoutToken();
    const encrypt_data = {
      password,
    };
    const no_data = {
      username,
      verify,
      password,
    };

    this.http
      .post('api/login?_allow_anonymous=true', {
        name: username,
        password,
        verify,
      })
      .pipe(
        tap(({ data }) => {
          // 清空路由复用信息
          this.reuseTabService.clear();
          // 设置用户Token信息
          this.tokenService.set({ token: data });
        }),
        tap(() => {
          patchState({
            error: null,
          });
        }),
        catchError((err: any) => {
          patchState({
            error: {
              ...(err || {}),
            },
          });

          return throwSilenceError(err);
        }),
      )
      .subscribe(({ token }) => {
        // 清空路由复用信息
        this.reuseTabService.clear();

        this.tokenService.set({ token });
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().then(() => {
          this.router.navigateByUrl('/index');
        });
      });
  }

  @Action(Logout, { cancelUncompleted: true })
  logout() {
    const tokenData: ITokenModel = this.tokenService.get();

    if (tokenData && tokenData.token) {
      return this.http.post('api/logout').pipe(
        tap(() => {
          try {
            this.clearApplicationStateWithoutToken();
          } catch (err) {}
        }),
        catchError((err) => {
          return throwSilenceError(err);
        }),
      );
    }

    return of(null);
  }

  private clearApplicationStateWithoutToken(): void {
    try {
      this.tokenService.clear();
      this.settings.setUser(null);
      this.menuService.clear();
      this.aclService.setFull(false);
      this.aclService.setAbility([]);
      this.aclService.setRole([]);
      localStorage.clear();
      this.router.navigateByUrl(this.tokenService.login_url);
    } catch (err) {}
  }
}
