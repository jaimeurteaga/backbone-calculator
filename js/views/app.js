var app = app || {};

app.AppView = Backbone.View.extend({

    el: $('#calculator'),

    template: _.template($('#app-template').html()),

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        this.renderDisplay();
        this.renderButtons();
        return this;
    },

    renderDisplay: function () {
        this.displayView = new app.DisplayView({
            model: new app.Display({
                value: 0
            })
        });
        this.$('.display').append(this.displayView.el);
    },

    renderButtons: function () {
        var i = 10;
        this.buttons = {};
        while (i--) {
            this.renderButton(i);
        }
        this.renderButton('/', 'Divide');
        this.renderButton('+', 'Plus');
        this.renderButton('-', 'Minus');
        this.renderButton('.', 'Dot');
        this.renderButton('*', 'Multiply');
        this.renderButton('=', 'Return');
        this.renderButton('C', 'Cancel');
    },

    renderButton: function (value, className) {
        var className = className || value;
        this.buttons[value] = new app.ButtonView({
            model: new app.Button({
                value: value
            })
        });
        this.$('.button' + className).append(this.buttons[value].el);
    },

    events: {
        'click .btn': 'onButtonClick'
    },

    onButtonClick: function (e) {
        var value = $(e.currentTarget).data('value');
        this.displayView.model.appendValue(value);
    }

});
