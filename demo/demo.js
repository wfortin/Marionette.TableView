/// <reference path="../_definitions.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Marionette;
(function (Marionette) {
    var GroupRowView = (function (_super) {
        __extends(GroupRowView, _super);
        function GroupRowView(options) {
            _super.call(this, _.extend({
                template: "#group-row",
                tagName: "tbody"
            }, options));
            this.childView = GroupRowItemView;
            this.childViewContainer = 'tbody';
            this.collection = this.model.items;
        }
        GroupRowView.prototype.attachHtml = function (collectionView, childView, index) {
            this.$el.append(childView.el);
        };
        GroupRowView.prototype.attachBuffer = function (compositeView, buffer) {
            this.$el.append(buffer);
        };
        return GroupRowView;
    })(Marionette.CompositeView);
    Marionette.GroupRowView = GroupRowView;
    var GroupRowItemView = (function (_super) {
        __extends(GroupRowItemView, _super);
        function GroupRowItemView(options) {
            _super.call(this, _.extend({
                template: "#group-row-item",
                tagName: "tr"
            }, options));
        }
        return GroupRowItemView;
    })(Marionette.ItemView);
    Marionette.GroupRowItemView = GroupRowItemView;
})(Marionette || (Marionette = {}));
/// <reference path="../_definitions.d.ts" />
var Marionette;
(function (Marionette) {
    var RowView = (function (_super) {
        __extends(RowView, _super);
        function RowView(options) {
            _super.call(this, _.extend({
                template: "#group-row",
                tagName: "tbody"
            }, options));
        }
        return RowView;
    })(Marionette.ItemView);
    Marionette.RowView = RowView;
})(Marionette || (Marionette = {}));
/// <reference path="../_definitions.d.ts" />
var Marionette;
(function (Marionette) {
    Marionette.TableViewEvents = {
        Add: 'table-view:add',
        Remove: 'table-view:remove'
    };
    var TableView = (function (_super) {
        __extends(TableView, _super);
        function TableView(options) {
            _super.call(this, _.extend({
                events: {
                    'keyup .filterBox': this.onFilter,
                    'click .asc': this.onSort,
                    'click .dsc': this.onSort,
                    'click .next': this.onNextPage,
                    'click .prev': this.onPreviousPage
                }
            }, options));
            this.template = '#table';
            if (this.collection instanceof Marionette.GroupableCollection) {
                this.childView = Marionette.GroupRowView;
            }
            else {
                this.childView = Marionette.RowView;
            }
            this.childViewContainer = 'table';
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
        TableView.prototype.triggers = function () {
            return {
                'click button#add.enabled': Marionette.TableViewEvents.Add,
                'click button#delete.enabled': Marionette.TableViewEvents.Remove
            };
        };
        TableView.prototype.onFilter = function () {
            var val = this.ui.inputFilter.val();
            if (this.collection.filterable && val != this.collection.filterable.getFilter()) {
                this.collection.filterable.applyFilter({
                    filter: val
                });
                this.currentRenderingIndex = 0;
                this.renderChildren();
            }
        };
        TableView.prototype.filter = function (child, index, collection) {
            if (this.collection.filterable) {
                if (child.matchesFilter === true) {
                    if (this.collection.pageable) {
                        if (index >= this.currentRenderingIndex) {
                            var shouldRender = this.collection.pageable.shouldRender(this.currentRenderingIndex % this.collection.length);
                            if (shouldRender) {
                                this.currentRenderingIndex++;
                            }
                            return shouldRender;
                        }
                    }
                    else {
                        return true;
                    }
                }
            }
            else {
                return true;
            }
        };
        TableView.prototype.onSort = function (e) {
            this.currentRenderingIndex = 0;
            if (this.collection.sortable) {
                this.collection.sortable.ascending = !!$(e.currentTarget).hasClass('asc');
                this.collection.sortable.comparatorValue = $(e.currentTarget).parent().data('sort');
                this.renderChildren();
            }
        };
        TableView.prototype.viewComparator = function (a, b) {
            if (this.collection.sortable) {
                return this.collection.sortable.compare(a, b);
            }
            return 0;
        };
        TableView.prototype.onNextPage = function () {
            if (this.collection.pageable) {
                this.collection.pageable.nextPage();
                this.currentRenderingIndex = this.collection.pageable.minIndex;
                this.renderChildren();
            }
        };
        TableView.prototype.onPreviousPage = function () {
            if (this.collection.pageable) {
                this.collection.pageable.previousPage();
                this.currentRenderingIndex = this.collection.pageable.minIndex;
                this.renderChildren();
            }
        };
        TableView.prototype.renderChildren = function () {
            this._renderChildren();
        };
        return TableView;
    })(Marionette.CompositeView);
    Marionette.TableView = TableView;
})(Marionette || (Marionette = {}));
/// <reference path="../_definitions.d.ts" />
var Marionette;
(function (Marionette) {
    Marionette.MATCHES_FILTER = 'matchesFilter';
    Marionette.MATCHES_PREDICATE = 'matchesPredicate';
    Marionette.FilterEvents = {
        Filter: 'collection:filtered'
    };
    var FilterableCollection = (function () {
        function FilterableCollection(collection) {
            this.collection = collection;
        }
        FilterableCollection.createPredicateArguments = function (predicates, keyArg, silent) {
            if (silent === void 0) { silent = false; }
            var predicate = predicates[keyArg];
            var args = {
                key: keyArg,
                silent: silent
            };
            if (_.isFunction(predicate)) {
                args.predicateFunction = predicate;
            }
            else if (_.isObject(predicate)) {
                args.predicateProperties = predicate;
            }
            return args;
        };
        FilterableCollection.prototype.getFilter = function () {
            return this.currentFilter ? this.currentFilter.filter : '';
        };
        FilterableCollection.prototype.applyPredicateFilter = function (args) {
            this.currentPredicate = args;
            if (args.predicateProperties || args.predicateFunction) {
                this.collection.each(function (model) {
                    model[Marionette.MATCHES_PREDICATE] = false;
                });
                if (args.predicateProperties) {
                    _.each(this.collection.where(args.predicateProperties), function (model) {
                        model[Marionette.MATCHES_PREDICATE] = true;
                    });
                }
                else if (args.predicateFunction) {
                    _.each(this.collection.filter(args.predicateFunction), function (model) {
                        model[Marionette.MATCHES_PREDICATE] = true;
                    });
                }
            }
            else {
                this.collection.each(function (model) {
                    model[Marionette.MATCHES_PREDICATE] = true;
                });
            }
            if (!args.silent) {
                this.collection.trigger(Marionette.FilterEvents.Filter);
            }
        };
        FilterableCollection.prototype.getPredicateFilter = function () {
            return this.currentPredicate ? this.currentPredicate.key : '';
        };
        FilterableCollection.prototype.getPredicateFilterCount = function (args) {
            if (args.predicateProperties) {
                return this.collection.where(args.predicateProperties).length;
            }
            else if (args.predicateFunction) {
                return this.collection.filter(args.predicateFunction).length;
            }
            return 0;
        };
        FilterableCollection.prototype.getVisibleCount = function () {
            var f = Marionette.MATCHES_FILTER;
            var p = Marionette.MATCHES_PREDICATE;
            return this.collection.filter(function (model) {
                return model[f] != false && model[p] != false;
            }).length;
        };
        FilterableCollection.prototype.applyFilter = function (args) {
            var _this = this;
            this.currentFilter = args;
            this.collection.each(function (model) {
                model[Marionette.MATCHES_FILTER] = true;
            });
            if (!_.isEmpty(args.filter)) {
                this.collection.each(function (model) {
                    var match = false;
                    var searchedAttributes = args.attributeNames || _.keys(model.attributes);
                    for (var i = 0; i < searchedAttributes.length; i++) {
                        var attributeName = searchedAttributes[i];
                        var attributeValue = model.get(attributeName);
                        match = _this.matchFilter(model, attributeName, attributeValue, args);
                        if (match) {
                            break;
                        }
                    }
                    model[Marionette.MATCHES_FILTER] = match;
                });
            }
            if (!args.silent) {
                this.collection.trigger(Marionette.FilterEvents.Filter);
            }
        };
        FilterableCollection.prototype.clearFilter = function () {
            this.applyFilter({ filter: '' });
        };
        FilterableCollection.prototype.matchFilter = function (model, attributeName, attributeValue, args) {
            if (_.isNumber(attributeValue)) {
                attributeValue = attributeValue.toString();
            }
            if (_.isString(attributeValue)) {
                return Strings.containsIgnoreCase(attributeValue, args.filter);
            }
            else if (_.isArray(attributeValue) || _.isObject(attributeValue)) {
                for (var i in attributeValue) {
                    var match = this.matchFilter(model, attributeName, attributeValue[i], args);
                    if (match) {
                        return match;
                    }
                }
            }
            return false;
        };
        return FilterableCollection;
    })();
    Marionette.FilterableCollection = FilterableCollection;
    var Strings = (function () {
        function Strings() {
        }
        Strings.containsIgnoreCase = function (str, test) {
            if (!str) {
                return false;
            }
            if (str && !test) {
                return true;
            }
            str = str.toLowerCase();
            test = test.toLowerCase().trim();
            return s.include(str, test);
        };
        return Strings;
    })();
    Marionette.Strings = Strings;
})(Marionette || (Marionette = {}));
/// <reference path="../_definitions.d.ts" />
var Marionette;
(function (Marionette) {
    Marionette.PageableCollectionOptionsDefault = {
        modelsPerPage: 10,
        showXPages: 6
    };
    Marionette.PageEvents = {
        PageChanged: 'changePage'
    };
    var PageableCollection = (function () {
        function PageableCollection(collection, options) {
            if (options === void 0) { options = {}; }
            this.collection = collection;
            this.currentPage = 0;
            this.offset = 0;
            this.options = _.defaults(options, Marionette.PageableCollectionOptionsDefault);
        }
        Object.defineProperty(PageableCollection.prototype, "modelsPerPage", {
            get: function () {
                return this.options.modelsPerPage;
            },
            set: function (n) {
                this.options.modelsPerPage = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageableCollection.prototype, "minIndex", {
            get: function () {
                return this.options.modelsPerPage * this.currentPage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageableCollection.prototype, "maxIndex", {
            get: function () {
                return this.minIndex + this.options.modelsPerPage - 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageableCollection.prototype, "page", {
            get: function () {
                return this.currentPage + this.offset;
            },
            enumerable: true,
            configurable: true
        });
        PageableCollection.prototype.setPage = function (p, silent, offset) {
            if (silent === void 0) { silent = false; }
            if (offset === void 0) { offset = 0; }
            this.currentPage = Math.max(Math.min(p, this.lastPage), 0);
            this.offset = offset;
            if (!silent) {
                this.collection.trigger(Marionette.PageEvents.PageChanged);
            }
        };
        Object.defineProperty(PageableCollection.prototype, "pagesInfo", {
            get: function () {
                return {
                    min: this.minIndex,
                    max: this.maxIndex
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageableCollection.prototype, "lastPage", {
            get: function () {
                var length = this.collection.length;
                if (this.collection["filterable"]) {
                    var coll = this.collection;
                    length = coll.filterable.getVisibleCount();
                }
                return Math.ceil(length / this.options.modelsPerPage) - 1;
            },
            enumerable: true,
            configurable: true
        });
        PageableCollection.prototype.nextPage = function (silent) {
            if (silent === void 0) { silent = false; }
            this.currentPage = Math.max(Math.min(this.currentPage + 1, this.lastPage), 0);
            if (!silent) {
                this.collection.trigger(Marionette.PageEvents.PageChanged);
            }
        };
        PageableCollection.prototype.previousPage = function (silent) {
            if (silent === void 0) { silent = false; }
            this.currentPage = Math.max(Math.min(this.currentPage - 1, this.lastPage), 0);
            if (!silent) {
                this.collection.trigger(Marionette.PageEvents.PageChanged);
            }
        };
        PageableCollection.prototype.shouldRender = function (index) {
            return index >= this.minIndex && index <= this.maxIndex;
        };
        PageableCollection.prototype.getPagesRange = function (showPrevNext, showFirstLast, lastPage) {
            if (showPrevNext === void 0) { showPrevNext = true; }
            if (showFirstLast === void 0) { showFirstLast = false; }
            if (lastPage === void 0) { lastPage = 0; }
            var pages = [];
            lastPage = Math.max(this.lastPage, lastPage);
            var start;
            var end;
            var offsetedPage = this.currentPage + this.offset;
            if (offsetedPage + (this.options.showXPages / 2) > lastPage) {
                end = lastPage;
                start = Math.max(lastPage - this.options.showXPages, 0);
            }
            else {
                start = Math.max(Math.floor((this.currentPage + this.offset) - (this.options.showXPages / 2)), 0);
                end = Math.min(start + this.options.showXPages, lastPage);
            }
            _.each(_.range(start, end + 1), function (i) {
                pages.push({ label: (i + 1).toString(), page: i });
            });
            if (showPrevNext) {
                pages.unshift({
                    label: 'previous',
                    page: Math.max(this.currentPage - 1 + this.offset, 0),
                    icon: 'coveo-sprites-tables-previous'
                });
                pages.push({
                    label: 'next',
                    page: Math.min(this.currentPage + 1 + this.offset, lastPage),
                    icon: 'coveo-sprites-tables-next'
                });
            }
            if (showFirstLast) {
                pages.unshift({ label: 'first', page: 0, icon: 'coveo-sprites-tables-first' });
                pages.push({ label: 'last', page: lastPage, icon: 'coveo-sprites-tables-last' });
            }
            return pages;
        };
        return PageableCollection;
    })();
    Marionette.PageableCollection = PageableCollection;
})(Marionette || (Marionette = {}));
/// <reference path="../_definitions.d.ts" />
var Marionette;
(function (Marionette) {
    var SortableCollection = (function () {
        function SortableCollection(collection) {
            this.ascending = false;
            this.filterValue = '';
            this.comparatorValue = 'lastName';
            this.collection = collection;
            this.ascending = true;
        }
        SortableCollection.prototype.compare = function (a, b) {
            if (this.ascending) {
                if (a.get(this.comparatorValue) < b.get(this.comparatorValue)) {
                    return -1;
                }
                if (b.get(this.comparatorValue) < a.get(this.comparatorValue)) {
                    return 1;
                }
                return 0;
            }
            else {
                if (a.get(this.comparatorValue) > b.get(this.comparatorValue)) {
                    return -1;
                }
                if (b.get(this.comparatorValue) > a.get(this.comparatorValue)) {
                    return 1;
                }
                return 0;
            }
        };
        return SortableCollection;
    })();
    Marionette.SortableCollection = SortableCollection;
})(Marionette || (Marionette = {}));
/// <reference path="../_definitions.d.ts" />
var Marionette;
(function (Marionette) {
    var GroupableCollection = (function (_super) {
        __extends(GroupableCollection, _super);
        function GroupableCollection(collection, groupByOptions) {
            this.collection = collection;
            var groupsMap = this.collection.groupBy(groupByOptions.key);
            _super.call(this, [], {
                model: GroupModel
            });
            for (var key in groupsMap) {
                var itemCollection = new Backbone.Collection(groupsMap[key]);
                this.add({
                    key: key,
                    items: itemCollection,
                    collapsed: true
                });
            }
        }
        return GroupableCollection;
    })(Backbone.Collection);
    Marionette.GroupableCollection = GroupableCollection;
    var GroupModel = (function (_super) {
        __extends(GroupModel, _super);
        function GroupModel() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(GroupModel.prototype, "key", {
            get: function () {
                return this.get('key');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroupModel.prototype, "items", {
            get: function () {
                return this.get('items');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroupModel.prototype, "collapsed", {
            get: function () {
                return this.get('collasped');
            },
            enumerable: true,
            configurable: true
        });
        return GroupModel;
    })(Backbone.Model);
    Marionette.GroupModel = GroupModel;
})(Marionette || (Marionette = {}));
/// <reference path="../_definitions.d.ts" />
var Marionette;
(function (Marionette) {
    var TableCollectionBuilder = (function () {
        function TableCollectionBuilder() {
        }
        TableCollectionBuilder.withFilters = function (collection) {
            collection.filterable = new Marionette.FilterableCollection(collection);
            return this;
        };
        TableCollectionBuilder.withPagination = function (collection, options) {
            collection.pageable = new Marionette.PageableCollection(collection, options);
            return this;
        };
        TableCollectionBuilder.withSort = function (collection) {
            collection.sortable = new Marionette.SortableCollection(collection);
            return this;
        };
        TableCollectionBuilder.withGroups = function (collection, options) {
            collection.groupable = new Marionette.GroupableCollection(collection, options);
            return this;
        };
        return TableCollectionBuilder;
    })();
    Marionette.TableCollectionBuilder = TableCollectionBuilder;
})(Marionette || (Marionette = {}));
/// <reference path="../_definitions.d.ts" />
var Marionette;
(function (Marionette) {
    var TableCollection = (function (_super) {
        __extends(TableCollection, _super);
        function TableCollection(models, options) {
            _super.call(this, models, _.extend({
                model: Backbone.Model
            }, options));
            Marionette.TableCollectionBuilder.withFilters(this).withSort(this).withPagination(this, {
                modelsPerPage: 3,
                showXPages: 10
            }).withGroups(this, { key: 'team' });
        }
        return TableCollection;
    })(Backbone.Collection);
    Marionette.TableCollection = TableCollection;
})(Marionette || (Marionette = {}));
var users = new Marionette.TableCollection([
    {
        "firstName": "Sonya",
        "lastName": "Flowers",
        "phone": "+1 (842) 556-3810",
        "team": "red"
    },
    {
        "firstName": "Dixon",
        "lastName": "Finley",
        "phone": "+1 (925) 416-2751",
        "team": "red"
    },
    {
        "firstName": "Kellie",
        "lastName": "Albert",
        "phone": "+1 (867) 429-2201",
        "team": "red"
    },
    {
        "firstName": "Carter",
        "lastName": "Sosa",
        "phone": "+1 (851) 440-2041",
        "team": "red"
    },
    {
        "firstName": "Mccormick",
        "lastName": "Chavez",
        "phone": "+1 (801) 457-2193",
        "team": "red"
    },
    {
        "firstName": "Lina",
        "lastName": "Battle",
        "phone": "+1 (838) 487-3404",
        "team": "blue"
    },
    {
        "firstName": "Mabel",
        "lastName": "Perez",
        "phone": "+1 (852) 571-2564",
        "team": "blue"
    },
    {
        "firstName": "Edna",
        "lastName": "Phillips",
        "phone": "+1 (833) 443-2423",
        "team": "blue"
    },
    {
        "firstName": "Daniel",
        "lastName": "Cortez",
        "phone": "+1 (870) 488-2641",
        "team": "blue"
    },
    {
        "firstName": "Stanton",
        "lastName": "Davenport",
        "phone": "+1 (830) 497-2139",
        "team": "blue"
    },
    {
        "firstName": "Woodward",
        "lastName": "Delaney",
        "phone": "+1 (825) 427-3699",
        "team": "blue"
    },
    {
        "firstName": "Hull",
        "lastName": "Stout",
        "phone": "+1 (967) 483-3725",
        "team": "green"
    },
    {
        "firstName": "Wendy",
        "lastName": "Reese",
        "phone": "+1 (809) 558-3678",
        "team": "green"
    },
    {
        "firstName": "Montgomery",
        "lastName": "Horne",
        "phone": "+1 (852) 553-3681",
        "team": "green"
    },
    {
        "firstName": "Blackburn",
        "lastName": "Moss",
        "phone": "+1 (939) 419-3704",
        "team": "green"
    }
]);
$(document).ready(function () {
    var tableView = new Marionette.TableView({
        collection: users.groupable
    });
    tableView.render();
    $('#table-placeholder').html(tableView.el);
});
