( function( $ ) {

	window.$bs = {
		$body : $( document.body ),
		prompt : function( message, callback, type, title, button ) {
			var me = this;
			callback = callback || $.noop;
			title = title || 'Alert';
			type = type || 'default';
			button = button || 'Ok';
			return $( '<div class="modal fade" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="panel panel-' + type + '" style="margin-bottom: 0;"><div class="panel-heading"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3 class="panel-title">' + title + '</h3></div><div class="panel-body"><p>' + message + '</p><textarea class="form-control" rows="5"></textarea></div><div class="panel-footer"><div class="btn-group btn-group-lg btn-group-justified" role="group"><div class="btn-group" role="group"><button type="button" class="btn btn-default" data-dismiss="modal">' + button + '</button></div></div></div></div></div></div></div>' ).appendTo( this.$body ).modal().on( 'hidden.bs.modal', function() {
				callback( $( 'textarea', this ).val() );
				$( this ).remove();
				$( window ).trigger( 'resize' );
			}).on( 'shown.bs.modal', function() {
				$( 'textarea', this ).focus();
			}).modal( 'show' );
		}, alert : function( message, callback, type, title, button ) {
			var me = this;
			callback = callback || $.noop;
			title = title || 'Alert';
			type = type || 'default';
			button = button || 'Ok';
			return $( '<div class="modal fade" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="panel panel-' + type + '" style="margin-bottom: 0;"><div class="panel-heading"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3 class="panel-title">' + title + '</h3></div><div class="panel-body"><p style="word-break: break-all;">' + message + '</p></div><div class="panel-footer"><div class="btn-group btn-group-lg btn-group-justified" role="group"><div class="btn-group" role="group"><button type="button" class="btn btn-default" data-dismiss="modal">' + button + '</button></div></div></div></div></div></div></div>' ).appendTo( this.$body ).modal().on( 'hidden.bs.modal', function() {
				callback.call( me );
				$( this ).remove();
				$( window ).trigger( 'resize' );
			}).modal( 'show' );
		}, confirm : function( message, callback, type, title, buttons ) {
			var me = this;
			callback = callback || $.noop;
			title = title || 'Confirm';
			type = type || 'default';
			buttons = buttons || [ 'Ok', 'Cancel' ];
			return $confirmModal = $( '<div class="modal fade" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="panel panel-' + type + '" style="margin-bottom: 0;"><div class="panel-heading"><button type="button" rel="0" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3 class="panel-title">' + title + '</h3></div><div class="panel-body"><p style="word-break: break-all;">' + message + '</p></div><div class="panel-footer"><div class="btn-group btn-group-lg btn-group-justified" role="group">' + buttons.map( function( b, i ) {
				return '<div class="btn-group" role="group"><button type="button" rel="' + ( i + 1 ) + '" class="btn btn-default">' + b + '</button></div>';
			}).join( '' ) + '</div></div></div></div></div></div>' ).appendTo( this.$body ).modal().on( 'click', 'button', function() {
				$confirmModal.modal( 'hide' );
				callback.call( me, this.getAttribute( 'rel' ) );
			}).modal( 'show' ).on( 'hidden.bs.modal', function() {
				$( this ).remove();
				$( window ).trigger( 'resize' );
			});
		}, popup : function( url, type, title, callback, backdrop ) {
			type = type || 'default';
			backdrop = backdrop || 'static';
			return $( '<div class="modal fade" data-backdrop="' + backdrop + '"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="panel panel-' + type + '" style="margin-bottom: 0;"><div class="panel-heading"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3 class="panel-title">' + ( title ? title : '<i class="fa fa-gear fa-spin"></i> Loading ...' ) + '</h3></div><div class="panel-body"><div class="embed-responsive embed-responsive-4by3"><iframe class="embed-responsive-item" style="width: 100%;min-height: 200px;border: none;" src="javascript:;"></iframe></div></div></div></div></div></div>' ).appendTo( this.$body ).modal().on( 'hidden.bs.modal', function() {
				$( this ).remove();
				$( window ).trigger( 'resize' );
			}).on( 'show.bs.modal', function() {
				$( this ).trigger( 'shown.bs.modal' );
			}).on( 'shown.bs.modal', function() {
				var $modal = $( this ), $iframe = $( 'iframe', $modal );
				if( $iframe[ 0 ].src != 'javascript:;' ) {
					return false;
				}
				$iframe.load( function() {
					var iWin = this.contentWindow || this, $iframe = $( this );
					iWin.parentSuccessCallback = function() {
						callback.apply( window, arguments );
						$modal.modal( 'hide' );
					};
					iWin.parentErrorCallback = function() {
						$modal.modal( 'hide' );
					};
					$( iWin.document ).on( 'load', 'img', function() {
						$iframe.height( window.innerHeight * .75 );
					});
					$iframe.height( window.innerHeight * .75 );
					$( 'h3.panel-title', $modal ).text( iWin.document.title );
				})[ 0 ].src = url;
			}).modal( 'show' );
		}, loader : {
			show : function( options ) {
				options = $.extend( {
					message : 'Loading ...',
					icon : true,
					timeout : 0,
					callback : $.noop,
					type : 'info'
				}, options );
				$( '<div id="bsLoaderModal" class="modal fade" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="panel panel-' + options.type + '" style="margin-bottom: 0;"><div class="panel-heading"><h3 class="panel-title">' +  ( options.icon ? '<i class="fa fa-gear fa-spin"></i> ' : '' ) + options.message + '</h3></div></div></div></div></div>' ).appendTo( $bs.$body ).modal().modal( 'show' ).on( 'hidden.bs.modal', function() {
					$( this ).remove();
					$( window ).trigger( 'resize' );
					options.callback();
				}).on( 'shown.bs.modal', function() {
					options.timeout && setTimeout( function() {
						$bs.loader.hide();
					}, options.timeout );
				});
			}, hide : function() {
				$( '#bsLoaderModal' ).modal( 'hide' );
			}
		}, progress : {
			started : false,
			percent : 10,
			start : function( type, update ) {
				if( $( '#app-progress' ).length == 0 ) {
					$( '<style type="text/css">#app-progress{position: fixed;display: none;position: fixed;top: 0;left: 0;width: 10%;z-index: 100;height: 3px;width: 10%;background: #ef5350;}#app-progress.in{display: block;}#app-progress:after{position: absolute;content: \'\';top: 0;opacity: 1;width: 10%;right: 0px;height: 3px;box-shadow: #b91f1f 1px 0 6px 2px;border-radius: 50%;}</style>' ).appendTo( document.head );
					$( '<div id="app-progress"></div>' ).prependTo( document.body );
				}
				type = type || 'danger';
				update = typeof update == 'undefined' ? true : update;
				$( '.bs-progress', $( '#app-progress' ).addClass( 'in' ) );
				this.started = true;
				this.percent = 10;
				update && setTimeout( this.update.bind( this ), parseInt( Math.random() * 10000000 ) % 1500 );
			}, update : function() {
				if( !this.started ) {
					return false;
				}
				var me = this;
				this.notify( this.percent + ( parseInt( Math.random() * 10000000 ) % 30 ), function() {
					setTimeout( me.update.bind( me ), parseInt( Math.random() * 10000000 ) % 1500 );
				});
			}, notify : function( percent, callback ) {
				if( !this.started ) {
					return false;
				}
				if( percent > 95 ) {
					percent = 95;
				}
				if( percent <= this.percent ) {
					return false;
				}
				this.percent = percent;
				callback = callback || $.noop;
				$( '#app-progress' ).animate({
					width : percent + '%'
				}, 'fast', callback );
			}, end : function() {
				if( !this.started ) {
					return false;
				}
				var me = this;
				$( '#app-progress' ).animate({
					width : '100%'
				}, 'fast', function() {
					$( '#app-progress' ).removeClass( 'in' ).removeAttr( 'style' );
					me.started = false;
					me.percent = 10;
				});
			}
		}
	};
	/* if( document.readyState != 'complete' ) {
		$bs.progress.start();
		window.addEventListener( 'load', $bs.progress.end.bind( $bs.progress ), false );
	} */
})( jQuery );
