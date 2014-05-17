/******************************************************************************
 *                                                                            *
 *    This file is part of RPB Chessboard, a Wordpress plugin.                *
 *    Copyright (C) 2013-2014  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    This program is free software: you can redistribute it and/or modify    *
 *    it under the terms of the GNU General Public License as published by    *
 *    the Free Software Foundation, either version 3 of the License, or       *
 *    (at your option) any later version.                                     *
 *                                                                            *
 *    This program is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           *
 *    GNU General Public License for more details.                            *
 *                                                                            *
 *    You should have received a copy of the GNU General Public License       *
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.   *
 *                                                                            *
 ******************************************************************************/


/**
 * Tools to represent PGN data in HTML pages.
 *
 * @author Yoann Le Montagner
 *
 * @requires chess.js {@link https://github.com/jhlywa/chess.js}
 * @requires pgn.js
 * @requires chesswidget.js
 * @requires jQuery
 * @requires jQuery UI Widget
 * @requires jQuery-color
 *
 * TODO: check required packages
 */
(function(Chess, Pgn, $)
{

	/**
	 * Internationalization constants.
	 */
	$.chessgame =
	{
		/**
		 * Annotator field template.
		 * @type {string}
		 */
		ANNOTATED_BY: 'Annotated by %1$s',

		// Miscellaneous
		initialPosition: 'Initial position',

		/**
		 * Month names.
		 * @type {string[]}
		 */
		MONTHS: [
			'January', 'February', 'March'    , 'April'  , 'May'     , 'June'    ,
			'July'   , 'August'  , 'September', 'October', 'November', 'December'
		],

		/**
		 * Chess piece symbols.
		 * @type {{K:string, Q:string, R:string, B:string, N:string, P:string}}
		 */
		PIECE_SYMBOLS: {
			'K':'K', 'Q':'Q', 'R':'R', 'B':'B', 'N':'N', 'P':'P'
		}
	};


	/**
	 * Convert a PGN date field value into a human-readable date string.
	 * Return null if the special code "????.??.??" is detected.
	 * Otherwise, if the input is badly-formatted, it is returned "as-is".
	 *
	 * @param {string} date Value of a PGN date field.
	 * @returns {string}
	 */
	function formatDate(date)
	{
		// Null input or case "????.??.??" -> no date is defined.
		if(date===null || date==='????.??.??') {
			return null;
		}

		// Case "2013.05.20" -> return "20 may 2013"
		else if(date.match(/([0-9]{4})\.([0-9]{2})\.([0-9]{2})/)) {
			var month = parseInt(RegExp.$2);
			if(month>=1 && month<=12) {
				var dateObj = new Date(RegExp.$1, RegExp.$2-1, RegExp.$3);
				return dateObj.toLocaleDateString(); //null, { year: 'numeric', month: 'long', day: 'numeric' });
			}
			else
				return RegExp.$1;
		}

		// Case "2013.05.??" -> return "May 2013"
		else if(date.match(/([0-9]{4})\.([0-9]{2})\.\?\?/)) {
			var month = parseInt(RegExp.$2);
			if(month>=1 && month<=12) {
				return $.chessgame.MONTHS[month-1] + ' ' + RegExp.$1;
			}
			else
				return RegExp.$1;
		}

		// Case "2013.??.??" -> return "2013"
		else if(date.match(/([0-9]{4})\.\?\?\.\?\?/)) {
			return RegExp.$1;
		}

		// Badly-formatted input -> return it "as-is"
		else {
			return date;
		}
	}


	/**
	 * Convert a PGN site field value into a human-readable site string.
	 * Return null if the special code "?" is detected.
	 *
	 * @param {string} site Value of a PGN site field.
	 * @returns {string}
	 */
	function formatSite(site)
	{
		return (site===null || site==='?') ? null : site;
	}


	/**
	 * Convert a PGN round field value into a human-readable round string.
	 * Return null if the special code "?" is detected.
	 *
	 * @param {string} round Value of a PGN round field.
	 * @returns {string}
	 */
	function formatRound(round)
	{
		return (round===null || round==='?') ? null : round;
	}


	/**
	 * Convert a PGN title field value into a human-readable title string.
	 * Return null if the special code "-" is detected.
	 *
	 * @param {string} title Value of a PGN title field.
	 * @returns {string}
	 */
	function formatTitle(title)
	{
		return (title===null || title==='-') ? null : title;
	}


	/**
	 * Convert a PGN rating field value into a human-readable rating string.
	 * Return null if the special code "?" is detected.
	 *
	 * @param {string} rating Value of a PGN rating field.
	 * @returns {string}
	 */
	function formatRating(rating)
	{
		return (rating===null || rating==='?') ? null : rating;
	}


	/**
	 * Convert a PGN result field value into a human-readable string.
	 * Return null if the special code "*" is detected.
	 *
	 * @param {string} result Value of a PGN result field.
	 * @returns {string}
	 */
	function formatResult(result)
	{
		switch(result) {
			case null: case '*': return null;
			case '1/2-1/2':      return '&#189;&#8211;&#189;';
			case '1-0':          return '1&#8211;0';
			case '0-1':          return '0&#8211;1';
			default:             return result;
		}
	}


	/**
	 * Convert a SAN move notation into a localized move notation
	 * (the characters used to specify the pieces is the only localized element).
	 *
	 * SAN notation is the format use for moves in PGN text files.
	 *
	 * @param {string} notation SAN move notation to convert.
	 * @returns {string} Localized move string.
	 */
	function formatMoveNotation(notation)
	{
		if(notation===null) {
			return null;
		}
		else {
			var retVal = '';
			for(var k=0; k<notation.length; ++k) {
				var c = notation.charAt(k);
				if(c==='K' || c==='Q' || c==='R' || c==='B' || c==='N' || c==='P') {
					retVal += $.chessgame.PIECE_SYMBOLS[c];
				}
				else {
					retVal += c;
				}
			}
			return retVal;
		}
	}


	/**
	 * The human-readable symbols corresponding to most common NAGs.
	 *
	 * @constant
	 */
	var SPECIAL_NAGS_LOOKUP = {
		 3: "!!",      // very good move
		 1: "!",       // good move
		 5: "!?",      // interesting move
		 6: "?!",      // questionable move
		 2: "?",       // bad move
		 4: "??",      // very bad move
		18: "+\u2212", // White has a decisive advantage
		16: "\u00b1",  // White has a moderate advantage
		14: "\u2a72",  // White has a slight advantage
		10: "=",       // equal position
		13: "\u221e",  // unclear position
		15: "\u2a71",  // Black has a slight advantage
		17: "\u2213",  // Black has a moderate advantage
		19: "\u2212+"  // Black has a decisive advantage
	};


	/**
	 * Return the annotation symbol (e.g. "+-", "!?") associated to a numeric NAG code.
	 *
	 * @param {number} nag Numeric NAG code.
	 * @returns {string} Human-readable NAG symbol.
	 */
	function formatNag(nag)
	{
		if(nag===null) return null;
		else if(nag in SPECIAL_NAGS_LOOKUP) return SPECIAL_NAGS_LOOKUP[nag];
		else return '$' + nag;
	}


	/**
	 * Ellipsis function.
	 *
	 * Example: if `text` is `0123456789`, then `ellipsis(text, 5, 2, 1)` returns
	 * the following string:
	 *
	 * ```
	 * ...4567...
	 *     ^
	 * ```
	 *
	 * @param {string} text Text from a substring must be extracted.
	 * @param {number} pos Index of the character in `text` around which the substring must be extracted.
	 * @param {number} backwardCharacters Number of characters to keep before `pos`.
	 * @param {number} forwardCharacters Number of characters to keep after `pos`.
	 * @return string
	 */
	function ellipsisAt(text, pos, backwardCharacters, forwardCharacters)
	{
		// p1 => begin of the extracted sub-string
		var p1 = pos - backwardCharacters;
		var e1 = '...';
		if(p1<=0) {
			p1 = 0;
			e1 = '';
		}

		// p2 => one character after the end of the extracted sub-string
		var p2 = pos + 1 + forwardCharacters;
		var e2 = '...';
		if(p2 >= text.length) {
			p2 = text.length;
			e2 = '';
		}

		// Extract the sub-string around the requested position.
		var retVal = e1 + text.substr(p1, p2-p1) + e2;
		retVal = retVal.replace(/\n|\t/g, ' ');
		return retVal + '\n' + Array(1 + e1.length + pos - p1).join(' ') + '^';
	}


	/**
	 * Register a 'chessgame' widget in the jQuery widget framework.
	 */
	$.widget('uichess.chessgame',
	{
		/**
		 * Default options.
		 */
		options:
		{
			/**
			 * String describing the game (PGN format).
			 */
			pgn: '*'
		},


		/**
		 * Hold the parsed information about the displayed chess game.
		 * @type {Pgn.Item}
		 */
		_game: null,


		/**
		 * Constructor.
		 */
		_create: function()
		{
			this.element.addClass('uichess-chessgame');
			this.options.pgn = this._initializePGN(this.options.pgn);
			this._refresh();
		},


		/**
		 * Destructor.
		 */
		_destroy: function()
		{
			this.element.empty().removeClass('uichess-chessgame');
		},


		/**
		 * Initialize the internal Pgn.Item object that contains the parsed PGN data.
		 *
		 * @returns {string}
		 */
		_initializePGN: function(pgn)
		{
			// Ensure that the input is actually a string.
			if(typeof pgn !== 'string') {
				pgn = '*';
			}

			// Trim the input.
			pgn = pgn.replace(/^\s+|\s+$/g, '');

			// Parse the input assuming a PGN format.
			try {
				this._game = Pgn.parseOne(pgn);
			}
			catch(error) {
				if(error instanceof Pgn.ParsingException) { // parsing errors are reported to the user
					this._game = error;
				}
				else { // unknown exceptions are re-thrown
					this._game = null;
					throw error;
				}
			}

			// Return the validated PGN string.
			return pgn;
		},


		/**
		 * Refresh the widget.
		 */
		_refresh: function()
		{
			this.element.empty();
			if(this._game === null) {
				return;
			}

			// Handle parsing error problems.
			if(this._game instanceof Pgn.ParsingException) {
				this._printErrorMessage();
				return;
			}

			// Headers
			var headers = '<div class="uichess-chessgame-headers">';
			headers += this._playerNameHeader('White');
			headers += this._playerNameHeader('Black');
			headers += this._eventHeader();
			headers += this._datePlaceHeader();
			headers += this._annotatorHeader();
			headers += '</div>';


			$('<div>' + headers + '</div>').appendTo(this.element);
		},


		/**
		 * Build the error message resulting from a PGN parsing error.
		 */
		_printErrorMessage: function()
		{
			// Build the error report box.
			var content = '<div class="uichess-chessgame-error">' +
				'<div class="uichess-chessgame-errorTitle">Error while analysing a PGN string.</div>';

			// Optional message.
			if(this._game.message !== null) {
				content += '<div class="uichess-chessgame-errorMessage">' + this._game.message + '</div>';
			}

			// Display where the error has occurred.
			if(this._game.pos !== null && this._game.pos >= 0) {
				content += '<div class="uichess-chessgame-errorAt">';
				if(this._game.pos >= this._game.pgnString.length) {
					content += 'Occurred at the end of the string.';
				}
				else {
					content += 'Occurred at position ' + this._game.pos + ':' + '<div class="uichess-chessgame-errorAtCode">' +
						ellipsisAt(this._game.pgnString, this._game.pos, 10, 40) + '</div>';
				}
				content += '</div>';
			}

			// Close the error report box, and update the DOM element.
			content += '</div>';
			$(content).appendTo(this.element);
		},


		/**
		 * Build the header containing the player-related information (name, rating, title)
		 * corresponding to the requested color.
		 *
		 * @param {string} color Either 'White' or 'Black'.
		 * @return {string}
		 */
		_playerNameHeader: function(color)
		{
			// Retrieve the name of the player -> no header is returned if the name not available.
			var name = this._game.header(color);
			if(name===null) {
				return '';
			}

			// Build the returned header.
			var header = '<div class="uichess-chessgame-' + color.toLowerCase() + 'Player">' +
				'<span class="uichess-chessgame-colorTag"></span> ' +
				'<span class="uichess-chessgame-playerName">' + name + '</span>';

			// Title + rating
			var title  = formatTitle (this._game.header(color + 'Title'));
			var rating = formatRating(this._game.header(color + 'Elo'  ));
			if(title !== null || rating !== null) {
				header += '<span class="uichess-chessgame-titleRatingGroup">';
				if(title  !== null) header += '<span class="uichess-chessgame-playerTitle">'  + title  + '</span>';
				if(rating !== null) header += '<span class="uichess-chessgame-playerRating">' + rating + '</span>';
				header += '</span>'
			}

			// Add the closing tag and return the result.
			header += '</div>';
			return header;
		},


		/**
		 * Build the header containing the event-related information (event + round).
		 *
		 * @return {string}
		 */
		_eventHeader: function()
		{
			// Retrieve the event -> no header is returned if the name not available.
			var event = this._game.header('Event');
			if(event===null) {
				return '';
			}

			// Retrieve the round.
			var round = formatRound(this._game.header('Round'));

			// Build and return the header.
			var header = '<div class="uichess-chessgame-event">' + event;
			if(round !== null) {
				header += '<span class="uichess-chessgame-round">' + round + '</span>';
			}
			header += '</div>';
			return header;
		},


		/**
		 * Build the header containing the date/place information.
		 *
		 * @return {string}
		 */
		_datePlaceHeader: function()
		{
			// Retrieve the date and the site field.
			var date = formatDate(this._game.header('Date'));
			var site = formatSite(this._game.header('Site'));
			if(date===null && site===null) {
				return '';
			}

			// Build and return the header.
			var header = '<div class="uichess-chessgame-datePlaceGroup">';
			if(date !== null) header += '<span class="uichess-chessgame-date">' + date + '</span>';
			if(site !== null) header += '<span class="uichess-chessgame-site">' + site + '</span>';
			header += '</div>';
			return header;
		},


		/**
		 * Build the header containing the annotator information.
		 *
		 * @return {string}
		 */
		_annotatorHeader: function()
		{
			// Retrieve the annotator field.
			var annotator = this._game.header('Annotator');
			if(annotator===null) {
				return '';
			}

			// Build and return the header.
			var header = '<div class="uichess-chessgame-annotator">' + $.chessgame.ANNOTATED_BY.replace(/%1\$s/g,
				'<span class="uichess-chessgame-annotatorName">' + annotator + '</span>') + '</div>';
			return header;
		}


	});


	/**
	 * Create a new DOM node to render the text comment associated to the given PGN node.
	 * This function may return null if no comment is associated to the PGN node.
	 *
	 * @private
	 *
	 * @param {(Pgn.Node|Pgn.Variation)} pgnNode Node or variation object containing the comment to render.
	 * @param {object} options Default set of options for displaying inline diagrams.
	 * @returns {jQuery}
	 *
	 * @memberof PgnWidget
	 */
	function renderComment(pgnNode, options)
	{
		// Nothing to do if no comment is defined on the current PGN node.
		if(pgnNode.comment=='') {
			return null;
		}

		// Create the returned object, and parse the comment string
		var retVal = $(pgnNode.isLongComment ?
			'<div class="PgnWidget-longComment">' + pgnNode.comment + '</div>' :
			'<span class="PgnWidget-comment">' + pgnNode.comment + '</span>'
		);

		// Render diagrams where requested
		$('.PgnWidget-anchor-diagram', retVal).each(function(index, e)
		{
			// Try to parse the content of the node as a JSON string.
			var currentOptions = $.extend({ position: pgnNode.position() }, options);
			try {
				$.extend(currentOptions, $.parseJSON('{' + $(e).text() + '}'));
			}
			catch(err) {}

			// Render the diagram
			$(e).chessboard(currentOptions);
		});

		// Return the result
		return retVal;
	}


	/**
	 * Create a new DOM node to render a variation taken from a PGN tree. This function
	 * is recursive, and never returns null.
	 *
	 * @private
	 *
	 * @param {Pgn.Variation} pgnVariation PGN variation object to render.
	 * @param {number} depth Depth of the PGN node within its belonging PGN tree (0 for the main variation, 1 for a direct sub-variation, etc...)
	 * @param {object} inlineOptions Default set of options for displaying inline diagrams.
	 * @param {object} navOptions Set of options to use for the navigation frame.
	 * @returns {jQuery}
	 *
	 * @memberof PgnWidget
	 */
	function renderVariation(pgnVariation, depth, inlineOptions, navOptions)
	{
		// Allocate the returned DOM node
		var retVal = $(pgnVariation.isLongVariation() ?
			'<div class="PgnWidget-longVariation"></div>' :
			'<span class="PgnWidget-shortVariation"></span>'
		);
		retVal.addClass('PgnWidget-variation-' + (depth==0 ? 'main' : 'sub'));

		// The variation may start with an initial comment.
		var initialComment = renderComment(pgnVariation, inlineOptions);
		if(initialComment!=null) {
			if(pgnVariation.isLongComment) { // Long comments do not belong to any move group.
				retVal.append(initialComment);
				initialComment = null;
			}
		}

		// State variables
		var moveGroup = $('<span class="PgnWidget-moveGroup"></span>').appendTo(retVal);
		var prevMove  = null;
		if(initialComment!=null) {
			moveGroup.append(initialComment);
		}

		// Append a fake move at the beginning of the main variation,
		// so that it will be possible to display the starting position
		// in the navigation frame.
		if(depth==0) {
			var move = $(
				'<span class="PgnWidget-move PgnWidget-invisible">' + text.initialPosition + '</span>'
			).appendTo(moveGroup);
			move.data('position'  , pgnVariation.position());
			move.data('navOptions', navOptions);
			move.click(function() { showNavigationFrame($(this)); });
			prevMove = move;
		}

		// Visit all the PGN nodes (one node per move) within the variation
		var forcePrintMoveNumber = true;
		var pgnNode              = pgnVariation.first();
		while(pgnNode!=null)
		{
			// Create the DOM node that will contains the basic move informations
			// (i.e. move number, notation, NAGs)
			var move = $('<span class="PgnWidget-move"></span>').appendTo(moveGroup);
			move.data('position'  , pgnNode.position());
			move.data('navOptions', navOptions);
			move.click(function() { showNavigationFrame($(this)); });

			// Link to the previous move, if any
			if(prevMove!=null) {
				prevMove.data('nextMove', move    );
				move    .data('prevMove', prevMove);
			}
			prevMove = move;

			// Write the move number
			var moveNumber = $(
				'<span class="PgnWidget-move-number">' +
					pgnNode.fullMoveNumber() + (pgnNode.moveColor()=='w' ? '.' : '\u2026') +
				'</span>'
			).appendTo(move);
			if(!(forcePrintMoveNumber || pgnNode.moveColor()=='w')) {
				moveNumber.addClass('PgnWidget-invisible');
			}

			// Write the notation
			move.append(formatMoveNotation(pgnNode.move()));

			// Write the NAGs (if any)
			for(var k=0; k<pgnNode.nags.length; ++k) {
				move.append(' ' + formatNag(pgnNode.nags[k]));
			}

			// Write the comment (if any)
			var comment = renderComment(pgnNode, inlineOptions);
			if(comment!=null) {
				if(pgnNode.isLongComment) { // Long comments do not belong to any move group.
					retVal.append(comment);
					moveGroup = $('<span class="PgnWidget-moveGroup"></span>').appendTo(retVal);
				}
				else {
					moveGroup.append(comment);
				}
			}

			// Sub-variations starting from the current point in PGN tree
			if(pgnNode.variations()>0) {
				var variationParent = pgnNode.areLongVariations ? retVal : moveGroup;
				for(var k=0; k<pgnNode.variations(); ++k) {
					variationParent.append(renderVariation(pgnNode.variation(k), depth+1, inlineOptions, navOptions));
				}
				if(pgnNode.areLongVariations) {
					moveGroup = $('<span class="PgnWidget-moveGroup"></span>').appendTo(retVal);
				}
			}

			// Back to the current variation
			forcePrintMoveNumber = (pgnNode.comment!='' || pgnNode.variations()>0);
			pgnNode = pgnNode.next();
		}

		// Return the result
		return retVal;
	}


	/**
	 * Substitution method for the special replacement token moves (which stands
	 * for the move tree associated to a PGN item). Example:
	 *
	 * Before substitution:
	 * <div class="PgnWidget-field-moves">
	 *   <span class="PgnWidget-anchor-moves"></span>
	 * </div>
	 *
	 * After substitution:
	 * <div class="PgnWidget-field-moves">
	 *   <span class="PgnWidget-value-moves">1.e4 e5</span>
	 * </div>
	 *
	 * @private
	 *
	 * @param {jQuery} parentNode
	 *
	 * Each child of this node having a class attribute set to "PgnWidget-field-moves"
	 * will be targeted by the substitution.
	 *
	 * @param {Pgn.Item} pgnItem Contain the information to display.
	 * @param {object} inlineOptions Default set of options for displaying inline diagrams.
	 * @param {object} navOptions Set of options to use for the navigation frame.
	 *
	 * @memberof PgnWidget
	 */
	function substituteMoves(parentNode, pgnItem, inlineOptions, navOptions)
	{
		// Fields to target
		var fields = $('.PgnWidget-field-moves', parentNode);

		// Hide the field if no move tree is available
		if(pgnItem.mainVariation().first()==null && pgnItem.mainVariation().comment=='') {
			fields.addClass('PgnWidget-invisible');
		}

		// Process each anchor node
		var anchors = $('.PgnWidget-anchor-moves', fields);
		anchors.append(renderVariation(pgnItem.mainVariation(), 0, inlineOptions, navOptions));
		anchors.addClass   ('PgnWidget-value-moves' );
		anchors.removeClass('PgnWidget-anchor-moves');
	}


	/**
	 * Fill a DOM node with the information contained in a PGN item object.
	 *
	 * @param {(Pgn.Item|string)} pgn PGN data to represent.
	 *
	 * If the argument is a string, the function will try to parse it as a
	 * PGN-formatted string. If the parsing fails, or if the string contains no PGN item,
	 * the targeted DOM node is cleared, and an error message is displayed instead.
	 *
	 * @param {jQuery} targetNode
	 * @param {object} [inlineOptions=null] Default set of options for displaying inline diagrams.
	 * @param {object} [navOptions=null] Set of options to use for the navigation frame.
	 * @returns {boolean} False if the parsing of the PGN string fails, true otherwise.
	 *
	 * @memberof PgnWidget
	 */
	function makeAt(pgn, targetNode, inlineOptions, navOptions)
	{
		// Default options
		if(inlineOptions==null) {
			inlineOptions = null;
		}
		if(navOptions==null) {
			navOptions = null;
		}

		// PGN parsing
		if(typeof(pgn)=='string') {
			try {
				var items = Pgn.parse(pgn);
				if(items.length==0) {
					throw new Pgn.ParsingException(pgn, null, 'Unexpected empty PGN data.');
				}
				pgn = items[0];
			}

			// Catch the parsing errors
			catch(error) {
				if(error instanceof Pgn.ParsingException) {
					displayErrorMessage(error, targetNode);
					return false;
				}
				else { // unknown exception are re-thrown
					throw error;
				}
			}
		}

		// Create the navigation frame if necessary
		makeNavigationFrame(targetNode, navOptions);

		// Substitution
		substituteSimpleField(targetNode, 'Event'    , pgn);
		substituteSimpleField(targetNode, 'Site'     , pgn);
		substituteSimpleField(targetNode, 'Date'     , pgn, formatDate );
		substituteSimpleField(targetNode, 'Round'    , pgn, formatRound);
		substituteSimpleField(targetNode, 'White'    , pgn);
		substituteSimpleField(targetNode, 'Black'    , pgn);
		substituteSimpleField(targetNode, 'Result'   , pgn, formatResult);
		substituteSimpleField(targetNode, 'Annotator', pgn);
		substituteFullName(targetNode, 'w', pgn);
		substituteFullName(targetNode, 'b', pgn);
		substituteMoves(targetNode, pgn, inlineOptions, navOptions);

		// Indicate that the parsing succeeded.
		return true;
	}


	/**
	 * Create the navigation frame, if it does not exist yet. The frame is
	 * appended as a child of the given DOM node.
	 *
	 * @private
	 *
	 * @param {jQuery} parentNode
	 * @param {object} navOptions Set of options to use for the navigation frame.
	 *
	 * @memberof PgnWidget
	 */
	function makeNavigationFrame(parentNode, navOptions)
	{
		if($('#PgnWidget-navigation-frame').length!=0) {
			return;
		}

		// Structure of the navigation frame
		$(
			'<div id="PgnWidget-navigation-frame" class="PgnWidget-invisible">' +
				'<div id="PgnWidget-navigation-content"></div>' +
				'<div id="PgnWidget-navigation-buttons">' +
					'<button id="PgnWidget-navigation-button-frst">&lt;&lt;</button>' +
					'<button id="PgnWidget-navigation-button-prev">&lt;</button>' +
					'<button id="PgnWidget-navigation-button-next">&gt;</button>' +
					'<button id="PgnWidget-navigation-button-last">&gt;&gt;</button>' +
				'</div>' +
			'</div>'
		).appendTo(parentNode);

		// Widgetization
		$(document).ready(function()
		{
			// Remove the temporary "invisible" flag.
			$('#PgnWidget-navigation-frame').removeClass('PgnWidget-invisible');

			// Create the dialog structure
			$('#PgnWidget-navigation-frame').dialog({
				/* Hack to keep the dialog draggable after the page has being scrolled. */
				create     : function(event, ui) { $(event.target).parent().css('position', 'fixed'); },
				resizeStart: function(event, ui) { $(event.target).parent().css('position', 'fixed'); },
				resizeStop : function(event, ui) { $(event.target).parent().css('position', 'fixed'); },
				/* End of hack */
				autoOpen   : false,
				dialogClass: 'wp-dialog',
				width      : 'auto',
				close      : function(event, ui) { unselectMove(); }
			});

			// Create the chessboard widget
			$('#PgnWidget-navigation-content').chessboard(navOptions);
			$('#PgnWidget-navigation-content').chessboard('sizeControlledByContainer', $('#PgnWidget-navigation-frame'), 'dialogresize');

			// Create the buttons
			$('#PgnWidget-navigation-button-frst').button().click(function() { goFrstMove(); });
			$('#PgnWidget-navigation-button-prev').button().click(function() { goPrevMove(); });
			$('#PgnWidget-navigation-button-next').button().click(function() { goNextMove(); });
			$('#PgnWidget-navigation-button-last').button().click(function() { goLastMove(); });
		});
	}


	/**
	 * Show the navigation frame if not visible yet, and update the diagram in this
	 * frame with the position corresponding to the move that is referred by the
	 * given DOM node. By the way, this node must have class 'PgnWidget-move',
	 * otherwise nothing happens.
	 *
	 * @private
	 *
	 * @param {jQuery} domNode
	 *
	 * @memberof PgnWidget
	 */
	function showNavigationFrame(domNode)
	{
		// Nothing to do if no node is provided or if the move is already selected.
		if(domNode==null || domNode.attr('id')=='PgnWidget-selected-move') {
			return;
		}

		// Mark the current move as selected
		selectMove(domNode);

		// Fill the miniboard in the navigation frame
		refreshNavigationFrameWidget(domNode);

		// Make the navigation frame visible
		var navFrame = $('#PgnWidget-navigation-frame');
		navFrame.dialog('option', 'title', domNode.text());
		if(!navFrame.dialog('isOpen')) {
			navFrame.dialog('option', 'position', { my: 'center', at: 'center', of: window });
		}
		navFrame.dialog('open');
	}


	/**
	 * Refresh the chessboard widget in the navigation frame.
	 *
	 * @param {jQuery} selectedMove
	 *
	 * @private
	 * @memberof PgnWidget
	 */
	function refreshNavigationFrameWidget(selectedMove)
	{
		var target = $('#PgnWidget-navigation-content');
		target.chessboard('option', 'position', selectedMove.data('position'));
		var flip = selectedMove.data('navOptions').flip;
		if(flip!=null && flip!=target.chessboard('option', 'flip')) {
			target.chessboard('option', 'flip', flip);
		}
	}


	/**
	 * Return a contrasted color.
	 *
	 * @private
	 *
	 * @param {String} colorString Color specification as mentioned in a CSS property.
	 * @returns {string}
	 *
	 * @memberof PgnWidget
	 */
	function contrastedColor(colorString)
	{
		// Parsing
		var color = $.Color(colorString); // Require the jQuery-color plugin

		// Two cases based on the value of the lightness component
		if(color.lightness()>0.5) {
			return 'black';
		}
		else {
			return 'white';
		}
	}


	/**
	 * Make the given move appear as selected.
	 *
	 * @private
	 *
	 * @param {jQuery} domNode Node to select (it is supposed to be have class 'PgnWidget-move').
	 *
	 * @memberof PgnWidget
	 */
	function selectMove(domNode)
	{
		unselectMove();
		domNode.attr('id', 'PgnWidget-selected-move');
		var color = domNode.css('color');
		domNode.css('background-color', color);
		domNode.css('color', contrastedColor(color));
	}


	/**
	 * Unselect the selected move, if any.
	 *
	 * @private
	 * @memberof PgnWidget
	 */
	function unselectMove()
	{
		var selectedMove = $('#PgnWidget-selected-move');
		selectedMove.attr('id'   , null);
		selectedMove.attr('style', null);
	}


	/**
	 * Go to the first move of the current variation.
	 *
	 * @private
	 * @memberof PgnWidget
	 */
	function goFrstMove()
	{
		var target = $('#PgnWidget-selected-move');
		while(target.data('prevMove')!=null) {
			target = target.data('prevMove');
		}
		showNavigationFrame(target);
	}


	/**
	 * Go to the previous move of the current variation.
	 *
	 * @private
	 * @memberof PgnWidget
	 */
	function goPrevMove()
	{
		showNavigationFrame($('#PgnWidget-selected-move').data('prevMove'));
	}


	/**
	 * Go to the next move of the current variation.
	 *
	 * @private
	 * @memberof PgnWidget
	 */
	function goNextMove()
	{
		showNavigationFrame($('#PgnWidget-selected-move').data('nextMove'));
	}


	/**
	 * Go to the last move of the current variation.
	 *
	 * @private
	 * @memberof PgnWidget
	 */
	function goLastMove()
	{
		var target = $('#PgnWidget-selected-move');
		while(target.data('nextMove')!=null) {
			target = target.data('nextMove');
		}
		showNavigationFrame(target);
	}


	// Return the module object
	return {
		text  : text  ,
		makeAt: makeAt
	};

})(Chess, Pgn, jQuery);
