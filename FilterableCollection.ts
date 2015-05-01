/// <reference path="_definitions.d.ts" />

module Coveo {
    export interface FilterEventArguments extends Backbone.Silenceable {
        filter: string;
        dateFormat?: string;
        attributeNames?: string[];
        attributeFormatters?: { [s: string]: (value: string, model: Backbone.Model) => string };
    }
    
    export interface FilterableModel extends Backbone.Model {
        matchesFilter: boolean;
        matchesPredicate: boolean;
    }

    export var MATCHES_FILTER = 'matchesFilter';
    export var MATCHES_PREDICATE = 'matchesPredicate';

    export var FilterEvents = {
        Filter: 'collection:filtered'
    };

    export interface PredicateFilterEventArguments {
        key: string;
        predicateFunction?: (model: Backbone.Model) => boolean;
        predicateProperties?: Object;
        silent: boolean;
    }

    export class FilterableCollection<TModel extends Backbone.Model> {
        private currentFilter: FilterEventArguments;
        private currentPredicate: PredicateFilterEventArguments;

        private collection: Backbone.Collection<TModel>;

        static createPredicateArguments(predicates: any, keyArg: string, silent = false): PredicateFilterEventArguments {
            var predicate = predicates[keyArg];

            var args: PredicateFilterEventArguments = {
                key: keyArg,
                silent: silent
            };
            if (_.isFunction(predicate)) {
                args.predicateFunction = predicate;
            } else if (_.isObject(predicate)) {
                args.predicateProperties = predicate;
            }

            return args;
        }

        constructor(collection) {
            this.collection = collection;
        }

        getFilter(): string {
            return this.currentFilter ? this.currentFilter.filter : '';
        }

        applyPredicateFilter(args: PredicateFilterEventArguments) {
            this.currentPredicate = args;

            if (args.predicateProperties || args.predicateFunction) {
                this.collection.each((model: Backbone.Model) => {
                    model[MATCHES_PREDICATE] = false;
                });

                if (args.predicateProperties) {
                    _.each(this.collection.where(args.predicateProperties), (model: Backbone.Model) => {
                        model[MATCHES_PREDICATE] = true;
                    });
                } else if (args.predicateFunction) {
                    _.each(this.collection.filter(args.predicateFunction), (model: Backbone.Model) => {
                        model[MATCHES_PREDICATE] = true;
                    });
                }
            } else {
                this.collection.each((model: Backbone.Model) => {
                    model[MATCHES_PREDICATE] = true;
                });
            }

            if (!args.silent) {
                this.collection.trigger(FilterEvents.Filter);
            }
        }

        getPredicateFilter(): string {
            return this.currentPredicate ? this.currentPredicate.key : '';
        }

        getPredicateFilterCount(args: PredicateFilterEventArguments) {
            if (args.predicateProperties) {
                return this.collection.where(args.predicateProperties).length;
            } else if (args.predicateFunction) {
                return this.collection.filter(args.predicateFunction).length;
            }
            return 0;
        }

        getVisibleCount() {
            var f = MATCHES_FILTER;
            var p = MATCHES_PREDICATE;
            return this.collection.filter((model: Backbone.Model) => {
                return model[f] != false && model[p] != false;
            }).length;
        }

        applyFilter(args: FilterEventArguments) {
            this.currentFilter = args;

            this.collection.each((model: Backbone.Model) => {
                model[MATCHES_FILTER] = true;
            });

            if (!_.isEmpty(args.filter)) {
                this.collection.each((model: Backbone.Model) => {
                    var match = false;
                    var searchedAttributes = args.attributeNames || _.keys(model.attributes);
                    for (var i = 0; i < searchedAttributes.length; i++) {
                        var attributeName = searchedAttributes[i];
                        var attributeValue = model.get(attributeName);
                        match = this.matchFilter(model, attributeName, attributeValue, args);
                        if (match) {
                            break;
                        }
                    }
                    model[MATCHES_FILTER] = match;
                });
            }

            if (!args.silent) {
                this.collection.trigger(FilterEvents.Filter);
            }
        }

        clearFilter() {
            this.applyFilter({filter: ''});
        }

        private matchFilter(model: Backbone.Model, attributeName: string, attributeValue: any, args: FilterEventArguments) {
            if (_.isNumber(attributeValue)) {
                attributeValue = attributeValue.toString();
            } 
            if (_.isString(attributeValue)) {
                return Strings.containsIgnoreCase(attributeValue, args.filter);
            } else if (_.isArray(attributeValue) || _.isObject(attributeValue)) {
                for (var i in attributeValue) {
                    var match = this.matchFilter(model, attributeName, attributeValue[i], args);
                    if (match) {
                        return match;
                    }
                }
            }

            return false;
        }
    }

    export class Strings {
        static containsIgnoreCase(str: string, test: string) {
            if (!str) {
                return false;
            }
            if (str && !test) {
                return true;
            }

            str = str.toLowerCase();
            test = test.toLowerCase().trim();

            return s.include(str, test);
        }
    }
}
