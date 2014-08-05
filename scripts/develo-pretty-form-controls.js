/**
 * Created by paul on 05/08/2014.
 */
( function( $ ){
	"use strict";

	var BasePrettyFormControl = function( $el, options ){

		this.options = options;
		this.$el = $el;

		this.initialize();
	};

	BasePrettyFormControl.prototype.initialize = function(){

		this.setupBindings();
	};

	BasePrettyFormControl.prototype.setupBindings = function(){
		// Overridden by child
	};

	var PrettyFormCheckbox = BasePrettyFormControl.extend();

	PrettyFormCheckbox.prototype.initialize = function(){

		this.$input = this.$el.find( 'input' );
		this.isChecked = this.$input.is( ':checked' );

		BasePrettyFormControl.prototype.initialize.apply( this, arguments );
	};

	PrettyFormCheckbox.prototype.setupBindings = function(){

		var thisCheckbox = this;
		this.$el.on( 'click', thisCheckbox.onClick );
	};

	PrettyFormCheckbox.prototype.onClick = function( event ){

		this.toggleChecked();
	};

	PrettyFormCheckbox.prototype.toggleChecked = function(){

		this.isChecked ?
			this.unCheck():
			this.check();
	};

	PrettyFormCheckbox.check = function(){

		this.isChecked = true;
		this.$input.prop( 'checked', true );
		this.$el.addClass( this.options.activeClass );
	};

	PrettyFormCheckbox.unCheck = function(){

		this.isChecked = false;
		this.$input.prop( 'checked', false );
		this.$el.removeClass( this.options.activeClass );
	};

	var checkBoxDefaultOptions = {
		activeClass: 'checked'
	};

	var defaultOptions = {
		type: 'checkboxes'
	};

	$.fn.prettyFormControl = function( options ){

		options = $.extend( true, defaultOptions, options );
		var type = options.type;

		var ClassToLoad;

		switch( type ){

			case 'checkbox':
			case 'checkboxes':

				options = $.extend( true, checkBoxDefaultOptions, options );
				ClassToLoad = PrettyFormCheckbox;

				break;
		}

		this.each( function(){

			var $el = $( this );

			$el.data( 'prettyFormControl', new ClassToLoad( $el, options ) );
		});

	};

})( jQuery );
