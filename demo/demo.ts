/// <reference path="../_definitions.d.ts" />

module Coveo {
  export class TableCollection extends Backbone.Collection<Backbone.Model> {
    filterable: FilterableCollection<Backbone.Model>;
    sortable: SortableCollection<Backbone.Model>;
    pageable: PageableCollection<Backbone.Model>;
  
    constructor(models?, options?) {
      super(models, _.extend({
        model: Backbone.Model
      }, options));
      TableCollectionBuilder.withFilters(this).withSort(this).withPagination(this, {
        modelsPerPage: 3,
        showXPages: 10
      })
    }
  }
}

var users = new Coveo.TableCollection(
  [
    {
      "firstName": "Sonya",
      "lastName": "Flowers",
      "phone": "+1 (842) 556-3810"
    },
    {
      "firstName": "Dixon",
      "lastName": "Finley",
      "phone": "+1 (925) 416-2751"
    },
    {
      "firstName": "Kellie",
      "lastName": "Albert",
      "phone": "+1 (867) 429-2201"
    },
    {
      "firstName": "Carter",
      "lastName": "Sosa",
      "phone": "+1 (851) 440-2041"
    },
    {
      "firstName": "Mccormick",
      "lastName": "Chavez",
      "phone": "+1 (801) 457-2193"
    },
    {
      "firstName": "Lina",
      "lastName": "Battle",
      "phone": "+1 (838) 487-3404"
    },
    {
      "firstName": "Mabel",
      "lastName": "Perez",
      "phone": "+1 (852) 571-2564"
    },
    {
      "firstName": "Edna",
      "lastName": "Phillips",
      "phone": "+1 (833) 443-2423"
    },
    {
      "firstName": "Daniel",
      "lastName": "Cortez",
      "phone": "+1 (870) 488-2641"
    },
    {
      "firstName": "Stanton",
      "lastName": "Davenport",
      "phone": "+1 (830) 497-2139"
    },
    {
      "firstName": "Woodward",
      "lastName": "Delaney",
      "phone": "+1 (825) 427-3699"
    },
    {
      "firstName": "Hull",
      "lastName": "Stout",
      "phone": "+1 (967) 483-3725"
    },
    {
      "firstName": "Wendy",
      "lastName": "Reese",
      "phone": "+1 (809) 558-3678"
    },
    {
      "firstName": "Montgomery",
      "lastName": "Horne",
      "phone": "+1 (852) 553-3681"
    },
    {
      "firstName": "Blackburn",
      "lastName": "Moss",
      "phone": "+1 (939) 419-3704"
    }
  ]);

$(document).ready(() => {
  var table = new Coveo.TableView({
    collection: users
  });
  table.render();

  $('#table-placeholder').html(table.el);
})