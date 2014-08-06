/**
 * Created by paul on 05/08/2014.
 */

( function( $ ){
	"use strict";

	/**
	 * Pretty Form checkboxes
	 *
	 * @param $el
	 * @param options
	 *
	 * @constructor
	 */
	var PrettyFormCheckbox = function( $el, options ){

		this.options = options;
		this.$el = $el;

		this.initialize();
	};

	/**
	 * Initialise the plugin, cache reference to input and checked value
	 */
	PrettyFormCheckbox.prototype.initialize = function(){

		this.$input = this.$el.find( 'input' );
		this.isChecked = this.$input.is( ':checked' );

		// If checkbox is initially checked then make sure the active class is added to the element.
		if( this.isChecked )
			this.$el.addClass( this.options.activeClass );

		this.setupBindings();
	};

	/**
	 * Setup bindings for clicking the element
	 */
	PrettyFormCheckbox.prototype.setupBindings = function(){

		this.$el.on( 'click', $.proxy( this.onClick, this ) );
	};

	/**
	 * Called when the element has been clicked, prevent default action and toggle the input element
	 *
	 * @param event
	 */
	PrettyFormCheckbox.prototype.onClick = function( event ){

		event.preventDefault();
		this.toggleChecked();
	};

	/**
	 * Toggles the input element.
	 */
	PrettyFormCheckbox.prototype.toggleChecked = function(){

		if( this.isChecked )
			this.unCheck();

		else
			this.check();
	};

	/**
	 * Checks the input element and adds active class to the element
	 */
	PrettyFormCheckbox.prototype.check = function(){

		this.isChecked = true;
		this.$input.prop( 'checked', true );
		this.$el.addClass( this.options.activeClass );
	};

	/**
	 * Unchecks the input element and removes active class to the element
	 */
	PrettyFormCheckbox.prototype.unCheck = function(){

		this.isChecked = false;
		this.$input.prop( 'checked', false );
		this.$el.removeClass( this.options.activeClass );
	};

	/**
	 * Radios buttons
	 *
	 * @extends PrettyFormCheckbox
	 *
	 * @param $el
	 * @param options
	 *
	 * @constructor
	 */
	var PrettyFormRadios = function( $el, options ){

		PrettyFormCheckbox.apply( this, arguments );
	};
	PrettyFormRadios.prototype = Object.create( PrettyFormCheckbox.prototype );
	PrettyFormRadios.prototype.constructor = PrettyFormRadios;

	/**
	 * Override the parent on click to turn off all radios before calling parent method.
	 * @param event
	 */
	PrettyFormRadios.prototype.onClick = function( event ){

		this.turnOffAllRadios();

		PrettyFormCheckbox.prototype.onClick.apply( this, arguments );
	};

	/**
	 * Finds all the radios siblings.
	 *
	 * @returns {*}
	 */
	PrettyFormRadios.prototype.findSiblings = function(){

		var radioGroup = this.$input.prop( 'name' );
		var elementClass = this.$el.prop( 'class' ).replace( this.options.activeClass );
		var $siblings = $( 'input[name=' + radioGroup + ']' ).parents( this.options.siblingParentSelector ).find( '.' + elementClass );

		return $siblings;
	};

	/**
	 * Turn off all the radios in the collection.
	 */
	PrettyFormRadios.prototype.turnOffAllRadios = function(){

		var $siblings = this.findSiblings();

		$siblings.each( $.proxy( function( index, siblingEl ){

			var $sibling = $( siblingEl );
			var formControl = $sibling.data( 'prettyFormControl' );

			if( formControl != this ) {
				formControl.unCheck();
			}

		}, this ) );
	};

	/**
	 * Default options
	 */
	var	checkBoxDefaultOptions = {
		activeClass: 'checked'
	};

	var radioDefaultOptions = $.extend( true , {}, checkBoxDefaultOptions, {
		siblingParentSelector: '.pretty-forms.radios'
	} );

	var defaultOptions = {
		type: 'checkboxes'
	};

	/**
	 * Initialise the plugin
	 *
	 * @param options
	 */
	$.fn.prettyFormControl = function( options ){

		options = $.extend( true, defaultOptions, options );
		var type = options.type;

		var ClassToLoad;

		switch( type ){

			case 'checkbox':
			case 'checkboxes':

				options = $.extend( true, {}, checkBoxDefaultOptions, options );
				ClassToLoad = PrettyFormCheckbox;

				break;

			case 'radio':
			case 'radios':

				options = $.extend( true, {}, radioDefaultOptions, options );
				ClassToLoad = PrettyFormRadios;

				break;
		}

		this.each( function(){

			var $el = $( this );

			if( ! $el.data( 'prettyFormControl' ) )
				$el.data( 'prettyFormControl', new ClassToLoad( $el, options ) );
		});

	};

})( jQuery );
