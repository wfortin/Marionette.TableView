/// <reference path="../_definitions.d.ts" />

module Marionette {
  export class TableCollection extends Backbone.Collection<Backbone.Model> {
    filterable: FilterableCollection<Backbone.Model>;
    sortable: SortableCollection<Backbone.Model>;
    pageable: PageableCollection<Backbone.Model>;
    groupable: GroupableCollection<Backbone.Model>;

    constructor(models?, options?) {
      super(models, _.extend({
        model: Backbone.Model
      }, options));
      TableCollectionBuilder.withFilters(this).withSort(this).withPagination(this, {
        modelsPerPage: 3,
        showXPages: 10
      }).withGroups(this, { key: 'team' });
    }
  }
}

var users = new Marionette.TableCollection(
  [
    {
      "firstName": "Sonya",
      "lastName": "Flowers",
      "phone": "+1 (842) 556-3810",
      "team": "red"
    },
    {
      "firstName": "Dixon",
      "lastName": "Finley",
      "phone": "+1 (925) 416-2751",
      "team": "red"
    },
    {
      "firstName": "Kellie",
      "lastName": "Albert",
      "phone": "+1 (867) 429-2201",
      "team": "red"
    },
    {
      "firstName": "Carter",
      "lastName": "Sosa",
      "phone": "+1 (851) 440-2041",
      "team": "red"
    },
    {
      "firstName": "Mccormick",
      "lastName": "Chavez",
      "phone": "+1 (801) 457-2193",
      "team": "red"
    },
    {
      "firstName": "Lina",
      "lastName": "Battle",
      "phone": "+1 (838) 487-3404",
      "team": "blue"
    },
    {
      "firstName": "Mabel",
      "lastName": "Perez",
      "phone": "+1 (852) 571-2564",
      "team": "blue"
    },
    {
      "firstName": "Edna",
      "lastName": "Phillips",
      "phone": "+1 (833) 443-2423",
      "team": "blue"
    },
    {
      "firstName": "Daniel",
      "lastName": "Cortez",
      "phone": "+1 (870) 488-2641",
      "team": "blue"
    },
    {
      "firstName": "Stanton",
      "lastName": "Davenport",
      "phone": "+1 (830) 497-2139",
      "team": "blue"
    },
    {
      "firstName": "Woodward",
      "lastName": "Delaney",
      "phone": "+1 (825) 427-3699",
      "team": "blue"
    },
    {
      "firstName": "Hull",
      "lastName": "Stout",
      "phone": "+1 (967) 483-3725",
      "team": "green"
    },
    {
      "firstName": "Wendy",
      "lastName": "Reese",
      "phone": "+1 (809) 558-3678",
      "team": "green"
    },
    {
      "firstName": "Montgomery",
      "lastName": "Horne",
      "phone": "+1 (852) 553-3681",
      "team": "green"
    },
    {
      "firstName": "Blackburn",
      "lastName": "Moss",
      "phone": "+1 (939) 419-3704",
      "team": "green"
    }
  ]);

$(document).ready(() => {
  var tableView = new Marionette.TableView({
    collection: users
  });
  tableView.render();

  $('#table-placeholder').html(tableView.el);


  var groupsTableView = new Marionette.TableView({
    collection: users.groupable
  });
  groupsTableView.render();

  $('#groupable-table-placeholder').html(groupsTableView.el);
})