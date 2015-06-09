/// <reference path="../_definitions.d.ts" />

module Marionette {
	export class GroupRowView extends Marionette.CompositeView<Backbone.Model, Backbone.Collection<Backbone.Model>> {
		collection: GroupCollection;
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
		
        protected filter(child: FilterableModel, index: number, collection: GroupCollection) {
            if (this.collection.filterable) {
                if (child.matchesFilter === true) {
                        return true;
                }
            } else {
                return true;
            }
        }
		
        protected viewComparator(a, b) {
            if (this.collection.sortable) {
                return this.collection.sortable.compare(a, b);
            }
            return 0;
        }
	}

	export class GroupRowItemView extends Marionette.ItemView<Backbone.Model> {
		constructor(options?: any) {
			super(_.extend({
				template: "#group-row-item",
				tagName: "tr"
			}, options));
		}
		
		onRender() {
			console.log(this.model.toJSON())
		}
 	}
}