/// <reference path="tests.ts" />

module Marionette.Pageable.Test {

    var pageableCollectionOptions: PageableCollectionOptions = {
        modelsPerPage: 4,
        showXPages: 3
    };

    class TableCollection extends Backbone.Collection<Backbone.Model> {
        pageable: PageableCollection<Backbone.Model>;

        constructor(models, options, pageableOptions: PageableCollectionOptions = pageableCollectionOptions) {
            super(models, _.extend({
                model: Backbone.Model
            }, options));
            TableCollectionBuilder.withPagination(this, pageableOptions);
        }
    }

    describe('Table collections tests', function() {
        describe('Pagable Table Collection', function() {

            var pageableCollection: TableCollection;

            var ELEMENT_PER_PAGE = 4;
            var FIRST_ELEMENT_INDEX = 0;
            var NUMBER_OF_ELEMENT = 9;

            var NUMBER_OF_PAGE = 3;
            var FIRST_PAGE_INDEX = 0;

            beforeEach(function() {
                pageableCollection = new TableCollection(filterableSortableGroupablePageableModels, {});
            });

            it('should return the expected min and max index after initialization', function() {
                // Validate that the pageable collection was initialized correctly for the test suite
                expect(pageableCollection.pageable.page).toEqual(FIRST_PAGE_INDEX);
                expect(pageableCollection.pageable.modelsPerPage).toEqual(ELEMENT_PER_PAGE);

                expect(pageableCollection.pageable.minIndex).toEqual(FIRST_ELEMENT_INDEX);
                expect(pageableCollection.pageable.maxIndex).toEqual(ELEMENT_PER_PAGE - 1);
            });

            it("should return the right 'should render' value after initialization", function() {
                var expected = [true, true, true, true, false, false, false, false, false];
                for (var i = FIRST_ELEMENT_INDEX; i < NUMBER_OF_ELEMENT; i++) {
                    expect(pageableCollection.pageable.shouldRender(i)).toEqual(expected[i]);
                }
            });

            it('should return a valid pages infos', function() {
                var json = { min: FIRST_ELEMENT_INDEX, max: ELEMENT_PER_PAGE - 1 };
                expect(pageableCollection.pageable.pagesInfo).toEqual(jasmine.objectContaining(json));
            });

            it('should set a page correctly and update which elements should render', function() {
                var expected = [false, false, false, false, true, true, true, true, false];
                pageableCollection.pageable.setPage(1);
                for (var i = FIRST_ELEMENT_INDEX; i < NUMBER_OF_ELEMENT; i++) {
                    expect(pageableCollection.pageable.shouldRender(i)).toEqual(expected[i]);
                }
            });

            it('should handle users wrong parameters on setPage', function() {
                pageableCollection.pageable.setPage(-10);
                expect(pageableCollection.pageable.page).toEqual(FIRST_PAGE_INDEX);

                pageableCollection.pageable.setPage(10);
                expect(pageableCollection.pageable.page).toEqual(NUMBER_OF_PAGE - 1);
            });

            it('should return the right page range after initialisation', function() {
                var expected = [
                    { label: 'previous', page: 0 },
                    { label: '1', page: 0 },
                    { label: '2', page: 1 },
                    { label: '3', page: 2 },
                    { label: 'next', page: 1 }
                ];
                var pagesRange = pageableCollection.pageable.getPagesRange();
                for (var i = 0; i < 5; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            it('should return the right page range after when showPrevNext disabled', function() {
                var expected = [
                    { label: '1', page: 0 },
                    { label: '2', page: 1 },
                    { label: '3', page: 2 }
                ];
                var pagesRange = pageableCollection.pageable.getPagesRange(false);
                for (var i = 0; i < 3; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            it('should return the right page range after when showFirstLast enabled', function() {
                var expected = [
                    { label: 'first', page: 0 },
                    { label: '1', page: 0 },
                    { label: '2', page: 1 },
                    { label: '3', page: 2 },
                    { label: 'last', page: 2 }
                ];
                var pagesRange = pageableCollection.pageable.getPagesRange(false, true);
                for (var i = 0; i < 5; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            it('should render always render X pages', function() {
                // 9 pages, 1 item per page
                pageableCollectionOptions = {
                    modelsPerPage: 1,
                    showXPages: 2
                };

                pageableCollection = new TableCollection(filterableSortableGroupablePageableModels, {},
                    pageableCollectionOptions);

                var expected = [
                    { label: '3', page: 2 },
                    { label: '4', page: 3 },
                    { label: '5', page: 4 },
                ];

                pageableCollection.pageable.setPage(3);

                var pagesRange = pageableCollection.pageable.getPagesRange(false, false);
                for (var i = 0; i < 3; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            it('should render always render X pages even at 0', function() {
                // 9 pages, 1 item per page
                pageableCollectionOptions = {
                    modelsPerPage: 1,
                    showXPages: 2
                };

                pageableCollection = new TableCollection(filterableSortableGroupablePageableModels, {},
                    pageableCollectionOptions);

                var expected = [
                    { label: '1', page: 0 },
                    { label: '2', page: 1 },
                    { label: '3', page: 2 },
                ];
                pageableCollection.pageable.setPage(0);

                var pagesRange = pageableCollection.pageable.getPagesRange(false);
                for (var i = 0; i < 3; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            it('should render always render X pages even at second page', function() {
                // 9 pages, 1 item per page
                pageableCollectionOptions = {
                    modelsPerPage: 1,
                    showXPages: 2
                };

                pageableCollection = new TableCollection(filterableSortableGroupablePageableModels, {},
                    pageableCollectionOptions);

                var expected = [
                    { label: '1', page: 0 },
                    { label: '2', page: 1 },
                    { label: '3', page: 2 },
                ];
                pageableCollection.pageable.setPage(1);

                var pagesRange = pageableCollection.pageable.getPagesRange(false);
                for (var i = 0; i < 3; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            it('should render always render X pages even at before last page', function() {
                // 9 pages, 1 item per page
                pageableCollectionOptions = {
                    modelsPerPage: 1,
                    showXPages: 2
                };

                pageableCollection = new TableCollection(filterableSortableGroupablePageableModels, {},
                    pageableCollectionOptions);

                var expected = [
                    { label: '7', page: 6 },
                    { label: '8', page: 7 },
                    { label: '9', page: 8 },
                ];
                pageableCollection.pageable.setPage(7);

                var pagesRange = pageableCollection.pageable.getPagesRange(false);
                for (var i = 0; i < 3; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            it('should render always render X pages even at last page', function() {
                // 9 pages, 1 item per page
                pageableCollectionOptions = {
                    modelsPerPage: 1,
                    showXPages: 2
                };

                pageableCollection = new TableCollection(filterableSortableGroupablePageableModels, {},
                    pageableCollectionOptions);

                var expected = [
                    { label: '7', page: 6 },
                    { label: '8', page: 7 },
                    { label: '9', page: 8 },
                ];
                pageableCollection.pageable.setPage(8);

                var pagesRange = pageableCollection.pageable.getPagesRange(false);
                for (var i = 0; i < 3; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            it('should render always render X pages even if the page dont exists', function() {
                // 9 pages, 1 item per page
                pageableCollectionOptions = {
                    modelsPerPage: 1,
                    showXPages: 10
                };

                pageableCollection = new TableCollection(filterableSortableGroupablePageableModels, {},
                    pageableCollectionOptions);

                var expected = [
                    { label: '1', page: 0 },
                    { label: '2', page: 1 },
                    { label: '3', page: 2 },
                    { label: '4', page: 3 },
                    { label: '5', page: 4 },
                    { label: '6', page: 5 },
                    { label: '7', page: 6 },
                    { label: '8', page: 7 },
                    { label: '9', page: 8 },
                    { label: '10', page: 9 },
                ];
                pageableCollection.pageable.setPage(8);

                var pagesRange = pageableCollection.pageable.getPagesRange(false, false, 10);
                for (var i = 0; i < 10; i++) {
                    expect(pagesRange[i]).toEqual(jasmine.objectContaining(expected[i]));
                }
            });

            describe('Page changed event', function() {
                beforeEach(function() {
                    spyOn(pageableCollection, 'trigger');
                });

                it('should trigger changePage event on setPage', function() {
                    pageableCollection.pageable.setPage(1);
                    expect(pageableCollection.trigger).toHaveBeenCalledWith(PageEvents.PageChanged);
                });

                it('should not trigger changePage event on setPage when silent = true', function() {
                    pageableCollection.pageable.setPage(1, true);
                    expect(pageableCollection.trigger).not.toHaveBeenCalledWith(PageEvents.PageChanged);
                });
            });
        });
    }); 
}