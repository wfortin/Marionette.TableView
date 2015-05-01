/// <reference path="_definitions.d.ts" />

module Coveo {
    export var PickySelectableEvents = {
        Selected: 'selected',
        Deselected: 'deselected'
    };

    export var SingleSelectEvents = {
        SelectOne: 'select:one',
        DeselectOne: 'deselect:one'
    };

    export var MultiSelectEvents = {
        SelectAll: 'select:all',
        SelectNone: 'select:none',
        SelectSome: 'select:some'
    };

    export class PickySelectable extends Backbone.Model {
        selected: boolean;
        select: () => void;
        deselect: () => void;
        toggleSelected: () => void;

        constructor(attributes?, options?) {
            super(attributes, options);

            var selectable = new Backbone.Picky.Selectable(this);
            $.extend(this, selectable);
        }
    }

    export class PickySingleSelect<TModel extends Backbone.Model> extends Backbone.Collection<TModel> {
        selected: TModel;
        pickySelect: (model: TModel) => void;
        deselect: (model: TModel) => void;

        constructor(models?, options?) {
            super(models, options);

            var singleSelect = new Backbone.Picky.SingleSelect(this);

            // The 'select' method already exists on a Backbone Collection. We're moving Picky's 'select' to 'pickySelect'.
            var pickySelect = singleSelect.select;
            delete singleSelect.select;
            singleSelect.pickySelect = pickySelect;

            $.extend(this, singleSelect);
        }
    }

    export interface PickyMultiSelectSelectedHash<TModel extends PickySelectable> {
        [k: string]: TModel;
    }

    export class PickyMultiSelect<TModel extends PickySelectable> extends Backbone.Collection<TModel> {
        pickySelect: (model: TModel) => void;
        deselect: (model: TModel) => void;
        selectAll: () => void;
        selectNone: () => void;
        toggleSelectAll: () => void;
        selected: PickyMultiSelectSelectedHash<TModel>;
        selectedLength: number;

        constructor(models?, options?) {
            super(models, options);

            var multiSelect = new Backbone.Picky.MultiSelect(this);

            // The 'select' method already exists on a Backbone Collection. We're moving Picky's 'select' to 'pickySelect'.
            var pickySelect = multiSelect.select;
            delete multiSelect.select;
            multiSelect.pickySelect = pickySelect;

            $.extend(this, multiSelect);
        }
    }
}
