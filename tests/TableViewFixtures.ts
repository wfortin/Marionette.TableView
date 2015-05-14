/// <reference path="tests.ts" />

module Marionette {
	
    // Initialize 9 elements, 5 even, 4 odd, decending
    export var filterableSortableGroupablePageableModels = [];
    for (var i = 8; i >= 0; i--) {
        filterableSortableGroupablePageableModels.push({
            id: i,
            value: i.toString(),
            isEven: i % 2 == 0
        });
    }
}