import { User } from '../models/user.model';

export class Edit {
  static readonly type = '[user] Edit';
  constructor(public payload: User) {}
}
export class Login {
  static readonly type = '[user] login';
  constructor(public username: string, public password: string, public verify: string) {}
}
export class Logout {
  static readonly type = '[user] Logout';
  constructor() {}
}
