import { PageEvent } from '@angular/material/paginator';

export abstract class Controller {

  constructor() { }

  public displayedColumns: string[];

  public pageSizeOptions: number[];

  public pageSize: number;

  public dataSource: any;

  public pageEvent: PageEvent;

  public resultsLength: number;

  public page: number;

  public isLoading: boolean;

  public isTotalReached: boolean;

  public totalItems: number;

  public search: string;

  abstract getData(): void;

  abstract edit(item: Object): void;

  abstract save(): void;

  abstract delete(item: Object): void;

}
