var app = app || {};

app.Display = Backbone.Model.extend({

    defaults: {
        result: 0,
        operand1: 0,
        operand2: null,
        operation: null,
        reset: false,
        operationFlag: false
    }

});
