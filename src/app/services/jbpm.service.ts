import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';

import { Submission } from '~app/models/submission';

import { Response } from '~app/models/response';

@Injectable()
export class JbpmService {

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) { }

  createInstance(flujo: string, submissionId: string): Observable<any> {
    let cabeceras = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.keycloakService.getAcreditacionFio().email + ':' + this.keycloakService.getAcreditacionFio().password),
      'Access-Control-Allow-Origin': '*'
    });
    let path = CONSTANTS.routes.jbpm.createInstance.replace(':flujo', flujo);
    return this.http.post<any>(
      path,
      {submissionId: submissionId},
      { headers: cabeceras, responseType: 'json', observe: 'body'}
    );
  }

}
