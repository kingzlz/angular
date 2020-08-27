import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SFCascaderWidgetSchema, SFSchema } from '@delon/form';
import { SFComponent } from '@delon/form/';
import { SettingsService, _HttpClient } from '@delon/theme';
import { deepCopy } from '@delon/util';
import { Select, Store } from '@ngxs/store';
import { AutoUnsubscribe } from '@utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { forkJoin, Observable, zip } from 'rxjs';
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
})
@AutoUnsubscribe()
export class ProAccountSettingsBaseComponent implements OnInit, OnDestroy {
  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private settingservice: SettingsService,
    private store$: Store,
    @Inject(Injector) public readonly injector: Injector,
  ) {}
  avatar = '';
  userLoading = true;
  user: ProAccountSettingsUser;
  formData: User;
  city = [];
  uid: string;
  schema: SFSchema = {};
  // #region geo
  ui = {
    '*': {
      spanLabelFixed: 100,
      // grid: { span: 8 },
    },
  };
  @ViewChild('sf', { static: false }) sf: SFComponent;
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
  ngOnDestroy(): void {}

  ngOnInit(): void {
    zip(this.http.get('assets/tmp/city.json'), this.userInfo$).subscribe(([city, info]) => {
      this.city = city;
      this.user = info;
      this.formData = info;
      if (info.area && typeof info.area === 'string') {
        this.formData.area = (info.area as string).split(',');
      }

      this.uid = info._id;
      this.userLoading = false;
      this.schema = {
        properties: {
          name: {
            type: 'string',
            title: '用户名',
          },
          nickName: {
            type: 'string',
            title: '昵称',
          },
          email: {
            type: 'string',
            title: '邮箱',
          },
          phone: {
            type: 'string',
            title: '电话',
          },
          area: {
            type: 'number',
            title: '地区',
            enum: this.city,
            ui: {
              widget: 'cascader',
              valueProperty: 'code',
              labelProperty: 'name',
              changeOnSelect: true,
            },
          },
        },
      };
      this.cdr.detectChanges();
    });

    // this.userInfo$.subscribe((info: ProAccountSettingsUser) => {
    //   if (!info) {
    //     return;
    //   }
    //   this.user = info;
    //   this.uid = info._id;
    //   this.userLoading = false;
    //   this.cdr.detectChanges();
    // });
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

  save(value: User): boolean {
    value = deepCopy(value);
    delete value.createdAt;
    delete value.updatedAt;
    delete value.password;
    delete value._id;
    value.area = (value.area as []).join(',');
    this.http.put(`api/user/list/${this.uid}`, value).subscribe((res) => {
      this.msg.success(res.msg);
      this.settingservice.setUser(res.data);
      this.store$.dispatch(new Edit(res.data));
    });
    return false;
  }

  change(args: NzUploadChangeParam): void {
    if (args.type !== 'success') {
      return;
    }
    this.sf.value.avatar = args.file.response.url;
    this.user.avatar = args.file.response.url;
  }
}
