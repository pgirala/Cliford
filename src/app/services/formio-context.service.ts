import { Injectable } from '@angular/core';
import { User } from '~app/models/user';
import { ContextService } from '~app/services/context.service';
import { Dominio } from '~app/models/dominio';
import { Formio } from 'formiojs';

@Injectable()
export class FormioContextService {
  constructor(private contextService: ContextService) { }

  // relación de métodos que aportan el token y usuario formio en función del contexto (dominio elegido)

  hasTokenFormio(): boolean {
    return !!this.getTokenFormio();
  }

  public getTokenFormio(): string {
    let token = null;
    // tiene en cuenta el contexto para determinar si el dominio es para individuos u organizaciones
    if (this.isIndividual())
      token = this.getTokenFormioIndividual();
    else
      token = this.getTokenFormioOrganizacion();
    // actualiza el token en la instancia de formio para las peticiones que haga directamente el renderer (resources y formularios empotrados)
    Formio.setToken(token); // TODO eliminar las adiciones del token en cabecera, ya no son necesarias.
    return token;
  }

  isIndividual(): boolean {
    try {
      if (this.contextService.getDominio().data.individual)
        return new Boolean(this.contextService.getDominio().data.individual).valueOf();
      return false; // por defecto es de organización
    } catch {
      return false;
    }
  }

  public getTokenFormioIndividual(): string {
    return this.contextService.getTokenFormioIndividual();
  }

  public setTokenFormioIndividual(token: string): void {
    this.contextService.setTokenFormioIndividual(token);
  }

  public removeTokenFormioIndividual(): void {
    this.contextService.removeTokenFormioIndividual();
  }

  public getTokenFormioOrganizacion(): string {
    return this.contextService.getTokenFormioOrganizacion();
  }

  public setTokenFormioOrganizacion(token: string): void {
    this.contextService.setTokenFormioOrganizacion(token);
  }

  public removeTokenFormioOrganizacion(): void {
    this.contextService.removeTokenFormioOrganizacion();
  }

  getUserName(): string {
    let resultado = '';
    if (this.contextService.getUserNameIndividual())
      resultado = this.contextService.getUserNameIndividual();
    else
      resultado = '';
    if (!this.isIndividual()) {
      resultado = resultado + (this.contextService.getUserNameOrganizacion() == null ? '' : (this.contextService.getUserNameIndividual() ? ' / ' : '') + this.contextService.getUserNameOrganizacion());
    }
    return resultado;
  }

  public getUserFormio(): User {
    // tiene en cuenta el contexto para determinar si el dominio es para individuos u organizaciones
    if (this.isIndividual())
      return this.getUserFormioIndividual();
    else
      return this.getUserFormioOrganizacion();
  }

  public getUserFormioIndividual(): User {
    return this.contextService.getUserFormioIndividual();
  }

  public setUserFormioIndividual(user: User): void {
    this.contextService.setUserFormioIndividual(user);
  }

  public removeUserFormioIndividual(): void {
    this.contextService.removeUserFormioIndividual();
  }

  public getUserFormioOrganizacion(): User {
    return this.contextService.getUserFormioOrganizacion();
  }

  public setUserFormioOrganizacion(user: User): void {
    this.contextService.setUserFormioOrganizacion(user);
  }

  public removeUserFormioOrganizacion(): void {
    this.contextService.removeUserFormioOrganizacion();
  }
  // dominios
  public getDominios(): Array<Dominio> {
    let resultado = new Array<Dominio>();
    if (this.getUserFormioIndividual() != null && this.getUserFormioIndividual().data.dominios != null)
      this.getUserFormioIndividual().data.dominios.forEach(function (dominio) {
        resultado.push(dominio);
      });
    if (this.getUserFormioOrganizacion() != null && this.getUserFormioOrganizacion().data.dominios != null)
      this.getUserFormioOrganizacion().data.dominios.forEach(function (dominio: Dominio) {
        if (!this.isDominioIncluido(dominio, resultado))
          resultado.push(dominio);
      }, this);
    resultado.sort();
    return resultado;
  }

  private isDominioIncluido(dominio: Dominio, dominios: Array<Dominio>): boolean {
    if (dominio == null || dominios == null)
      return false;
    let resultado: boolean = false;
    dominios.forEach(function (dominioLista: Dominio) {
      if (dominio._id === dominioLista._id)
        resultado = true;
    });
    return resultado;
  }
}
