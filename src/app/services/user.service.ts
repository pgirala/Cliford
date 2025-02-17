import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';
import { User } from '~app/models/user';
import { Role } from '~app/models/role';
import { FormioContextService } from '~services/formio-context.service';

import { FormioProvider } from '~base/formio-provider';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class UserService implements FormioProvider {
  private roleList: Array<Role>;
  constructor(private http: HttpClient, private formioContextService: FormioContextService) { }

  ping(): Observable<Object> {
    let path = environment.settings.BK_HOST + CONSTANTS.routes.check.ping;

    return this.http.get<Object>(
      path,
      { responseType: 'json', observe: 'body' }
    );
  }

  getListaRoles(): Array<Role> {
    return this.roleList;
  }

  setListaRoles(listaRoles: Array<Role>) {
    this.roleList = listaRoles;
  }

  getRoleList(token: string): Observable<Array<Role>> {
    let path = environment.settings.FI_HOST + CONSTANTS.routes.role.list;

    let headers = new HttpHeaders({
      'x-jwt-token': token
    });

    return this.http.get<Array<Role>>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Array<User>> {
    return null;
  }

  getOne(email: string): Observable<User> {
    let path = environment.settings.FI_HOST + CONSTANTS.routes.user.find.replace(':email', email);

    let headers = new HttpHeaders({
      'x-jwt-token': this.formioContextService.getTokenFormio()
    });

    return this.http.get<User>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  getOneIndividual(email: string): Observable<User> {
    let path = environment.settings.FI_HOST + CONSTANTS.routes.user.find.replace(':email', email);

    let headers = new HttpHeaders({
      'x-jwt-token': this.formioContextService.getTokenFormioIndividual()
    });

    return this.http.get<User>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  getOneOrganizacion(email: string): Observable<User> {
    let path = environment.settings.FI_HOST + CONSTANTS.routes.user.find.replace(':email', email);

    let headers = new HttpHeaders({
      'x-jwt-token': this.formioContextService.getTokenFormioOrganizacion()
    });

    return this.http.get<User>(
      path,
      { headers: headers, responseType: 'json', observe: 'body' }
    );
  }

  save(item: Object): Observable<User> {
    return null;
  }

  delete(id: string): Observable<User> {
    return null;
  }
}
