import { Component, Inject, OnInit, EventEmitter, HostListener} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubmissionService } from '~services/submission.service';
import { JbpmService } from '~services/jbpm.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '~components/snackbar/snackbar.component';
import { CONSTANTS } from '~app/utils/constants';

@Component({
  selector: 'app-detalle',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit{
  public renderOptions: any;
  public readOnly: boolean = false;
  triggerRefresh: any=new EventEmitter();
  constructor(public dialogRef: MatDialogRef<DetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
    action: string, formulario: any, submission: any},
    private submissionService: SubmissionService,
    private jbpmService: JbpmService,
    public snack: MatSnackBar) {
      this.readOnly = (data.action == 'view');
      this.renderOptions = {
        language: 'sp',
        i18n: CONSTANTS.i18n,
        submitMessage: "Acción realizada",
        disableAlerts: true,
        noAlerts: true
      };
  }

  ngOnInit()
  {
    if (this.data.action == 'save' || this.data.action == 'update') {
      this.dialogRef.disableClose = true;
      this.dialogRef.backdropClick().subscribe(_ => {
        let cn = confirm('¿Está seguro de abandonar la edición?')
        if (cn) {
          this.dialogRef.close();
        }
      });
    }
  }

  private openSnack(data: any): void {
    this.snack.openFromComponent(SnackbarComponent, {
      data: { data: data },
      duration: 3000
    });
  }

  onSubmit(event) {
    let subm: any;

    if (this.data.action == 'save')
      subm = {data: event.data};
    else if (this.data.action == 'update')
      subm = {_id:this.data.submission._id, data: event.data};

    this.submissionService.save(subm, this.data.formulario.path).subscribe((res: any) => {
      let submissionId = res._id;
      let resumen = res.data.resumen;
      this.jbpmService.createInstance(CONSTANTS.formEnvio, submissionId).subscribe((res: any) => {
        this.dialogRef.close(resumen);
      }, (error:any) => {
        this.openSnack(error); // TODO: borrar la submission con el envío ya que este no se ha perfeccionado
      });
    }, (error:any) => {
      this.openSnack(error);});
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    let cn = confirm('¿Está seguro de abandonar la edición?')
    if (cn) {
      this.dialogRef.close();
    }
  }
}
