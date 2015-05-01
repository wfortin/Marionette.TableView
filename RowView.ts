/// <reference path="_definitions.d.ts" />

module Coveo {
	export class RowView extends Marionette.ItemView<Backbone.Model> {
		constructor(options?: any) {
			super(_.extend({
				template: "#row",
				tagName: "tr"
			}, options))
		}
		
		onRender() {
			console.log('Rendered');
		}
	}
}