var app = app || {};

app.Display = Backbone.Model.extend({

    defaults: {
        operand1: 0,
        operand2: 0,
        operation: null,
        reset: false
    }

});
