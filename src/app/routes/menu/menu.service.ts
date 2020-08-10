import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface MenuModel {
  text: string;
  iocn: string;
  link: string;
  sort: number;
}

@Injectable()
export class MenuService {
  baseUri = 'api/menu/list';
  constructor(private http: _HttpClient) {}

  addMenu(params: MenuModel): Observable<MenuModel> {
    return this.http.post(this.baseUri, params).pipe(map((res: { data: MenuModel }) => res.data));
  }

  delMunu(id: string): Observable<MenuModel> {
    return this.http.delete(`${this.baseUri}/${id}`).pipe(map((res: MenuModel) => res));
  }
}
