import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CONSTANTS } from '~utils/constants';

import { Observable, Subject } from 'rxjs';
import { KeycloakService } from '../keycloak/keycloak.service';
import { JbpmService } from '~app/services/jbpm.service';

import { Submission } from '~app/models/submission';

import { Response } from '~app/models/response';

@Injectable()
export class TareaService {
  tareasVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService,
    private jbpmService: JbpmService
  ) { }

  headers = new HttpHeaders({
    'Authorization': this.keycloakService.getAuthHeader()
  });

  comenzar(data: any): Observable<any> {
    return this.cambiarEstado(data, 'started');
  }

  completar(data: any): Observable<any> {
    return this.cambiarEstado(data, 'completed');
  }

  guardarBorrador(data: any): Observable<any> {
    return this.setDatosSalidaFormulario(data);
  }

  cambiarEstado(data: any, estado: string): Observable<any> {
    return this.jbpmService.cambiarEstadoTarea(data["idTarea"], data["idContenedor"], estado, data['form']['data']);
  }

  getDatosEntradaFormulario(idTarea: string, idContenedor: string): Observable<any> {
    return this.jbpmService.getDatosEntradaFormularioTarea(idTarea, idContenedor);
  }

  setDatosSalidaFormulario(data: any): Observable<any> {
    return this.jbpmService.setDatosSalidaFormularioTarea(data["idTarea"], data["idContenedor"], data['form']['data']);
  }

  getDatosSalidaFormulario(idTarea: string, idContenedor: string): Observable<any> {
    return this.jbpmService.getDatosSalidaFormularioTarea(idTarea, idContenedor);
  }

  getList(processId: string, userId: string, estado: string, sortActive: string, order: string,
    pageSize: number, page: number,
    search: string
  ): Observable<any> {
    if (sortActive === "task-created-on")
      sortActive = "createdOn";
    else if (sortActive === "task-name")
      sortActive = "name";
    else if (sortActive === "task-status")
      sortActive = "status";
    else // por defecto la fecha de creación
      sortActive = "createdOn";
    return this.jbpmService.getList(processId, userId, estado, sortActive, order, pageSize, page, search)
  }

  setTareasVisibility(visibilidad: boolean) {
    this.tareasVisibilityChange.next(visibilidad);
  }
}
