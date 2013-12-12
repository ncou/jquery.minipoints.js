// (Small) minipoints plugin
(function( $, window ) {

	$.fn.minipoint = function(options) {

		if(typeof options === 'function') {
			options = { handler: options };
		}
		var opts = $.extend( {}, $.fn.minipoint.defaults, options );

		function trigger(dir, e) {
			if (opts.sticky && e.type !== 'minipoints') {
				this.toggleClass( opts.stuckClassName , dir === 'down' );
			}
			opts.handler.call( this, dir );
		}

		return this.each(function() {

			var top, offset, dir, wrapper, offsetEl, el;
			offsetEl = el = $(this);

			if (opts.sticky && opts.wrapper.useWrapper) {

				wrapper = $('<div>')
					.addClass( opts.wrapper.className )
					.height( el.height() );

				el.after( wrapper );
				wrapper.append( $(this) );

				offsetEl = wrapper;
			}

			$(window).on('scroll resize touchmove minipoints', function(e) {
				var newdir;
				top = $.isFunction(opts.top) ? opts.top() : offsetEl.offset().top;
				top -= $(window).scrollTop();
				offset =  $.isFunction( opts.offset ) ? opts.offset() : opts.offset;
				newdir = top < offset ? 'up' : 'down';
				if (dir !== newdir || e.type === 'minipoints') {
					trigger.call( el, dir, e );
				}
				dir = newdir;
			}).trigger('scroll');

		});

	};

	$.fn.minipoint.defaults = {
		offset: 0,
		top: 0,
		sticky: false,
		stuckClassName: 'stuck',
		wrapper: {
			useWrapper: true,
			className: 'sticky-wrapper',
			height: false
		},
		handler: function(dir) { return dir; }
	};

}( jQuery, window ));