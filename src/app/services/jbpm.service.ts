import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable } from 'rxjs';
import { AuthService } from '~services/auth.service';

@Injectable()
export class JbpmService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createInstance(flujo: string, submissionId: string, url:string): Observable<any> {
    let path = CONSTANTS.routes.jbpm.createInstance.replace(':flujo', flujo);
    return this.http.post<any>(
      path,
      {
        initiator: CONSTANTS.routes.jbpm.initiator,
        submissionId: submissionId,
        kctoken: this.authService.getTokenKC(),
        url: url
      },
      { responseType: 'json', observe: 'body' }
    );
  }

}
