/// <reference path="../_definitions.d.ts" />

module Marionette {
    export interface PageableCollectionOptions {
        modelsPerPage?: number;
        showXPages?: number;
    }

    export var PageableCollectionOptionsDefault: PageableCollectionOptions = {
        modelsPerPage: 10,
        showXPages: 6
    };

    export interface PaginationItem {
        label: string;
        page: number;
        icon?: string;
    }

    export interface PagesInfos {
        min: number;
        max: number;
    }

    export var PageEvents = {
        PageChanged: 'changePage'
    };

    export class PageableCollection<TModel extends Backbone.Model> {
        private options: PageableCollectionOptions;
        private currentPage = 0;
        private offset = 0;

        constructor(private collection: Backbone.Collection<TModel>, options: PageableCollectionOptions = {}) {
            this.options = _.defaults(options, PageableCollectionOptionsDefault);
        }

        set modelsPerPage(n: number) {
            this.options.modelsPerPage = n;
        }

        get modelsPerPage(): number {
            return this.options.modelsPerPage;
        }

        get minIndex(): number {
            return this.options.modelsPerPage * this.currentPage;
        }

        get maxIndex(): number {
            return this.minIndex + this.options.modelsPerPage - 1;
        }

        get page(): number {
            return this.currentPage + this.offset;
        }

        setPage(p: number, silent: boolean = false, offset: number = 0) {
            this.currentPage = Math.max(Math.min(p, this.lastPage), 0);
            this.offset = offset;
            if (!silent) {
                this.collection.trigger(PageEvents.PageChanged);
            }
        }

        get pagesInfo(): PagesInfos {
            return {
                min: this.minIndex,
                max: this.maxIndex
            };
        }

        get lastPage(): number {
            var length = this.collection.length;
            if (this.collection["filterable"]) {
                var coll: Filterable<TModel> = <any>this.collection;
                length = coll.filterable.getVisibleCount();
            }
            return Math.ceil(length / this.options.modelsPerPage) - 1;
        }

        nextPage(silent: boolean = false) {
            this.currentPage = Math.max(Math.min(this.currentPage + 1, this.lastPage), 0);
            if (!silent) {
                this.collection.trigger(PageEvents.PageChanged);
            }
        }

        previousPage(silent: boolean = false) {
            this.currentPage = Math.max(Math.min(this.currentPage - 1, this.lastPage), 0);
            if (!silent) {
                this.collection.trigger(PageEvents.PageChanged);
            }
        }

        shouldRender(index: number): boolean {
            return index >= this.minIndex && index <= this.maxIndex;
        }

        getPagesRange(showPrevNext = true, showFirstLast = false, lastPage = 0): PaginationItem[] {
            var pages: PaginationItem[] = [];
            lastPage = Math.max(this.lastPage, lastPage);

            var start: number;
            var end: number;

            var offsetedPage = this.currentPage + this.offset;
            if (offsetedPage + (this.options.showXPages / 2) > lastPage) {
                end = lastPage;
                start = Math.max(lastPage - this.options.showXPages, 0);
            } else {
                start = Math.max(Math.floor((this.currentPage + this.offset) - (this.options.showXPages / 2)), 0);
                end = Math.min(start + this.options.showXPages, lastPage);
            }

            _.each(_.range(start, end + 1), (i) => {
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
        }
    }
}