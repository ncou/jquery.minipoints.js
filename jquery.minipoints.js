// (Small) waypoints plugin
(function( $, window ) {
	'use strict';

	var DIRECTION = { DOWN: 'down', UP: 'up' };

	$.fn.minipoint = function(options) {

		if(typeof options === 'function') {
			options = { handler: options };
		}
		var opts = $.extend( {}, $.fn.minipoint.defaults, options );

		function trigger(dir, e) {
			if (opts.sticky && e.type !== 'minipoints') {
				this.toggleClass( opts.stuckClassName , dir === DIRECTION.DOWN );
			}
			opts.handler.call( this, dir );
		}

		function scrollHandler (scrollPosition, offsetEl, e) {
			var newdir, top, offset;
			top = $.isFunction(opts.top) ? opts.top() : offsetEl.offset().top;
			top -= scrollPosition;
			offset =  $.isFunction( opts.offset ) ? opts.offset() : opts.offset;
			newdir = top < offset ? DIRECTION.UP : DIRECTION.DOWN;
			if (this.data('dir') !== newdir || e.type === 'minipoints') {
				trigger.call( this, this.data('dir'), e );
			}
			this.data('dir', newdir);
		}

		return this.each(function() {

			var el = $(this),
				offsetEl = el,
				scrollEvent = { type: 'scroll' };

			if (opts.sticky && opts.wrapper.useWrapper) {

				el.wrap( $('<div>', {
					class: opts.wrapper.className,
					height: el.height()
				}));

				offsetEl = el.parent('.' + opts.wrapper.className);
			}

			$(window).on('scroll.minipoints resize.minipoints touchmove.minipoints minipoints', function(e) {
				scrollHandler.call(el, $(window).scrollTop(), offsetEl, e);
			});

			scrollHandler.call(el, 0, offsetEl, scrollEvent);
			scrollHandler.call(el, $(window).scrollTop(), offsetEl, scrollEvent);
			
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