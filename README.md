# chriswessels:back-behaviour

A Meteor.js smart-package that provides a pattern for defining and triggering in-app back button behaviour.

### Why?

Well, when you have an in-app back button, sometimes it's difficult to determine where to send a user when they click it. This is further complicated by the fact that often our apps are highly modular, and a template containing a back button may be included in many different contexts where the desired 'back behaviour' is different. This package provides a solution.

### How?

This package allows you to define back button behaviour on your Blaze templates and (optionally) your `iron-router` controllers. When someone clicks your in-app back button, this package will traverse the current template tree (bottom-up) to determine what it should do to send your user back. If it doesn't find back behaviour in the current template tree and you are using `iron-router`, it will check your route controller for back behaviour too.

The versatility of this functionality becomes especially powerful with highly nested routes or templates because you can defer back behaviour to the higher order template or route context.

## Installation

In your Meteor.js project directory, run

    $ meteor add chriswessels:back-behaviour

## Usage

### Defining Back Behaviour

You can define back behaviour in your Blaze Templates and (if you are using `iron-router`) your route controllers.

Back Behaviour is defined using a callback function, so you can do anything. This could be sending the user to another route, or modifying `Session` or another `ReactiveDict` to trigger UI behaviour.

The `this` context of your callback function will be set to the instance of the object in which it is defined. So, if it is defined in a template, `this` will be the corresponding `Blaze.TemplateInstance`. If it is defined on an `iron-router` route controller, it will be the corresponding `Iron.Controller`.

The callback will receive two arguments:

1. A `details` object containing meta information.
1. An `origin` string, describing where the back event originated.

These arguments are purely there to enable you to determine what you want to do when the user wants to go back.

More information on what these arguments will contain is in the **Triggering Back Behaviour** section below. *Hint: You can customise them if you use `BackBehaviour.goBack`.*

#### Defining Back Behaviour in your templates

This package provides a `Template.foo.onBack` function for specifying a back behaviour callback function.

Example:

```javascript
Template.Settings.onBack(function (details, origin) {
  // `this` will be the `Blaze.TemplateInstance` for the Settings template.
  // `details` will contain meta information.
  // `origin` will describe where the back event originated.

  // I could Router.go here to send the user to another route
  // or I could modify a ReactiveDict on the TemplateInstance and propagate a UI change
  // or anything else...
});
```

If back behaviour is triggered (see triggering details below) from any template that is nested under the `Settings` template, this callback function will be fired and you can deal with it appropriately (unless onBack has been defined in a deeper-nested template in the current template tree).

#### Defining Back Behaviour in your iron-router controllers

If you are using `iron-router` you can specify back behaviour for a route with the `onBack` property. This must be done in your `Iron.Controller` definition.

Example:

```javascript
// Iron.Controller
ActivityController = RouteController.extend({
  // ...
  onBack: function (details, origin) {
    // `this` will be `ActivityController`
    // `details` will contain meta information.
    // `origin` will describe where the back event originated.

    // I could Router.go here to send the user to another route
    // or I could modify a ReactiveDict like `this.state`
    // or anything else...
  }
});
```

Defining back behaviour on your route controllers let's you define a navigational hierarchy entirely in your routing layer.

### Triggering Back Behaviour

#### BackButton Template Helper

The `BackButton` template helper will the trigger back behaviour on `click` for any HTML that you place inside the block helper.

Example of usage:

```html
<template name="HeaderBar">
  <!-- Below: Your in-app back button -->
  {{#BackButton}}
    <!-- Some HTML: In this case a left arrow icon -->
    <div class="my-back-button">
      <i class="fa fa-chevron-left fa-2x"></i>
    </div>
  {{/BackButton}}
  <!-- ... -->
  <!-- other header bar HMTL -->
</template>
```

Back behaviour that is triggered from a `BackButton` in your templates will pass the following arguments into your back behaviour callback function(s):

1. The `details` object will contain the following keys:
 - `dataContext`: This key will be set to the current data context of the back button in your template.
 - `templateEvent`: This key will be set to the `jQuery.Event` from the `click` event on the `BackButton`.
1. The `origin` string will be set to `BackButton_click`.

#### BackBehaviour.goBack Function

You can also trigger back behaviour from within your code using the `BackBehaviour.onBack` function. This function accepts two optional arguments that are passed into your back behaviour callback function(s).

1. (optional) The `details` object. You can pass any meta information you'd like.
1. (optional) The `origin` string. This will be set to `custom` if you do not pass a string.

Example:

```javascript
Template.SomeTemplate.events({
  'doubleclick .foo': function (event) {
    Meteor.call('someMethod', function (error, result) {
      if (error) {

        // Very simply:
        BackBehaviour.goBack();

        // Or, more complex:
        BackBehaviour.goBack({
          methodError: error,
          dataContext: Blaze.getData(event.target),
          templateEvent: event
        }, 'someMethod_fail');

      } else {
        // do something
      }
    })
  }
});
```

## License

Please see the `LICENSE` file for more information.