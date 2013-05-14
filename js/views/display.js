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
                    this.calculateCommand();
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
        var data = this.model.toJSON();
        if (data.reset) {
            this.model.set({
                operand1: digit,
                operand2: data.operand1,
                reset: false
            });
        } else {
            this.model.set({
                operand1: this.concat(data.operand1, digit)
            });
        }
    },

    operationCommand: function (operation) {
        this.calculateCommand();
        var data = this.model.toJSON();
        this.model.set({
            operation: operation,
            reset: true
        });
    },

    clearCommand: function () {
        this.model.set(this.model.defaults);
    },

    calculateCommand: function () {
        var data = this.model.toJSON(),
            value;
        if (data.operation) {
            // console.log(replaceOperands);
            // if (replaceOperands) {
            //     value = data.operand1;
            //     data.operand1 = data.operand2;
            //     data.operand2 = value;
            // }
            switch (data.operation) {
                case '/':
                    value = data.operand2 / data.operand1;
                    break;
                case '*':
                    value = data.operand2 * data.operand1;
                    break;
                case '-':
                    value = data.operand2 - data.operand1;
                    break;
                case '+':
                    value = data.operand2 + data.operand1;
                    break;
            }
            this.model.set({
                operand1: value,
                operand2: data.operand1,
                reset: true
            });
        }
    }

});
