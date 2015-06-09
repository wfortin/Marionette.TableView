/// <reference path="../_definitions.d.ts" />

module Marionette {
	export class RowView extends Marionette.ItemView<Backbone.Model> {
		constructor(options?: any) {
			super(_.extend({
				template: "#row",
				tagName: "tbody"
			}, options));
		}
	}
}