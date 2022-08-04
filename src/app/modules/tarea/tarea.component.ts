import { Component, AfterViewInit, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CONSTANTS } from '~utils/constants';

import { Submission } from '~models/submission';
import { SubmissionService } from '~services/submission.service';
import { AuthService } from '~services/auth.service';
import { ConfirmComponent } from '~components/confirm/confirm.component';
import { DetailComponent } from '~modules/tarea/view/detail.component';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';

import { Controller } from '~base/controller';
import { NodeWithI18n } from '@angular/compiler';
import { Formulario } from '~app/models/formulario';
import { TareaService } from '~app/services/tarea.service';
import { FormularioService } from '~app/services/formulario.service';
import { ContextService } from '~app/services/context.service';

@Component({
  selector: 'app-client',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
  providers: [TareaService, FormularioService]
})
export class TareaComponent implements AfterViewInit, OnInit, Controller {
  public displayedColumns = ['task-created-on',
    'task-name', 'task-status',
    'personid'];
  public pageSizeOptions = [5, 10, 20, 40, 100];
  public pageSize = 20;
  public dataSource = new MatTableDataSource();
  public pageEvent: PageEvent;
  public resultsLength = 0;
  public page = 1;
  public isLoading = false;
  public isTotalReached = false;
  public totalItems = 0;
  public search = '';
  public formPath = null; // CONSTANTS.formularios.formTarea;
  public formulario: Formulario = { _id: '', owner: '', created: null, modified: null, title: '', type: null, name: null, display: null, path: null, tags: [CONSTANTS.formularios.multiple] };
  public equivalenciasEstado: any = {
    'Completed': 'Completada',
    'Created': 'Creada',
    'Error': 'Error',
    'Exited': 'Abandonada',
    'Failed': 'Con fallo',
    'InProgress': 'En curso',
    'Obsolete': 'Obsoleta',
    'Ready': 'Lista',
    'Reserved': 'Pendiente',
    'Suspended': 'Suspended'
  };

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private submissionService: SubmissionService,
    private tareaService: TareaService,
    private formularioService: FormularioService,
    private authService: AuthService,
    private contextService: ContextService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) { }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      this.router.navigate(['/login']);
    }

    /*this.formularioService.findByName(CONSTANTS.formularios.formTarea).subscribe((formularios:any) => {
      this.formulario = formularios[0];
    })*/ // TODO
  }

  ngAfterViewInit() {
    // ANTES QUE LA VISTA CARGUE INICIA LA CARGA DE DATOS EN EL GRID
    this.getDataLength();
    this.getData();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  private openSnack(data: any): void {
    this.snack.openFromComponent(SnackbarComponent, {
      data: { data: data },
      duration: 3000
    });
  }

  public onPaginateChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getData();
  }

  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    this.getDataLength();
    this.getData();
    this.getDataLength();
  }

  getDataLength(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.tareaService.getList(
            this.sort.active,
            this.sort.direction,
            1000000000, // Number.MAX_SAFE_INTEGER es un número demasiado grande para pasarlo por query parameter
            1,
            this.search
            /*,
            null, //CONSTANTS.formularios.formTarea,
            this.contextService.getDominio().data.path */
          );
        }),
        map(data => {
          data = data['task-instance'];
          this.isLoading = false;
          this.isTotalReached = false;
          this.totalItems = data.length;
          return;
        }),
        catchError(() => {
          this.openSnack({ message: "No se pudo contactar con el servidor de BPM" });
          this.isLoading = false;
          this.isTotalReached = true;
          return observableOf([]);
        })
      ).subscribe();
  }

  getData(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.tareaService.getList(
            this.sort.active,
            this.sort.direction,
            this.pageSize,
            this.page
            /*            ,
                        this.search,
                        null, //CONSTANTS.formularios.formTarea, //TODO
                        this.contextService.getDominio().data.path */
          );
        }),
        map(data => {
          this.isLoading = false;
          this.isTotalReached = false;
          return data['task-instance'];
        }),
        catchError(() => {
          this.openSnack({ message: "No se pudo contactar con el servidor de BPM" });
          this.isLoading = false;
          this.isTotalReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  save(): void {
    const jefe = this.authService.getSuperior();
    const submissionVacia: Submission = { data: { dominio: this.contextService.getDominio().data.path, destinatario: (jefe == null ? null : jefe) } };

    const dialogRef = this.dialog.open(DetailComponent, {
      height: '60%',
      width: '60%',
      data: {
        action: 'save',
        formulario: this.formulario,
        submission: this.submissionService.addToken(submissionVacia)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openSnack({ message: "Envío realizado: " + result });
        this.paginator._changePageSize(this.paginator.pageSize);
      }
    });
  }

  edit(submission: Submission): void { }

  delete(submission: Submission): void { }

  view(item: Submission): void {
    const dialogRef = this.dialog.open(DetailComponent, {
      height: '700px',
      width: '1000px',
      data: {
        action: 'view',
        formulario: this.formulario,
        submission: this.submissionService.addToken(item)
      }
    });
  }

}
