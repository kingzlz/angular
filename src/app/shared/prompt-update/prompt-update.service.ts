import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { cacheTime } from '@bigtree/business-core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PromptUpdateComponent } from './prompt-update.component';

@Injectable({
  providedIn: 'root',
})
export class PromptUpdateService {
  protected get http(): HttpClient {
    return this.injector.get(HttpClient, null);
  }

  protected get router(): Router {
    return this.injector.get(Router, null);
  }

  private drawerRef: NzDrawerRef<PromptUpdateComponent, { result: number }> = null;
  private lastETag: string = null;
  private lastModifyStrDate: string = null;
  private lastModifyDate: number = null;
  private checkForUpdate$: Observable<any> = null;
  private dueTime: number = 1000 * 30;
  constructor(private injector: Injector, private updates: SwUpdate, private drawerService: NzDrawerService) {}

  startMonitor(): void {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe((data) => {
        this.prompt();
      });
    } else {
      this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationError || evt instanceof NavigationCancel || evt instanceof NavigationEnd) {
          this.checkForUpdate();
        }
      });
    }
  }

  private checkForUpdate(): void {
    if (!this.checkForUpdate$) {
      this.checkForUpdate$ = cacheTime(this.dueTime)(
        of(null).pipe(
          switchMap(() => {
            const headers: any = {};

            if (this.lastETag) {
              headers['If-None-Match'] = this.lastETag;
            }
            if (this.lastModifyStrDate) {
              headers['If-Modified-Since'] = this.lastModifyStrDate;
            }

            return this.http.head(`/assets/tmp/app-data.json?_allow_anonymous=true&_rn=${Math.random()}`, {
              headers: {
                ...headers,
              },
              observe: 'response',
            });
          }),
          catchError(() => of(null)),
          tap((res: HttpResponse<any>) => {
            try {
              if (res && res.headers && res.headers.get) {
                const strDate: string = res.headers.get('Last-Modified') || null;

                if (strDate) {
                  const lastModifyDate: number = new Date(strDate).valueOf();

                  if (this.lastModifyDate) {
                    if (this.lastModifyDate !== lastModifyDate) {
                      this.prompt();
                    }
                  }
                  this.lastModifyStrDate = strDate;
                  this.lastModifyDate = lastModifyDate;
                } else {
                  const strETag: string = res.headers.get('ETag') || null;

                  if (strETag) {
                    if (this.lastETag) {
                      if (this.lastETag !== strETag) {
                        this.prompt();
                      }
                    }

                    this.lastETag = strETag;
                  }
                }
              }
            } catch (err) {}
          }),
        ),
      );
    }

    this.checkForUpdate$.subscribe();
  }

  private prompt(): void {
    if (this.drawerRef) {
      return;
    }

    this.drawerRef = this.drawerService.create<PromptUpdateComponent, { tips: string }, { result: number }>({
      nzClosable: false,
      nzMaskClosable: false,
      nzMask: true,
      nzTitle: undefined,
      nzContent: PromptUpdateComponent,
      nzContentParams: {
        tips: '检测到有新版本发布，是否现在刷新？',
      },
      nzHeight: '75px',
      nzPlacement: 'top',
    });

    this.drawerRef.afterClose.subscribe((data) => {
      this.drawerRef = null;
      if (data.result === 1) {
        if (this.updates.isEnabled) {
          this.updates.activateUpdate().then(() => document.location.reload());
        } else {
          document.location.reload();
        }
      }
    });
  }
}
