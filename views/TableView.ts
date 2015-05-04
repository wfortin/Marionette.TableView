/// <reference path="../_definitions.d.ts" />

module Coveo {
    export var TableViewEvents = {
        Add: 'table-view:add',
        Remove: 'table-view:remove'
    }

    interface TableViewCollection<TModel extends Backbone.Model> extends Backbone.Collection<TModel> {
        filterable?: FilterableCollection<TModel>;
        pageable?: PageableCollection<TModel>;
        sortable?: SortableCollection<TModel>;
    }

    export class TableView extends Marionette.CompositeView<Backbone.Model, any> {
        collection: TableViewCollection<Backbone.Model>;

        private currentRenderingIndex: number;
        private minIndex: number;
        private maxIndex: number;
        private resultsPerPage: number;

        constructor(options?: any) {
            super(_.extend({
                events: {
                    'keyup .filterBox': this.onFilter,
                    'click .asc': this.onSort,
                    'click .dsc': this.onSort,
                    'click .next': this.onNextPage,
                    'click .prev': this.onPreviousPage
                }
            }, options));
            this.template = <any> '#table';
            this.childView = RowView;
            this.childViewContainer = 'tbody';
            this.reorderOnSort = true;

            this.ui = _.extend({
                addButton: 'button#add',
                adminTableView: '.admin-table-view',
                confirmDeletePrompt: '#prompt',
                deleteButton: 'button#delete',
                groupBySelectContainer: '.groupby-select-container',
                inputFilter: 'input[type="text"].filterBox',
                predicates: '.predicate-filters .predicate-filter',
                theadCheckbox: "thead .selection input[type='checkbox']",
                theadCheckboxDisplay: "thead .selection input[type='checkbox'] + button"
            }, this.ui);

            if (this.collection.filterable) {
                this.collection.filterable.applyFilter({
                    filter: ''
                });
            }

            this.currentRenderingIndex = 0;
        }

        triggers() {
            return {
                'click button#add.enabled': TableViewEvents.Add,
                'click button#delete.enabled': TableViewEvents.Remove
            }
        }

        protected onFilter() {
            var val = this.ui.inputFilter.val();
            if (this.collection.filterable && val != this.collection.filterable.getFilter()) {
                this.collection.filterable.applyFilter({
                    filter: val
                });
                this.currentRenderingIndex = 0;
                this.renderChildren();
            }
        }

        protected filter(child: FilterableModel, index: number, collection: TableViewCollection<Backbone.Model>) {
            if (this.collection.filterable) {
                if (child.matchesFilter === true) {
                    if (this.collection.pageable) {
                        if (index >= this.currentRenderingIndex ) {
                            var shouldRender = this.collection.pageable.shouldRender(this.currentRenderingIndex % this.collection.length);
                            if (shouldRender) {
                                this.currentRenderingIndex++;
                            }
                            return shouldRender;
                        }
                    } else {
                        return true
                    }
                }
            }
        }

        protected onSort(e: JQueryEventObject) {
            this.currentRenderingIndex = 0;
            if (this.collection.sortable) {
                this.collection.sortable.ascending = !!$(e.currentTarget).hasClass('asc');
                this.collection.sortable.comparatorValue = $(e.currentTarget).parent().data('sort');
                this.renderChildren();
            }
        }

        protected viewComparator(a, b) {
            if (this.collection.sortable) {
                return this.collection.sortable.compare(a, b);
            }
            return 0;
        }

        protected onNextPage() {
            if (this.collection.pageable) {
                this.collection.pageable.nextPage();
                this.currentRenderingIndex = this.collection.pageable.minIndex;
                this.renderChildren();
            }
        }

        protected onPreviousPage() {
            if (this.collection.pageable) {
                this.collection.pageable.previousPage();
                this.currentRenderingIndex = this.collection.pageable.minIndex;
                this.renderChildren();
            }
        }

        public renderChildren() {
            this._renderChildren();
        }
    }
}