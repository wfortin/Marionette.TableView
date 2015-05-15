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
                var itemCollection = new Backbone.Collection<Backbone.Model>(groupsMap[key]);
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
        get items(): Backbone.Collection<Backbone.Model> { return this.get('items') }
        get collapsed(): boolean { return this.get('collasped') }
    }
}