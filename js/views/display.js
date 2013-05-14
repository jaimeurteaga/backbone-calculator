var app = app || {};

app.DisplayView = Backbone.View.extend({

    template: _.template($('#display-template').html()),

    initialize: function () {
        this.bindEvents();
        this.render();
    },

    bindEvents: function () {
        this.listenTo(this.model, 'change', this.render, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    command: function (character) {
        if (/[0-9\.]/.test(character)) {
            this.digitCommand(character);
        } else {
            switch (character) {
                case '/':
                case '*':
                case '-':
                case '+':
                    this.operationCommand(character);
                    break;
                case '=':
                    this.calculateCommand(true);
                    break;
                case 'C':
                    this.clearCommand(character);
                    break;
            }
        }
    },

    concat: function (operand, digit) {
        return (operand == 0 ? '' : operand) + '' + digit;
    },

    digitCommand: function (digit) {
        var data = this.model.toJSON(),
            value;
        if (data.reset) {
            if (data.operationFlag) {
                this.model.set({
                    result: digit,
                    operand2: digit,
                    reset: false
                });
            } else {
                this.model.set({
                    result: digit,
                    operand1: digit,
                    reset: false
                });
            }
        } else {
            if (data.operationFlag) {
                value = this.concat(data.operand2, digit);
                this.model.set({
                    result: value,
                    operand2: value
                });
            } else {
                value = this.concat(data.operand1, digit);
                this.model.set({
                    result: value,
                    operand1: value
                });                
            }
        }
    },

    operationCommand: function (operation) {
        var data = this.model.toJSON();
        if (data.operationFlag && data.operand2) {
            this.calculateCommand();
        }
        this.model.set({
            operation: operation,
            reset: true,
            operationFlag: true
        });
    },

    clearCommand: function () {
        this.model.set(this.model.defaults);
    },

    calculateCommand: function (isResultButton) {
        var data = this.model.toJSON(),
            value;
        if (data.operation) {
            data.operand2 = data.operand2 == null ? data.operand1 : data.operand2;
            data.operand1 = parseFloat(data.operand1);
            data.operand2 = parseFloat(data.operand2);
            switch (data.operation) {
                case '/':
                    value = data.operand1 / data.operand2;
                    break;
                case '*':
                    value = data.operand1 * data.operand2;
                    break;
                case '-':
                    value = data.operand1 - data.operand2;
                    break;
                case '+':
                    value = data.operand1 + data.operand2;
                    break;
            }
            if (isResultButton) {
                this.model.set({
                    result: value,
                    operand1: value,
                    operand2: data.operand2,
                    reset: true,
                    operationFlag: false
                });
            } else {
                this.model.set({
                    result: value,
                    operand1: value,
                    operand2: null,
                    reset: true,
                    operationFlag: true
                });
            }
        }
    }

});
