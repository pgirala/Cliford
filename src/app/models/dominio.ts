import { Submission } from "./submission";

export interface Dominio extends Submission {
  data: { nombre: string, path: string, envios: boolean, tareas: boolean, individual: boolean };
}
