/// <reference path="_definitions.d.ts" />

module Coveo {
    export class TableRowModel extends Backbone.Model {
        matchesFilter: boolean;
    }

    export class TableCollection extends Backbone.Collection<Backbone.Model> {
        filterable: FilterableCollection<TableRowModel>;
        sortable: SortableCollection<TableRowModel>;
        pageable: PageableCollection<TableRowModel>;

        constructor(models?, options?) {
            super(models, _.extend({
                model: TableRowModel
            }, options));
            TableCollectionBuilder.withFilters(this).withSort(this).withPagination(this, {
                modelsPerPage: 3,
                showXPages: 10
            })
        }
    }
}