<?php
/******************************************************************************
 *                                                                            *
 *    This file is part of RPB Chessboard, a WordPress plugin.                *
 *    Copyright (C) 2013-2021  Yoann Le Montagner <yo35 -at- melix.net>       *
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
?>

<div id="rpbchessboard-helpPGNSyntaxPage" class="rpbchessboard-helpPage">

	<p>
		<?php
			printf(
				esc_html__(
					'The string between the %1$s[%3$s][/%3$s]%2$s tags describe the game. ' .
					'The used notation follows the standard %4$sPGN format%7$s, and can ' .
					'be automatically generated by the common chess database softwares, ' .
					'including %5$sChessbase%7$s, %6$sScid%7$s, etc... ' .
					'The PGN syntax is summarized here through a few representative examples.',
					'rpb-chessboard'
				),
				'<span class="rpbchessboard-sourceCode">',
				'</span>',
				esc_html( $model->getPGNShortcode() ),
				sprintf( '<a href="%s" target="_blank">', esc_url( __( 'https://en.wikipedia.org/wiki/Portable_Game_Notation', 'rpb-chessboard' ) ) ),
				'<a href="http://www.chessbase.com/" target="_blank">',
				'<a href="http://scid.sourceforge.net/" target="_blank">',
				'</a>'
			);
		?>
	</p>

	<p>
		<?php
			printf(
				esc_html__(
					'Please note that, alternatively, the game can be described by passing an URL to a regular .pgn file, ' .
					'as described in the %1$smemo page%2$s.',
					'rpb-chessboard'
				),
				sprintf( '<a href="%s">', esc_url( $model->getMemoURL() ) ),
				'</a>'
			);
		?>
	</p>

	<ol class="rpbchessboard-outline">
		<li><a href="#rpbchessboard-pgnExample"><?php esc_html_e( 'Standard PGN game', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnNAG"><?php esc_html_e( 'NAGs (aka. Numeric Annotation Glyphs)', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnComment"><?php esc_html_e( 'Comments', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnVariation"><?php esc_html_e( 'Variations', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnDiagram"><?php esc_html_e( 'Diagrams', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnCustomStartingPosition"><?php esc_html_e( 'Custom starting position', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnMarker"><?php esc_html_e( 'Square, arrow, and text markers', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnNullMove"><?php esc_html_e( 'Null moves', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnChess960"><?php esc_html_e( 'Chess960 (aka. Fischer Random Chess)', 'rpb-chessboard' ); ?></a></li>
		<li><a href="#rpbchessboard-pgnAntichess"><?php esc_html_e( 'Antichess', 'rpb-chessboard' ); ?></a></li>
	</ol>

	<?php
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/Example', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/NAG', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/Comment', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/Variation', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/Diagram', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/CustomStartingPosition', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/Marker', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/NullMove', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/Chess960', $model );
		RPBChessboardHelperLoader::printTemplate( 'AdminPage/Help/PGNSyntax/Antichess', $model );
	?>

</div>
