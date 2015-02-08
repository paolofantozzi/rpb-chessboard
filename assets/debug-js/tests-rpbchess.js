/******************************************************************************
 *                                                                            *
 *    This file is part of RPB Chessboard, a WordPress plugin.                *
 *    Copyright (C) 2013-2015  Yoann Le Montagner <yo35 -at- melix.net>       *
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


/* jshint unused:false */
/* jshint globalstrict:true */
'use strict';

/* global RPBChess */
/* global checkIllegalArgument */
/* global checkInvalidFEN */
/* global wrapCP */
/* global wrapMove */
/* global legalInfo */
/* global ccsInfo */
/* global test */
/* global testError */
/* global registerTest */
/* global registerTests */



// -----------------------------------------------------------------------------
// Basic tests
// -----------------------------------------------------------------------------

// Constructor
registerTest('rpbchess.basic.constructor', function() {

	var startFEN   = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	var emptyFEN   = '8/8/8/8/8/8/8/8 w - - 0 1';
	var customFEN1 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b Kk e3 10 5';
	var customFEN2 = 'k7/n1PB4/1K6/8/8/8/8/8 w - - 0 60';

	var optsFEN1 = { fiftyMoveClock: 10, fullMoveNumber: 5 };
	var optsFEN2 = { fullMoveNumber: 60 };

	test('Default constructor'    , function() { return (new RPBChess.Position()).fen(); }, startFEN);
	test('Constructor \'start\''  , function() { return (new RPBChess.Position('start')).fen(); }, startFEN);
	test('Constructor \'empty\''  , function() { return (new RPBChess.Position('empty')).fen(); }, emptyFEN);
	test('Constructor FEN-based 1', function() { return (new RPBChess.Position(customFEN1)).fen(optsFEN1); }, customFEN1);
	test('Constructor FEN-based 2', function() { return (new RPBChess.Position(customFEN2)).fen(optsFEN2); }, customFEN2);

	test('Copy constructor', function() {
		var p1 = new RPBChess.Position(customFEN1);
		var p2 = new RPBChess.Position(p1);
		p1.clear();
		return p1.fen() + '|' + p2.fen(optsFEN1);
	}, emptyFEN + '|' + customFEN1);
});


// Strict FEN parsing
registerTest('rpbchess.basic.strictfen', function() {

	var customFEN1 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b Kk e3 10 5';
	var customFEN2 = 'k7/n1PB4/1K6/8/8/8/8/8 w - - 0 60';

	var optsFEN1 = { fiftyMoveClock: 10, fullMoveNumber: 5 };
	var optsFEN2 = { fullMoveNumber: 60 };

	var customFEN3  = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b Kq e3 0 1';
	var customFEN3a = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b qK e3 0 1';
	var customFEN3b = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b Kq e6 0 1';
	var customFEN3c = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b Kq e3 00 1';

	test('Set FEN (tolerant) A', function() { var p=new RPBChess.Position(); p.fen(customFEN3a); return p.fen(); }, customFEN3);
	test('Set FEN (tolerant) B', function() { var p=new RPBChess.Position(); p.fen(customFEN3b); return p.fen(); }, customFEN3);
	test('Set FEN (tolerant) C', function() { var p=new RPBChess.Position(); p.fen(customFEN3c); return p.fen(); }, customFEN3);
	test('Set FEN (strict) OK 1', function() { var p=new RPBChess.Position(); p.fen(customFEN1, true); return p.fen(optsFEN1); }, customFEN1);
	test('Set FEN (strict) OK 2', function() { var p=new RPBChess.Position(); p.fen(customFEN2, true); return p.fen(optsFEN2); }, customFEN2);
	test('Set FEN (strict) OK 3', function() { var p=new RPBChess.Position(); p.fen(customFEN3, true); return p.fen(); }, customFEN3);
	testError('Set FEN (strict) NOK A', function() { var p=new RPBChess.Position(); p.fen(customFEN3a, true); }, checkInvalidFEN('INVALID_CASTLE_RIGHTS_FIELD'));
	testError('Set FEN (strict) NOK B', function() { var p=new RPBChess.Position(); p.fen(customFEN3b, true); }, checkInvalidFEN('WRONG_ROW_IN_EN_PASSANT_FIELD'));
	testError('Set FEN (strict) NOK C', function() { var p=new RPBChess.Position(); p.fen(customFEN3c, true); }, checkInvalidFEN('INVALID_MOVE_COUNTING_FIELD', '5th'));
});


// Getters
registerTest('rpbchess.basic.getters', function() {

	var customFEN = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b Kk e3 0 1';

	test('Getter board 1', function() { var p=new RPBChess.Position(); return wrapCP(p.square('e1')); }, 'w:k');
	test('Getter board 2', function() { var p=new RPBChess.Position(); return wrapCP(p.square('b4')); }, '-');
	test('Getter turn 1', function() { var p=new RPBChess.Position(); return p.turn(); }, 'w');
	test('Getter turn 2', function() { var p=new RPBChess.Position(customFEN); return p.turn(); }, 'b');
	test('Getter castling 1', function() { var p=new RPBChess.Position(); return p.castleRights('w', 'q'); }, true);
	test('Getter castling 2', function() { var p=new RPBChess.Position(customFEN); return p.castleRights('b', 'q'); }, false);
	test('Getter castling 3', function() { var p=new RPBChess.Position(customFEN); return p.castleRights('b', 'k'); }, true);
	test('Getter en-passant 1', function() { var p=new RPBChess.Position(); return p.enPassant(); }, '-');
	test('Getter en-passant 2', function() { var p=new RPBChess.Position(customFEN); return p.enPassant(); }, 'e');
	testError('Getter board NOK'   , function() { var p=new RPBChess.Position(); return wrapCP(p.square('j1')); }, checkIllegalArgument('Position#square()'));
	testError('Getter castling NOK', function() { var p=new RPBChess.Position(); return p.castleRights('b', 'K'); }, checkIllegalArgument('Position#castleRights()'));
});


// Setters
registerTest('rpbchess.basic.setters', function() {

	var pos1 = new RPBChess.Position('start');
	var pos2 = new RPBChess.Position('empty');

	// Setters
	test('Setter board 1a', function() { pos1.square('a8', '-'); return pos1.fen(); }, '1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	test('Setter board 1b', function() { pos1.square('f6', {color:'w', piece:'b'}); return pos1.fen(); }, '1nbqkbnr/pppppppp/5B2/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	test('Setter board 2a', function() { pos2.square('c3', {color:'b', piece:'k'}); return pos2.fen(); }, '8/8/8/8/8/2k5/8/8 w - - 0 1');
	test('Setter board 2b', function() { pos2.square('g5', {color:'w', piece:'k'}); return pos2.fen(); }, '8/8/8/6K1/8/2k5/8/8 w - - 0 1');
	test('Setter board 2c', function() { pos2.square('c3', '-'); return pos2.fen(); }, '8/8/8/6K1/8/8/8/8 w - - 0 1');
	test('Setter turn 1', function() { pos1.turn('w'); return pos1.fen(); }, '1nbqkbnr/pppppppp/5B2/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	test('Setter turn 2', function() { pos2.turn('b'); return pos2.fen(); }, '8/8/8/6K1/8/8/8/8 b - - 0 1');
	test('Setter castling 1a', function() { pos1.castleRights('w', 'k', false); return pos1.fen(); }, '1nbqkbnr/pppppppp/5B2/8/8/8/PPPPPPPP/RNBQKBNR w Qkq - 0 1');
	test('Setter castling 1b', function() { pos1.castleRights('b', 'k', true); return pos1.fen(); }, '1nbqkbnr/pppppppp/5B2/8/8/8/PPPPPPPP/RNBQKBNR w Qkq - 0 1');
	test('Setter castling 2a', function() { pos2.castleRights('w', 'q', false); return pos2.fen(); }, '8/8/8/6K1/8/8/8/8 b - - 0 1');
	test('Setter castling 2b', function() { pos2.castleRights('b', 'q', true); return pos2.fen(); }, '8/8/8/6K1/8/8/8/8 b q - 0 1');
	test('Setter en-passant 1a', function() { pos1.enPassant('e'); return pos1.fen(); }, '1nbqkbnr/pppppppp/5B2/8/8/8/PPPPPPPP/RNBQKBNR w Qkq e6 0 1');
	test('Setter en-passant 1b', function() { pos1.enPassant('-'); return pos1.fen(); }, '1nbqkbnr/pppppppp/5B2/8/8/8/PPPPPPPP/RNBQKBNR w Qkq - 0 1');
	test('Setter en-passant 2a', function() { pos2.enPassant('a'); return pos2.fen(); }, '8/8/8/6K1/8/8/8/8 b q a3 0 1');
	test('Setter en-passant 2b', function() { pos2.enPassant('h'); return pos2.fen(); }, '8/8/8/6K1/8/8/8/8 b q h3 0 1');
});



// -----------------------------------------------------------------------------
// Square color
// -----------------------------------------------------------------------------

registerTest('rpbchess.squarecolor', function() {
	var /* const */ ROW    = '12345678';
	var /* const */ COLUMN = 'abcdefgh';

	function fun(asExpected) {
		var res = '';
		for(var r=0; r<8; ++r) {
			for(var c=0; c<8; ++c) {
				if(res !== '') { res += '/'; }
				res += asExpected ? (c%2 === r%2 ? 'b' : 'w') : RPBChess.squareColor(COLUMN[c] + ROW[r]);
			}
		}
		return res;
	}

	test('Square color', function() { return fun(false); }, fun(true));
	testError('Square color NOK 1', function() { return RPBChess.squareColor('e9'); }, checkIllegalArgument('squareColor()'));
	testError('Square color NOK 2', function() { return RPBChess.squareColor('i5'); }, checkIllegalArgument('squareColor()'));
});



// -----------------------------------------------------------------------------
// Attacks
// -----------------------------------------------------------------------------

registerTest('rpbchess.attacks', function() {
	var /* const */ ROW    = '12345678';
	var /* const */ COLUMN = 'abcdefgh';

	// Return the list of attacked squares in the given position
	function attacked(position, byWho, byWhat) {
		var res = '';
		for(var r=0; r<8; ++r) {
			for(var c=0; c<8; ++c) {
				var square = COLUMN[c] + ROW[r];
				if(position.isAttacked(square, byWho, byWhat)) {
					if(res !== '') { res += '/'; }
					res += square;
				}
			}
		}
		return res;
	}

	test('King attacks 1', function() { var p=new RPBChess.Position('8/8/8/4K3/8/8/8/8 w - - 0 1'); return attacked(p, 'w'); }, 'd4/e4/f4/d5/f5/d6/e6/f6');
	test('King attacks 2', function() { var p=new RPBChess.Position('8/8/8/8/8/8/PPP5/K1P5 w - - 0 1'); return attacked(p, 'w', 'k'); }, 'b1/a2/b2');
	test('Queen attacks 1', function() { var p=new RPBChess.Position('8/8/8/4q3/8/8/8/8 w - - 0 1'); return attacked(p, 'b'); }, 'a1/e1/b2/e2/h2/c3/e3/g3/d4/e4/f4/a5/b5/c5/d5/f5/g5/h5/d6/e6/f6/c7/e7/g7/b8/e8/h8');
	test('Queen attacks 2', function() { var p=new RPBChess.Position('8/8/8/8/8/pppp4/3p4/q2p4 w - - 0 1'); return attacked(p, 'b', 'q'); }, 'b1/c1/d1/a2/b2/a3/c3');
	test('Rook attacks 1', function() { var p=new RPBChess.Position('8/8/8/4R3/8/8/8/8 w - - 0 1'); return attacked(p, 'w'); }, 'e1/e2/e3/e4/a5/b5/c5/d5/f5/g5/h5/e6/e7/e8');
	test('Rook attacks 2', function() { var p=new RPBChess.Position('8/8/8/8/8/PPPP4/3P4/R2P4 w - - 0 1'); return attacked(p, 'w', 'r'); }, 'b1/c1/d1/a2/a3');
	test('Bishop attacks 1', function() { var p=new RPBChess.Position('8/8/8/4b3/8/8/8/8 w - - 0 1'); return attacked(p, 'b'); }, 'a1/b2/h2/c3/g3/d4/f4/d6/f6/c7/g7/b8/h8');
	test('Bishop attacks 2', function() { var p=new RPBChess.Position('8/8/8/8/8/pppp4/3p4/b2p4 w - - 0 1'); return attacked(p, 'b', 'b'); }, 'b2/c3');
	test('Knight attacks 1', function() { var p=new RPBChess.Position('8/8/8/4N3/8/8/8/8 w - - 0 1'); return attacked(p, 'w'); }, 'd3/f3/c4/g4/c6/g6/d7/f7');
	test('Knight attacks 2', function() { var p=new RPBChess.Position('8/8/8/8/8/8/PPP5/NP6 w - - 0 1'); return attacked(p, 'w', 'n'); }, 'c2/b3');
	test('White pawn attacks', function() { var p=new RPBChess.Position('8/8/8/4P3/8/8/8/8 w - - 0 1'); return attacked(p, 'w'); }, 'd6/f6');
	test('Black pawn attacks', function() { var p=new RPBChess.Position('8/8/8/4p3/8/8/8/8 w - - 0 1'); return attacked(p, 'b'); }, 'd4/f4');
});



// -----------------------------------------------------------------------------
// Position legality
// -----------------------------------------------------------------------------

registerTest('rpbchess.islegal', function() {

	function fun(label, fen, expected) {
		test(label, function() { var p=new RPBChess.Position(fen); return legalInfo(p); }, expected);
	}

	fun('Legality starting position'       , 'start'                                         , 'true:e1:e8' );
	fun('Legality kings OK'                , 'k7/8/8/8/8/8/8/7K w - - 0 1'                   , 'true:h1:a8' );
	fun('Legality missing WK'              , '7k/8/8/8/8/8/8/8 w - - 0 1'                    , 'false:-:h8' );
	fun('Legality missing BK'              , '8/8/8/8/8/8/8/K7 w - - 0 1'                    , 'false:a1:-' );
	fun('Legality too many WK'             , '4k3/8/8/8/8/8/8/K6K w - - 0 1'                 , 'false:-:e8' );
	fun('Legality too many BK'             , 'k6k/8/8/8/8/8/8/4K3 w - - 0 1'                 , 'false:e1:-' );
	fun('Legality white is check 1'        , '4k3/8/8/8/8/2b5/8/4K3 w - - 0 1'               , 'true:e1:e8' );
	fun('Legality white is check 2'        , '4k3/8/8/8/8/2b5/8/4K3 b - - 0 1'               , 'false:e1:e8');
	fun('Legality black is check 1'        , '4k3/8/5N2/8/8/8/8/4K3 w - - 0 1'               , 'false:e1:e8');
	fun('Legality black is check 2'        , '4k3/8/5N2/8/8/8/8/4K3 b - - 0 1'               , 'true:e1:e8' );
	fun('Legality pawn on first/last row 1', '6p1/8/2k5/8/8/5K2/8/8 w - - 0 1'               , 'false:f3:c6');
	fun('Legality pawn on first/last row 2', '3P4/8/5k2/8/8/2K5/8/8 w - - 0 1'               , 'false:c3:f6');
	fun('Legality pawn on first/last row 3', '8/8/8/2k5/5K2/8/8/4p3 w - - 0 1'               , 'false:f4:c5');
	fun('Legality pawn on first/last row 4', '8/8/8/5k2/2K5/8/8/1P6 w - - 0 1'               , 'false:c4:f5');
	fun('Legality castling white 1'        , '8/4k3/8/8/8/8/8/R3K2R w KQ - 0 1'              , 'true:e1:e7' );
	fun('Legality castling white 2'        , '8/4k3/8/8/8/8/8/R3K3 w Q - 0 1'                , 'true:e1:e7' );
	fun('Legality castling white 3'        , '8/4k3/8/8/8/8/8/4K2R w K - 0 1'                , 'true:e1:e7' );
	fun('Legality castling white 4'        , '8/4k3/8/8/8/8/8/R3K3 w K - 0 1'                , 'false:e1:e7');
	fun('Legality castling white 5'        , '8/4k3/8/8/8/8/8/4K2R w Q - 0 1'                , 'false:e1:e7');
	fun('Legality castling white 6'        , '8/4k3/8/8/8/8/4K3/R7 w Q - 0 1'                , 'false:e2:e7');
	fun('Legality castling white 7'        , '8/4k3/8/8/8/8/4K3/7R w K - 0 1'                , 'false:e2:e7');
	fun('Legality castling black 1'        , 'r3k2r/8/8/8/8/8/4K3/8 w kq - 0 1'              , 'true:e2:e8' );
	fun('Legality castling black 2'        , 'r3k3/8/8/8/8/8/4K3/8 w q - 0 1'                , 'true:e2:e8' );
	fun('Legality castling black 3'        , '4k2r/8/8/8/8/8/4K3/8 w k - 0 1'                , 'true:e2:e8' );
	fun('Legality castling black 4'        , 'r3k3/8/8/8/8/8/4K3/8 w k - 0 1'                , 'false:e2:e8');
	fun('Legality castling black 5'        , '4k2r/8/8/8/8/8/4K3/8 w q - 0 1'                , 'false:e2:e8');
	fun('Legality castling black 6'        , 'r7/4k3/8/8/8/8/4K3/8 w q - 0 1'                , 'false:e2:e7');
	fun('Legality castling black 7'        , '7r/4k3/8/8/8/8/4K3/8 w k - 0 1'                , 'false:e2:e7');
	fun('Legality en-passant white 1'      , '4k3/pppppp1p/8/6p1/8/8/PPPPPPPP/4K3 w - g6 0 1', 'true:e1:e8' );
	fun('Legality en-passant white 2'      , '4k3/pppppp1p/8/6r1/8/8/PPPPPPPP/4K3 w - g6 0 1', 'false:e1:e8');
	fun('Legality en-passant white 3'      , '4k3/pppppp1p/6P1/6p1/8/8/8/4K3 w - g6 0 1'     , 'false:e1:e8');
	fun('Legality en-passant white 4'      , '4k3/ppppppPp/8/6p1/8/8/8/4K3 w - g6 0 1'       , 'false:e1:e8');
	fun('Legality en-passant black 1'      , '4k3/pppppppp/8/8/2P5/8/PP1PPPPP/4K3 b - c3 0 1', 'true:e1:e8' );
	fun('Legality en-passant black 2'      , '4k3/pppppppp/8/8/2B5/8/PP1PPPPP/4K3 b - c3 0 1', 'false:e1:e8');
	fun('Legality en-passant black 3'      , '4k3/8/8/8/2P5/2p5/8/4K3 b - c3 0 1'            , 'false:e1:e8');
	fun('Legality en-passant black 4'      , '4k3/8/8/8/2P5/8/2p5/4K3 b - c3 0 1'            , 'false:e1:e8');
});



// -----------------------------------------------------------------------------
// Move generation
// -----------------------------------------------------------------------------

var positions = [];

positions.push({
	label:'0a', constructor:'start', fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	legal:true, whiteking:'e1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a2a3/a2a4/b1a3/b1c3/b2b3/b2b4/c2c3/c2c4/d2d3/d2d4/e2e3/e2e4/f2f3/f2f4/g1f3/g1h3/g2g3/g2g4/h2h3/h2h4'
});

positions.push({
	label:'0b', constructor:'empty', fen:'8/8/8/8/8/8/8/8 w - - 0 1',
	legal:false, whiteking:'-', blackking:'-',
	check:false, checkmate:false, stalemate:false, hasmove:false,
	moves:''
});

positions.push({
	label:'1', constructor:'fen', fen:'rnbqkbnr/pppp1ppp/8/1B2p3/4P3/8/PPPP1PPP/RNBQK1NR b KQkq - 0 1',
	legal:true, whiteking:'e1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a7a5/a7a6/b7b6/b8a6/b8c6/c7c5/c7c6/d8e7/d8f6/d8g5/d8h4/e8e7/f7f5/f7f6/f8a3/f8b4/f8c5/f8d6/f8e7/g7g5/g7g6/g8e7/g8f6/g8h6/h7h5/h7h6'
});

positions.push({
	label:'2a', constructor:'fen', fen:'r3k2r/8/8/5pP1/1pP5/8/8/R3K2R w KQ f6 0 1',
	legal:true, whiteking:'e1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a1a2/a1a3/a1a4/a1a5/a1a6/a1a7/a1a8/a1b1/a1c1/a1d1/c4c5/e1c1/e1d1/e1d2/e1e2/e1f1/e1f2/e1g1/g5f6/g5g6/h1f1/h1g1/h1h2/h1h3/h1h4/h1h5/h1h6/h1h7/h1h8'
});

positions.push({
	label:'2b', constructor:'fen', fen:'r3k2r/8/8/5pP1/1pP5/8/8/R3K2R w K - 0 1',
	legal:true, whiteking:'e1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a1a2/a1a3/a1a4/a1a5/a1a6/a1a7/a1a8/a1b1/a1c1/a1d1/c4c5/e1d1/e1d2/e1e2/e1f1/e1f2/e1g1/g5g6/h1f1/h1g1/h1h2/h1h3/h1h4/h1h5/h1h6/h1h7/h1h8'
});

positions.push({
	label:'2c', constructor:'fen', fen:'r3k2r/8/8/5pP1/1pP5/8/8/R3K2R w Q - 0 1',
	legal:true, whiteking:'e1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a1a2/a1a3/a1a4/a1a5/a1a6/a1a7/a1a8/a1b1/a1c1/a1d1/c4c5/e1c1/e1d1/e1d2/e1e2/e1f1/e1f2/g5g6/h1f1/h1g1/h1h2/h1h3/h1h4/h1h5/h1h6/h1h7/h1h8'
});

positions.push({
	label:'2d', constructor:'fen', fen:'r3k2r/8/8/5pP1/1pP5/8/8/R3K2R b kq c3 0 1',
	legal:true, whiteking:'e1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a8a1/a8a2/a8a3/a8a4/a8a5/a8a6/a8a7/a8b8/a8c8/a8d8/b4b3/b4c3/e8c8/e8d7/e8d8/e8e7/e8f7/e8f8/e8g8/f5f4/h8f8/h8g8/h8h1/h8h2/h8h3/h8h4/h8h5/h8h6/h8h7'
});

positions.push({
	label:'2e', constructor:'fen', fen:'r3k2r/8/8/5pP1/1pP5/8/8/R3K2R b k - 0 1',
	legal:true, whiteking:'e1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a8a1/a8a2/a8a3/a8a4/a8a5/a8a6/a8a7/a8b8/a8c8/a8d8/b4b3/e8d7/e8d8/e8e7/e8f7/e8f8/e8g8/f5f4/h8f8/h8g8/h8h1/h8h2/h8h3/h8h4/h8h5/h8h6/h8h7'
});

positions.push({
	label:'2f', constructor:'fen', fen:'r3k2r/8/8/5pP1/1pP5/8/8/R3K2R b q - 0 1',
	legal:true, whiteking:'e1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a8a1/a8a2/a8a3/a8a4/a8a5/a8a6/a8a7/a8b8/a8c8/a8d8/b4b3/e8c8/e8d7/e8d8/e8e7/e8f7/e8f8/f5f4/h8f8/h8g8/h8h1/h8h2/h8h3/h8h4/h8h5/h8h6/h8h7'
});

positions.push({
	label:'3a', constructor:'fen', fen:'r4rk1/1p3qb1/pB1p2pp/P3N3/R3R3/2P5/1P2Q1PP/7K b - - 0 29',
	legal:true, whiteking:'h1', blackking:'g8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a8a7/a8b8/a8c8/a8d8/a8e8/d6d5/d6e5/f7a2/f7b3/f7c4/f7c7/f7d5/f7d7/f7e6/f7e7/f7e8/f7f1/f7f2/f7f3/f7f4/f7f5/f7f6/f8b8/f8c8/f8d8/f8e8/g6g5/g7e5/g7f6/g7h8/g8h7/g8h8/h6h5'
});

positions.push({
	label:'3b', constructor:'fen', fen:'r4rk1/1p4b1/pB1p2pp/P3N3/R3R3/2P5/1P2Q1PP/5q1K w - - 1 29',
	legal:true, whiteking:'h1', blackking:'g8',
	check:true, checkmate:false, stalemate:false, hasmove:true,
	moves:'b6g1/e2f1'
});

positions.push({
	label:'3c', constructor:'fen', fen:'r4rk1/1p6/p2p2pp/P3b3/R3R3/2P5/1P2Q1PP/5qBK w - - 0 30',
	legal:true, whiteking:'h1', blackking:'g8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a4a1/a4a2/a4a3/a4b4/a4c4/a4d4/b2b3/b2b4/c3c4/e2a6/e2b5/e2c2/e2c4/e2d1/e2d2/e2d3/e2e1/e2e3/e2f1/e2f2/e2f3/e2g4/e2h5/e4b4/e4c4/e4d4/e4e3/e4e5/e4f4/e4g4/e4h4/g2g3/g2g4/h2h3/h2h4'
});

positions.push({
	label:'4a', constructor:'fen', fen:'r2q1rk1/6b1/p2p2b1/1p1Nn2p/4p2P/2P1N3/PP2BPQ1/R3K2R w KQ - 0 22',
	legal:true, whiteking:'e1', blackking:'g8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a1b1/a1c1/a1d1/a2a3/a2a4/b2b3/b2b4/c3c4/d5b4/d5b6/d5c7/d5e7/d5f4/d5f6/e1c1/e1d1/e1d2/e1f1/e1g1/e2b5/e2c4/e2d1/e2d3/e2f1/e2f3/e2g4/e2h5/e3c2/e3c4/e3d1/e3f1/e3f5/e3g4/f2f3/f2f4/g2e4/g2f1/g2f3/g2g1/g2g3/g2g4/g2g5/g2g6/g2h2/g2h3/h1f1/h1g1/h1h2/h1h3'
});

positions.push({
	label:'4b', constructor:'fen', fen:'4qr2/r6k/p2p3b/1p1Nn2b/4Q2P/2P1N1R1/PP3P2/2K3R1 b - - 0 27',
	legal:true, whiteking:'c1', blackking:'h7',
	check:true, checkmate:false, stalemate:false, hasmove:true,
	moves:'e5g6/e8g6/f8f5/h5g6/h7h8'
});

positions.push({
	label:'4c', constructor:'fen', fen:'4qr1k/r7/p2p3b/1p1Nn2b/4QP1P/2P1N1R1/PP6/2K3R1 b - - 0 28',
	legal:true, whiteking:'c1', blackking:'h8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a6a5/a7a8/a7b7/a7c7/a7d7/a7e7/a7f7/a7g7/a7h7/b5b4/e5c4/e5c6/e5d3/e5d7/e5f3/e5f7/e5g4/e5g6/e8a8/e8b8/e8c6/e8c8/e8d7/e8d8/e8e6/e8e7/e8f7/e8g6/f8f4/f8f5/f8f6/f8f7/f8g8/h5d1/h5e2/h5f3/h5f7/h5g4/h5g6/h6f4/h6g5/h6g7'
});

positions.push({
	label:'5a', constructor:'fen', fen:'k7/8/8/b7/8/p6p/P6P/R3K2R w KQ - 0 1',
	legal:true, whiteking:'e1', blackking:'a8',
	check:true, checkmate:false, stalemate:false, hasmove:true,
	moves:'e1d1/e1e2/e1f1/e1f2'
});

positions.push({
	label:'5b', constructor:'fen', fen:'k7/8/8/8/8/p2b3p/P6P/R3K2R w KQ - 0 1',
	legal:true, whiteking:'e1', blackking:'a8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a1b1/a1c1/a1d1/e1c1/e1d1/e1d2/e1f2/h1f1/h1g1'
});

positions.push({
	label:'5c', constructor:'fen', fen:'k7/8/8/8/8/p4b1p/P6P/R3K2R w KQ - 0 1',
	legal:true, whiteking:'e1', blackking:'a8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a1b1/a1c1/a1d1/e1d2/e1f1/e1f2/e1g1/h1f1/h1g1'
});

positions.push({
	label:'5d', constructor:'fen', fen:'k7/8/7b/8/8/p6p/P6P/R3K2R w KQ - 0 1',
	legal:true, whiteking:'e1', blackking:'a8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a1b1/a1c1/a1d1/e1d1/e1e2/e1f1/e1f2/e1g1/h1f1/h1g1'
});

positions.push({
	label:'5e', constructor:'fen', fen:'k7/b7/8/8/8/p6p/P6P/R3K2R w KQ - 0 1',
	legal:true, whiteking:'e1', blackking:'a8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a1b1/a1c1/a1d1/e1c1/e1d1/e1d2/e1e2/e1f1/h1f1/h1g1'
});

positions.push({
	label:'5f', constructor:'fen', fen:'k7/8/8/8/8/p6p/P6P/R2K3R w KQ - 0 1',
	legal:false, whiteking:'e1', blackking:'a8',
	check:false, checkmate:false, stalemate:false, hasmove:false,
	moves:''
});

positions.push({
	label:'6a', constructor:'fen', fen:'r3k2r/p6p/P6P/8/B7/8/8/K7 b kq - 0 1',
	legal:true, whiteking:'a1', blackking:'e8',
	check:true, checkmate:false, stalemate:false, hasmove:true,
	moves:'e8d8/e8e7/e8f7/e8f8'
});

positions.push({
	label:'6b', constructor:'fen', fen:'r3k2r/p6p/P2B3P/8/8/8/8/K7 b kq - 0 1',
	legal:true, whiteking:'a1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a8b8/a8c8/a8d8/e8c8/e8d7/e8d8/e8f7/h8f8/h8g8'
});

positions.push({
	label:'6c', constructor:'fen', fen:'r3k2r/p6p/P4B1P/8/8/8/8/K7 b kq - 0 1',
	legal:true, whiteking:'a1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a8b8/a8c8/a8d8/e8d7/e8f7/e8f8/e8g8/h8f8/h8g8'
});

positions.push({
	label:'6d', constructor:'fen', fen:'r3k2r/p6p/P6P/8/8/7B/8/K7 b kq - 0 1',
	legal:true, whiteking:'a1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a8b8/a8c8/a8d8/e8d8/e8e7/e8f7/e8f8/e8g8/h8f8/h8g8'
});

positions.push({
	label:'6e', constructor:'fen', fen:'r3k2r/p6p/P6P/8/8/8/B7/K7 b kq - 0 1',
	legal:true, whiteking:'a1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:true,
	moves:'a8b8/a8c8/a8d8/e8c8/e8d7/e8d8/e8e7/e8f8/h8f8/h8g8'
});

positions.push({
	label:'6f', constructor:'fen', fen:'r2k3r/p6p/P6P/8/8/8/8/K7 b kq - 0 1',
	legal:false, whiteking:'a1', blackking:'e8',
	check:false, checkmate:false, stalemate:false, hasmove:false,
	moves:''
});

positions.push({
	label:'7a', constructor:'fen', fen:'4k3/4P3/4K3/8/8/8/8/8 b - - 0 1',
	legal:true, whiteking:'e6', blackking:'e8',
	check:false, checkmate:false, stalemate:true, hasmove:false,
	moves:''
});

positions.push({
	label:'7b', constructor:'fen', fen:'8/8/8/8/8/6k1/8/r5K1 w - - 0 1',
	legal:true, whiteking:'g1', blackking:'g3',
	check:true, checkmate:true, stalemate:false, hasmove:false,
	moves:''
});


// Position status
registerTests('rpbchess.moves.ccs', positions, function(scenario) {
	test('Check/Checkmate/Stalemate ' + scenario.label, function() {
		var p=new RPBChess.Position(scenario.constructor === 'fen' ? scenario.fen : scenario.constructor);
		return ccsInfo(p);
	}, scenario.legal ? scenario.check + ':' + scenario.checkmate + ':' + scenario.stalemate + ':' + scenario.hasmove : '');
});


// Move legality
registerTests('rpbchess.moves.islegal', positions, function(scenario) {
	var /* const */ ROW    = '12345678';
	var /* const */ COLUMN = 'abcdefgh';
	var /* const */ PROMO  = ' bknpqr';

	// Look for legal moves in a given position
	function fun(position) {
		var res = '';
		for(var cf=0; cf<8; ++cf) {
			for(var rf=0; rf<8; ++rf) {
				for(var ct=0; ct<8; ++ct) {
					for(var rt=0; rt<8; ++rt) {
						for(var p=0; p<PROMO.length; ++p) {
							var move = { from: COLUMN[cf] + ROW[rf], to: COLUMN[ct] + ROW[rt] };
							if(PROMO[p] !== ' ') {
								move.promotion = PROMO[p];
							}
							var descriptor = position.isMoveLegal(move);
							if(descriptor) {
								if(res !== '') { res += '/'; }
								res += wrapMove(descriptor);
							}
						}
					}
				}
			}
		}
		return res;
	}

	// Run the test
	test('Move legality ' + scenario.label, function() {
		var p=new RPBChess.Position(scenario.constructor === 'fen' ? scenario.fen : scenario.constructor);
		return fun(p);
	}, scenario.moves);
});


// Move bad format
registerTest('rpbchess.moves.islegal.errors', function() {

	function fun(label, arg) {
		testError(label, function() { var p=new RPBChess.Position(); return p.isMoveLegal(arg); }, checkIllegalArgument('Position#isMoveLegal()'));
	}

	fun('Move bad-format 1', { from:'e2' });
	fun('Move bad-format 2', { to  :'e4' });
	fun('Move bad-format 3', { from:'e2', to:'X'  });
	fun('Move bad-format 4', { from:'X' , to:'e4' });
	fun('Move bad-format 5', { from:'e2', to:'e4', promotion:'X' });
});


// Move generation
registerTests('rpbchess.moves.generate', positions, function(scenario) {

	// Generate the legal moves in a given position
	function fun(position) {
		var descriptors = position.moves();
		var moves = [];
		for(var i=0; i<descriptors.length; ++i) {
			moves.push(wrapMove(descriptors[i]));
		}
		moves.sort();
		var res = '';
		for(var i=0; i<moves.length; ++i) {
			if(res !== '') { res += '/'; }
			res += moves[i];
		}
		return res;
	}

	// Run the test
	test('Move generation ' + scenario.label, function() {
		var p=new RPBChess.Position(scenario.constructor === 'fen' ? scenario.fen : scenario.constructor);
		return fun(p);
	}, scenario.moves);
});
