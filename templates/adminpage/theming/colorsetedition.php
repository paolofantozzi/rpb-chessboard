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

<td colspan="3" <?php echo $isNew ? 'id="rpbchessboard-setCodeCreator"' : 'class="rpbchessboard-setCodeEditor"'; ?> >
	<form class="rpbchessboard-inlineForm" action="<?php echo esc_attr( $model->getFormActionURL() ); ?>" method="post">

		<input type="hidden" name="rpbchessboard_action" value="<?php echo esc_attr( $model->getFormAction( $isNew ) ); ?>" />
		<?php wp_nonce_field( 'rpbchessboard_post_action' ); ?>

		<div class="rpbchessboard-inlineFormTitle">
			<?php $isNew ? esc_html_e( 'New colorset', 'rpb-chessboard' ) : esc_html_e( 'Edit colorset', 'rpb-chessboard' ); ?>
		</div>

		<div>
			<label>
				<span><?php esc_html_e( 'Name', 'rpb-chessboard' ); ?></span>
				<input type="text" name="label"
					value="<?php echo esc_attr( $isNew ? $model->getLabelProposalForNewSetCode() : $model->getCustomColorsetLabel( $colorset ) ); ?>" />
			</label>
		</div>

		<?php if ( $isNew ) : ?>
		<div>
			<label>
				<span><?php esc_html_e( 'Slug', 'rpb-chessboard' ); ?></span>
				<input type="text" name="colorset" value="" />
			</label>
		</div>
		<?php else : ?>
		<input type="hidden" name="colorset" value="<?php echo esc_attr( $colorset ); ?>" />
		<?php endif; ?>

		<div class="rpbchessboard-columns">
			<div class="rpbchessboard-stretchable rpbchessboard-colorFieldAndSelector">
				<label>
					<span><?php esc_html_e( 'Dark squares', 'rpb-chessboard' ); ?></span>
					<input type="text" size="7" maxlength="7" class="rpbchessboard-darkSquareColorField" name="darkSquareColor"
						value="<?php echo esc_attr( $isNew ? $model->getRandomDarkSquareColor() : $model->getDarkSquareColor( $colorset ) ); ?>" />
				</label>
				<div>
					<div class="rpbchessboard-darkSquareColorSelector"></div>
				</div>
			</div>
			<div class="rpbchessboard-stretchable rpbchessboard-colorFieldAndSelector">
				<label>
					<span><?php esc_html_e( 'Light squares', 'rpb-chessboard' ); ?></span>
					<input type="text" size="7" maxlength="7" class="rpbchessboard-lightSquareColorField" name="lightSquareColor"
						value="<?php echo esc_attr( $isNew ? $model->getRandomLightSquareColor() : $model->getLightSquareColor( $colorset ) ); ?>" />
				</label>
				<div>
					<div class="rpbchessboard-lightSquareColorSelector"></div>
				</div>
			</div>
			<div class="rpbchessboard-stretchable rpbchessboard-colorFieldAndSelector">
				<label>
					<span><?php esc_html_e( 'Move arrow', 'rpb-chessboard' ); ?></span>
					<input type="text" size="7" maxlength="7" class="rpbchessboard-highlightColorField" name="highlightColor"
						value="<?php echo esc_attr( $isNew ? $model->getRandomHighlightColor() : $model->getHighlightColor( $colorset ) ); ?>" />
				</label>
				<div>
					<div class="rpbchessboard-highlightColorSelector"></div>
				</div>
			</div>
		</div>

		<div class="rpbchessboard-columns">
			<div class="rpbchessboard-stretchable rpbchessboard-colorFieldAndSelector">
				<label>
					<span><?php esc_html_e( 'Green markers', 'rpb-chessboard' ); ?></span>
					<input type="text" size="7" maxlength="7" class="rpbchessboard-greenMarkerColorField" name="greenMarkerColor"
						value="<?php echo esc_attr( $isNew ? $model->getRandomGreenMarkerColor() : $model->getGreenMarkerColor( $colorset ) ); ?>" />
				</label>
				<div>
					<div class="rpbchessboard-greenMarkerColorSelector"></div>
				</div>
			</div>
			<div class="rpbchessboard-stretchable rpbchessboard-colorFieldAndSelector">
				<label>
					<span><?php esc_html_e( 'Red markers', 'rpb-chessboard' ); ?></span>
					<input type="text" size="7" maxlength="7" class="rpbchessboard-redMarkerColorField" name="redMarkerColor"
						value="<?php echo esc_attr( $isNew ? $model->getRandomRedMarkerColor() : $model->getRedMarkerColor( $colorset ) ); ?>" />
				</label>
				<div>
					<div class="rpbchessboard-redMarkerColorSelector"></div>
				</div>
			</div>
			<div class="rpbchessboard-stretchable rpbchessboard-colorFieldAndSelector">
				<label>
					<span><?php esc_html_e( 'Yellow markers', 'rpb-chessboard' ); ?></span>
					<input type="text" size="7" maxlength="7" class="rpbchessboard-yellowMarkerColorField" name="yellowMarkerColor"
						value="<?php echo esc_attr( $isNew ? $model->getRandomYellowMarkerColor() : $model->getYellowMarkerColor( $colorset ) ); ?>" />
				</label>
				<div>
					<div class="rpbchessboard-yellowMarkerColorSelector"></div>
				</div>
			</div>
		</div>

		<p class="submit rpbchessboard-inlineFormButtons">
			<input type="submit" class="button-primary" value="<?php $isNew ? esc_attr_e( 'Create colorset', 'rpb-chessboard' ) : esc_attr_e( 'Save changes', 'rpb-chessboard' ); ?>" />
			<a class="button" href="<?php echo esc_url( $model->getFormActionURL() ); ?>"><?php esc_html_e( 'Cancel', 'rpb-chessboard' ); ?></a>
		</p>

	</form>
</td>
