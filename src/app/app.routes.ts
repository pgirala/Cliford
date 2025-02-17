import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// FILTER
import { AuthGuard } from '~guards/auth.guard';

// LAYOUTS
import { AdminLayoutComponent } from '~modules/admin-layout/admin-layout.component';

/*CON LA CREACIÓN DEL ARCHIVO INDEX.PAGES NOS AHORRAMOS TENER QUE HACER
UNA IMPORTACIÓN POR CADA COMPONENTE DE LAS VISTAS*/
import {
  NotFoundComponent,
} from '~utils/index.pages';

// ROUTES
const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: '~modules/ayuda/ayuda.module#AyudaModule',
      },
      {
        path: 'formularios',
        loadChildren: '~modules/formulario/formulario.module#FormularioModule',
      },
      {
        path: 'submissions',
        loadChildren: '~modules/submission/submission.module#SubmissionModule',
      },
      {
        path: 'envios',
        loadChildren: '~modules/envio/envio.module#EnvioModule',
      },
      {
        path: 'tareas',
        loadChildren: '~modules/tarea/tarea.module#TareaModule',
      },
      {
        path: 'ayuda',
        loadChildren: '~modules/ayuda/ayuda.module#AyudaModule',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

