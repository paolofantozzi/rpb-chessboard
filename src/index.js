/******************************************************************************
 *                                                                            *
 *    This file is part of RPB Chessboard, a WordPress plugin.                *
 *    Copyright (C) 2013-2022  Yoann Le Montagner <yo35 -at- melix.net>       *
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


import './public-path';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Chessboard, i18n as kokopuReactI18n } from 'kokopu-react';

import Chessgame from './Chessgame';
import { registerFENBlock } from './FENEditor';
import { registerPGNBlock } from './PGNEditor';

// Internationalization
kokopuReactI18n.ANNOTATED_BY = RPBChessboard.i18n.PGN_ANNOTATED_BY;
kokopuReactI18n.LINE = RPBChessboard.i18n.PGN_LINE_REF;
kokopuReactI18n.PIECE_SYMBOLS = {
	K: RPBChessboard.i18n.PIECE_SYMBOLS.K,
	Q: RPBChessboard.i18n.PIECE_SYMBOLS.Q,
	R: RPBChessboard.i18n.PIECE_SYMBOLS.R,
	B: RPBChessboard.i18n.PIECE_SYMBOLS.B,
	N: RPBChessboard.i18n.PIECE_SYMBOLS.N,
	P: RPBChessboard.i18n.PIECE_SYMBOLS.P,
};

// Theming
Object.assign(Chessboard.colorsets(), RPBChessboard.customColorsets);
Object.assign(Chessboard.piecesets(), RPBChessboard.customPiecesets);

// Special colorsets and piecesets for theming edition
RPBChessboard.editColorset = Chessboard.colorsets()._edit_ = {};
RPBChessboard.editPieceset = Chessboard.piecesets()._edit_ = {};

// Block registration
registerFENBlock();
registerPGNBlock();


// Chessboard rendering function (to be used in the admin pages)
RPBChessboard.renderAdminChessboard = function(targetJQueryElement, widgetArgs) {
	let widget = <Chessboard {...widgetArgs} />;
	ReactDOM.render(widget, targetJQueryElement.get(0));
};


// Chessboard rendering function
RPBChessboard.renderFEN = function(targetJQueryElement, widgetArgs) {
	let widget = <Chessboard
		position={widgetArgs.position}
		squareMarkers={widgetArgs.squareMarkers}
		arrowMarkers={widgetArgs.arrowMarkers}
		textMarkers={widgetArgs.textMarkers}
		flipped={widgetArgs.flipped}
		squareSize={widgetArgs.squareSize}
		coordinateVisible={widgetArgs.coordinateVisible}
		colorset={widgetArgs.colorset}
		pieceset={widgetArgs.pieceset}
		smallScreenLimits={RPBChessboard.smallScreenLimits}
	/>;
	ReactDOM.render(widget, targetJQueryElement.get(0));
};


// Chessgame rendering function
RPBChessboard.renderPGN = function(targetJQueryElement, widgetArgs) {
	let diagramOptions = {
		flipped: widgetArgs.flipped,
		squareSize: widgetArgs.idoSquareSize,
		coordinateVisible: widgetArgs.idoCoordinateVisible,
		colorset: widgetArgs.idoColorset,
		pieceset: widgetArgs.idoPieceset,
		smallScreenLimits: RPBChessboard.smallScreenLimits,
	};
	let navigationBoardOptions = {
		flipped: widgetArgs.flipped,
		squareSize: widgetArgs.nboSquareSize,
		coordinateVisible: widgetArgs.nboCoordinateVisible,
		colorset: widgetArgs.nboColorset,
		pieceset: widgetArgs.nboPieceset,
		animated: widgetArgs.nboAnimated,
		moveArrowVisible: widgetArgs.nboMoveArrowVisible,
		smallScreenLimits: RPBChessboard.smallScreenLimits,
	};
	let widget = <Chessgame
		url={widgetArgs.url}
		pgn={widgetArgs.pgn}
		gameIndex={widgetArgs.gameIndex}
		pieceSymbols={widgetArgs.pieceSymbols}
		diagramOptions={diagramOptions}
		navigationBoardOptions={navigationBoardOptions}
		navigationBoard={widgetArgs.navigationBoard}
		withFlipButton={widgetArgs.withFlipButton}
		withDownloadButton={widgetArgs.withDownloadButton}
	/>;
	ReactDOM.render(widget, targetJQueryElement.get(0));
};
