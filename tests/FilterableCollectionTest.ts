/// <reference path="tests.ts" />

module Coveo.Filterable.Test {

  class TableCollection extends Backbone.Collection<Backbone.Model> {
    filterable: FilterableCollection<Backbone.Model>;

    constructor(models?, options?) {
      super(models, _.extend({
        model: Backbone.Model
      }, options));
      TableCollectionBuilder.withFilters(this);
    }
  }

  describe('Table collections tests', function() {
    describe('Filterable Table Collection', function() {

      var filterableCollection: TableCollection;

      var filterableModelsFilters = {
        all: () => {
          return true;
        },
        isEven: (obj) => {
          return (obj.id % 2 == 0);
        },
        isOdd: (obj) => {
          return (obj.id % 2 != 0);
        }
      };

      var argsPredicateFilterAll = FilterableCollection.createPredicateArguments(filterableModelsFilters, 'all');
      var argsPredicateFilterIsEven = FilterableCollection.createPredicateArguments(filterableModelsFilters, 'isEven');
      var argsPredicateFilterIsOdd = FilterableCollection.createPredicateArguments(filterableModelsFilters, 'isOdd');

      beforeEach(function() {
        filterableCollection = new TableCollection(filterableSortableGroupablePageableModels);
      });

      it('should be initialized correctly with no filter and with all models visible', function() {
        expect(filterableCollection.filterable.getVisibleCount()).toEqual(filterableCollection.length);
      });

      it('should apply and return the right predicate filter count', function() {
        expect(filterableCollection.filterable.getPredicateFilterCount(argsPredicateFilterAll)).toEqual(filterableCollection.length);
        expect(filterableCollection.filterable.getPredicateFilterCount(argsPredicateFilterIsEven)).toEqual(5);
        expect(filterableCollection.filterable.getPredicateFilterCount(argsPredicateFilterIsOdd)).toEqual(4);
      });

      it('should apply a simple filter correctly', function() {
        filterableCollection.filterable.applyFilter({ filter: '1' });
        expect(filterableCollection.filterable.getVisibleCount()).toEqual(1);

        filterableCollection.filterable.applyFilter({ filter: 'none' });
        expect(filterableCollection.filterable.getVisibleCount()).toEqual(0);
      });

      it('should apply a simple predicate filter correctly', function() {
        filterableCollection.filterable.applyPredicateFilter(argsPredicateFilterAll);
        expect(filterableCollection.filterable.getVisibleCount()).toEqual(filterableCollection.length);

        filterableCollection.filterable.applyPredicateFilter(argsPredicateFilterIsEven);
        expect(filterableCollection.filterable.getVisibleCount()).toEqual(5);

        filterableCollection.filterable.applyPredicateFilter(argsPredicateFilterIsOdd);
        expect(filterableCollection.filterable.getVisibleCount()).toEqual(4);
      });

      it('should return the applied simple filter', function() {
        expect(filterableCollection.filterable.getFilter()).toEqual('');

        filterableCollection.filterable.applyFilter({ filter: '1' });
        expect(filterableCollection.filterable.getFilter()).toEqual('1');
      });

      it('should return the applied predicate filter', function() {
        expect(filterableCollection.filterable.getPredicateFilter()).toEqual('');

        filterableCollection.filterable.applyPredicateFilter(argsPredicateFilterAll);
        expect(filterableCollection.filterable.getPredicateFilter()).toEqual('all');

        filterableCollection.filterable.applyPredicateFilter(argsPredicateFilterIsOdd);
        expect(filterableCollection.filterable.getPredicateFilter()).toEqual('isOdd');
      });
    });
  });
}