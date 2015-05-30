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


require_once(RPBCHESSBOARD_ABSPATH . 'models/abstract/adminpage.php');


/**
 * Model associated to the 'Help' page in the backend.
 */
class RPBChessboardModelAdminPageHelp extends RPBChessboardAbstractModelAdminPage
{
	public function __construct()
	{
		parent::__construct();
		$this->loadTrait('Compatibility');
		$this->loadTrait('URLs'         );

		// Create the sub-pages.
		$this->addSubPage('helppgnsyntax', __('PGN game syntax', 'rpbchessboard'), true);
		$this->addSubPage('helppgnattributes', sprintf(__('%1$s[%3$s][/%3$s]%2$s tag parameters', 'rpbchessboard'),
			'<span class="rpbchessboard-sourceCode">', '</span>', htmlspecialchars($this->getPGNShortcode())));
		$this->addSubPage('helpfenattributes', sprintf(__('%1$s[%3$s][/%3$s]%2$s tag parameters', 'rpbchessboard'),
			'<span class="rpbchessboard-sourceCode">', '</span>', htmlspecialchars($this->getFENShortcode())));
		$this->addSubPage('helpfen', __('FEN diagram', 'rpbchessboard'));
		$this->addSubPage('helppgn', __('PGN game'   , 'rpbchessboard'));
	}
}
