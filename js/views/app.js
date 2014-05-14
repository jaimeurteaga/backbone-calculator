var app = app || {};

// App view responsible for rendering app
app.AppView = Backbone.View.extend({

    el: $('#calculator'),

    template: _.template($('#app-template').html()),

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        this.bindEvents();
        this.renderDisplay();
        this.renderButtons();

        // Set initial focus to calculator for keypress use
        jQuery('input').focus();
        return this;
    },

    bindEvents: function () {
        this.listenTo(this.model, 'change', this.onCalculatorChange, this);
    },

    onCalculatorChange: function () {
        this.displayView.setValue(this.model.get('result'));
    },

    renderDisplay: function () {
        this.displayView = new app.DisplayView({
            model: this.model
        });
        this.$('.display').append(this.displayView.el);
    },

    renderButtons: function () {
        var i = 10;
        this.buttons = {};
        while (i--) {
            this.renderButton({
                value: i,
                viewClass: 'btn-' + i,
                buttonClass: ''
            });
        }
        this.renderButton({
            value: '/',
            viewClass: 'btn-divide',
            buttonClass: 'btn-info'
        });
        this.renderButton({
            value: '+',
            viewClass: 'btn-plus',
            buttonClass: 'btn-info'
        });
        this.renderButton({
            value: '-',
            viewClass: 'btn-minus',
            buttonClass: 'btn-info'
        });
        this.renderButton({
            value: '.',
            viewClass: 'btn-dot',
            buttonClass: ''
        });
        this.renderButton({
            value: '*',
            viewClass: 'btn-multiply',
            buttonClass: 'btn-info'
        });
        this.renderButton({
            value: '=',
            viewClass: 'btn-return',
            buttonClass: 'btn-info'
        });
        this.renderButton({
            value: 'C',
            viewClass: 'btn-clear',
            buttonClass: 'btn-danger'
        });
    },

    renderButton: function (options) {
        options.viewClass = options.viewClass || options.value;
        this.buttons[options.value] = new app.ButtonView({
            model: new app.Button({
                value: options.value,
                className: options.buttonClass
            })
        });
        this.$('.' + options.viewClass).append(this.buttons[options.value].el);
    },

    events: {
        'click .btn': 'onButtonClick',

        // Add keypress event to input
        'keypress input': 'onKeyPress'
    },

    onButtonClick: function (e) {
        var value = $(e.currentTarget).data('value');
        this.model.command(value);
    },

    onKeyPress: function (e) {
        // Sets keycode to var key
        var keyCode = e.keyCode;

        // Passes keyCode to typedCommand function in model
        this.model.typedCommand(keyCode);

        // Prevents characters from being typed into input
        e.preventDefault();
    }

});
