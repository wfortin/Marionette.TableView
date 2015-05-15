/// <reference path="../_definitions.d.ts" />

module Marionette {
	export class GroupRowView extends Marionette.CompositeView<Backbone.Model, Backbone.Collection<Backbone.Model>> {
		
		model: GroupModel;

		constructor(options?: any) {
			super(_.extend({
				template: "#group-row",
				tagName: "tbody"
			}, options));

			this.childView = GroupRowItemView;
			this.childViewContainer = 'tbody';
			
			this.collection = this.model.items;
		}

		attachHtml(collectionView, childView, index) {
			this.$el.append(childView.el);
        }
		
        attachBuffer(compositeView, buffer) {
            this.$el.append(buffer);
        }
	}

	export class GroupRowItemView extends Marionette.ItemView<Backbone.Model> {
		constructor(options?: any) {
			super(_.extend({
				template: "#group-row-item",
				tagName: "tr"
			}, options));
		}
	}
}