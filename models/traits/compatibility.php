<?php
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


require_once(RPBCHESSBOARD_ABSPATH . 'models/traits/abstracttrait.php');
require_once(RPBCHESSBOARD_ABSPATH . 'helpers/validation.php');


/**
 * Compatibility settings with respect to other chess plugins (that may use the
 * [fen][/fen] and [pgn][/pgn] shortcodes as well).
 */
class RPBChessboardTraitCompatibility extends RPBChessboardAbstractTrait
{
	private static $fenCompatibilityMode;
	private static $pgnCompatibilityMode;
	private static $pieceSymbolLocalizationAvailable;


	/**
	 * Whether the compatibility mode is activated or not for the [fen][/fen] shortcode
	 * (which means that [fen_compat][/fen_compat] would be used instead).
	 *
	 * @return boolean
	 */
	public function getFENCompatibilityMode()
	{
		if(!isset(self::$fenCompatibilityMode)) {
			$value = RPBChessboardHelperValidation::validateBooleanFromInt(get_option('rpbchessboard_fenCompatibilityMode'));
			self::$fenCompatibilityMode = isset($value) ? $value : false;
		}
		return self::$fenCompatibilityMode;
	}


	/**
	 * Whether the compatibility mode is activated or not for the [pgn][/pgn] shortcode
	 * (which means that [pgn_compat][/pgn_compat] would be used instead).
	 *
	 * @return boolean
	 */
	public function getPGNCompatibilityMode()
	{
		if(!isset(self::$pgnCompatibilityMode)) {
			$value = RPBChessboardHelperValidation::validateBooleanFromInt(get_option('rpbchessboard_pgnCompatibilityMode'));
			self::$pgnCompatibilityMode = isset($value) ? $value : false;
		}
		return self::$pgnCompatibilityMode;
	}


	/**
	 * Return the shortcode to use for FEN diagrams.
	 *
	 * @return string
	 */
	public function getFENShortcode()
	{
		return $this->getFENCompatibilityMode() ? 'fen_compat' : 'fen';
	}


	/**
	 * Return the shortcode to use for PGN games.
	 *
	 * @return string
	 */
	public function getPGNShortcode()
	{
		return $this->getPGNCompatibilityMode() ? 'pgn_compat' : 'pgn';
	}


	/**
	 * Whether the localization is available for piece symbols or not.
	 *
	 * @return boolean
	 */
	public function isPieceSymbolLocalizationAvailable()
	{
		if(!isset(self::$pieceSymbolLocalizationAvailable)) {
			$englishPieceSymbols = 'KQRBNP';
			$localizedPieceSymbols =
				/*i18n King symbol   */ __('K', 'rpbchessboard') .
				/*i18n Queen symbol  */ __('Q', 'rpbchessboard') .
				/*i18n Rook symbol   */ __('R', 'rpbchessboard') .
				/*i18n Bishop symbol */ __('B', 'rpbchessboard') .
				/*i18n Knight symbol */ __('N', 'rpbchessboard') .
				/*i18n Pawn symbol   */ __('P', 'rpbchessboard');
			self::$pieceSymbolLocalizationAvailable = ($englishPieceSymbols !== $localizedPieceSymbols);
		}
		return self::$pieceSymbolLocalizationAvailable;
	}
}
