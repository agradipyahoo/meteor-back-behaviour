Template.BackButton.events({
  'touchend .back-behaviour-back-button-wrapper': function (event) {
    var dataContext = Blaze.getData(event.target);

    BackBehaviour.goBack({
      dataContext: dataContext,
      templateEvent: event
    }, 'BackButton_click');
  }
});
