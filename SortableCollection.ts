/// <reference path="_definitions.d.ts" />

module Coveo {
    export class SortableCollection<TModel extends Backbone.Model> {
        ascending: boolean = false;
        filterValue: string = '';
        comparatorValue: string = 'lastName';
        
        collection: Backbone.Collection<TModel>;
        
        constructor(collection: Backbone.Collection<TModel>) {
            this.collection = collection;
            this.ascending = true;
        }

        compare(a: TableRowModel, b: TableRowModel) {
            if (this.ascending) {
                if (a.get(this.comparatorValue) < b.get(this.comparatorValue)) {
                    return -1;
                }
                if (b.get(this.comparatorValue) < a.get(this.comparatorValue)) {
                    return 1;
                }
                return 0;
            } else {
                if (a.get(this.comparatorValue) > b.get(this.comparatorValue)) {
                    return -1;
                }
                if (b.get(this.comparatorValue) > a.get(this.comparatorValue)) {
                    return 1;
                }
                return 0;
            }
        }
    }
}
