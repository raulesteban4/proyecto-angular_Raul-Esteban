import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-componente-filtrar',
  imports: [MatFormField, MatLabel, MatInputModule],
  templateUrl: './componente-filtrar.html',
  styleUrl: './componente-filtrar.css',
})
export class ComponenteFiltrar {
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @Input() placeholder = 'Buscar por título o autor';
  @Input() label = 'Filtrar';

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
