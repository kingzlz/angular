import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Select, Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, zip } from 'rxjs';
import { User } from 'src/app/store/models/user.model';
import { UserState } from 'src/app/store/states/user.state';
import { Edit } from '../../../../../store/actions/user.action';
interface ProAccountSettingsUser {
  _id: string;
  email: string;
  name: string;
  password?: string;
  profile?: string;
  country?: string;
  address?: string;
  updatedAt?: string;
  createdAt?: string;
  phone: string;
  avatar: string;
  nickName: string;
  geographic?: {
    province: {
      key: string;
    };
    city: {
      key: string;
    };
  };
}

interface ProAccountSettingsCity {
  name: string;
  id: string;
}

@Component({
  selector: 'app-account-settings-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProAccountSettingsBaseComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private store$: Store,
    @Inject(Injector) public readonly injector: Injector,
  ) {}
  avatar = '';
  userLoading = true;
  user: ProAccountSettingsUser;
  uid: string;

  // #region geo

  @Select(UserState.getLoginUser) userInfo$: Observable<User>;
  provinces: ProAccountSettingsCity[] = [];
  cities: ProAccountSettingsCity[] = [];

  beforeUpload = (file: NzUploadFile): boolean => {
    // this.fileList = this.fileList.concat(file);
    console.log(file);

    return false;
  };

  handlePreview = (file: NzUploadFile) => {
    const _url = file.thumbUrl || file.url;
    if (!_url) {
      return;
    }
    this.injector.get<NzModalService>(NzModalService).create({
      nzContent: `<img src="${_url}" class="img-fluid" />`,
      nzFooter: null,
    });
  };

  ngOnInit(): void {
    this.userInfo$.subscribe((info: ProAccountSettingsUser) => {
      if (!info) {
        return;
      }
      this.user = info;
      this.uid = info._id;
      this.userLoading = false;
      this.cdr.detectChanges();
    });
    // zip(this.http.get('/user/current'), this.http.get('/geo/province')).subscribe(
    //   ([user, province]: [ProAccountSettingsUser, ProAccountSettingsCity[]]) => {
    //     this.userLoading = false;
    //     this.user = user;
    //     this.provinces = province;
    //     this.choProvince(user.geographic.province.key, false);
    //     this.cdr.detectChanges();
    //   },
    // );
  }

  choProvince(pid: string, cleanCity: boolean = true): void {
    this.http.get(`/geo/${pid}`).subscribe((res) => {
      this.cities = res;
      if (cleanCity) {
        this.user.geographic.city.key = '';
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion

  save(): boolean {
    // this.msg.success(JSON.stringify(this.user));
    delete this.user.createdAt;
    delete this.user.updatedAt;
    delete this.user.password;
    delete this.user._id;
    this.http.put(`api/user/list/${this.uid}`, this.user).subscribe((res) => {
      this.msg.success(res.msg);
      this.store$.dispatch(new Edit(res.data));
    });
    return false;
  }

  change(args: NzUploadChangeParam): void {
    console.log(args);
    if (args.type !== 'success') {
      return;
    }

    this.user.avatar = args.file.response.url;
  }
}
