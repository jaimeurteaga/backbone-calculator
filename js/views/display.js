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
        console.log(this.model.toJSON());
        return this;
    }

});
