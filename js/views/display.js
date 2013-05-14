var app = app || {};

app.DisplayView = Backbone.View.extend({

    template: _.template($('#display-template').html()),

    initialize: function () {
        this.bindEvents();
        this.render();
    },

    bindEvents: function () {
        this.listenTo(this.model, 'change', this.updateDisplayValue, this);
        this.listenTo(this.model, 'change:displayValue', this.render, this);
    },

    render: function () {
        console.log('render');
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
                case '=':
                    this.operationCommand(character);
                    break;
                case 'C':
                    this.clearCommand(character);
                    break;
            }
        }
    },

    digitCommand: function (digit) {
        var data = this.model.toJSON();
        if (data.resetStack) {
            data.stack = [digit];
        } else {
            data.stack = _.clone(data.stack.concat([digit]));
        }
        this.model.set({
            stack: data.stack,
            resetStack: false
        });
    },

    operationCommand: function (operation) {
        var data = this.model.toJSON(),
            valueStack = data.valueStack;
        if (operation != '=') {
            valueStack = _.clone(data.valueStack.concat([this.getDisplayValue()]));
        }
        this.model.set({
            resetStack: true,
            operation: operation,
            valueStack: valueStack
        });
        this.returnCommand();
    },

    clearCommand: function () {
        this.model.set('stack', [0]);
    },

    returnCommand: function () {
        var data = this.model.toJSON();
        if (data.valueStack.length == 2) {
            this.calculateOperation();
        }
    },

    calculateOperation: function () {
        var data = this.model.toJSON(),
            value;
        switch (this.model.previous('operation')) {
            case '/':
                value = data.valueStack[0] / data.valueStack[1];
                break;
            case '*':
                value = data.valueStack[0] * data.valueStack[1];
                break;
            case '-':
                value = data.valueStack[0] - data.valueStack[1];
                break;
            case '+':
                value = data.valueStack[0] + data.valueStack[1];
                break;
        }
        this.model.set({
            stack: [value],
            resetStack: true,
            valueStack: [value]
        });
    },

    updateDisplayValue: function () {
        this.model.set('displayValue', this.getDisplayValue());
    },

    getDisplayValue: function () {
        return parseFloat(this.model.get('stack').join(''));
    }

});
