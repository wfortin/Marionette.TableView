/// <reference path="_definitions.d.ts" />

module Coveo {
    export class TableCollectionBuilder {

        static withFilters(collection: Filterable<Backbone.Model>) {
            collection.filterable = new FilterableCollection<Backbone.Model>(collection);
            return this;
        }

        static withPagination(collection: Pageable<Backbone.Model>, options?: PageableCollectionOptions) {
            collection.pageable = new PageableCollection<Backbone.Model>(collection, options);
            return this;
        }
        
        static withSort(collection: Sortable<Backbone.Model>) {
            collection.sortable = new SortableCollection<Backbone.Model>(collection);
            return this;
        }
    }

    export interface FilterablePageableSelectableSortable<TModel extends PickySelectable> extends PickyMultiSelect<TModel> {
        filterable?: FilterableCollection<TModel>;
        pageable?: PageableCollection<TModel>;
    }

    export interface Pageable<TModel extends Backbone.Model> extends Backbone.Collection<Backbone.Model> {
        pageable: PageableCollection<TModel>;
    }

    export interface Filterable<TModel extends Backbone.Model> {
        filterable: FilterableCollection<TModel>;
    }
    
    export interface Sortable<TModel extends Backbone.Model> extends Backbone.Collection<Backbone.Model> {
        sortable: SortableCollection<TModel>;
    }
}