import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface MenuModel {
  pid: string;
  text: string;
  iocn: string;
  link: string;
  sort: number;
  children?: MenuModel[];
  level?: number;
  parent?: MenuModel;
  expand?: boolean;
}

@Injectable()
export class MenuService {
  baseUri = 'api/menu/list';
  constructor(private http: _HttpClient) {}

  getMenus(): Observable<MenuModel[]> {
    return this.http.get(this.baseUri).pipe(map((res: { data: MenuModel[] }) => res.data));
  }

  addMenu(params: MenuModel): Observable<MenuModel> {
    return this.http.post(this.baseUri, params).pipe(map((res: { data: MenuModel }) => res.data));
  }

  delMunu(id: string): Observable<MenuModel> {
    return this.http.delete(`${this.baseUri}/${id}`).pipe(map((res: MenuModel) => res));
  }
}
