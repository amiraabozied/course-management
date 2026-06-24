import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  skeletonWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  @Input() columns: ColumnDef[] = [];
  @Input() data: object[] = [];
  @Input() isLoading = false;
  @Input() skeletonCount = 5;
  @Input() sortKey = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Output() sortChange = new EventEmitter<string>();
  @ContentChild('rowTemplate') rowTemplate!: TemplateRef<unknown>;
  @ContentChild('emptyTemplate') emptyTemplate?: TemplateRef<unknown>;

  get skeletonRows(): unknown[] {
    return Array.from({ length: this.skeletonCount });
  }

  onHeaderClick(col: ColumnDef): void {
    if (col.sortable) this.sortChange.emit(col.key);
  }

  sortIcon(key: string): string {
    if (this.sortKey !== key) return 'sort';
    return this.sortDirection === 'asc' ? 'up' : 'down';
  }
}
