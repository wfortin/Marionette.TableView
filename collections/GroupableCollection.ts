/// <reference path="../_definitions.d.ts" />

module Marionette {

    export interface GroupableCollectionOptions {
        key: string;
    }

    export class GroupableCollection<TModel extends Backbone.Model> extends Backbone.Collection<TModel> {
        private collection: Backbone.Collection<TModel>;


        constructor(collection: Backbone.Collection<TModel>, groupByOptions: GroupableCollectionOptions) {
            this.collection = collection;

            var groupsMap = this.collection.groupBy(groupByOptions.key);
            super([], {
                model: GroupModel
            });

            for (var key in groupsMap) {
                var itemCollection = new GroupCollection(groupsMap[key]);
                this.add({
                    key: key,
                    items: itemCollection,
                    collapsed: true
                })
            }
        }
    }

    export class GroupModel extends Backbone.Model {
        get key(): string { return this.get('key') }
        get items(): GroupCollection { return this.get('items') }
        get collapsed(): boolean { return this.get('collasped') }
    }

    export class GroupCollection extends Backbone.Collection<Backbone.Model> {
        filterable: FilterableCollection<Backbone.Model>;
        sortable: SortableCollection<Backbone.Model>;

        constructor(models?, options?) {
            super(models, _.extend({
                model: Backbone.Model
            }, options));
            TableCollectionBuilder.withFilters(this).withSort(this);
            
            this.filterable.applyFilter({ filter: '' });
        }
    }
}