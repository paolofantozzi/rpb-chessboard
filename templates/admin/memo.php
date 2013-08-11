
<h3><?php _e('Reminder', 'rpbchessboard'); ?></h3>

<p>
	<?php
		_e(
			'This short reminder presents through examples the features provided by the RPB Chessboard plugin, '.
			'namely the insertion of chess diagrams and games in posts and pages. '.
			'On the left is the code written in posts and pages; '.
			'the right column shows the corresponding rendering.',
		'rpbchessboard');
	?>
</p>





<h4><?php _e('FEN diagram', 'rpbchessboard'); ?></h4>

<div class="rpbchessboard-admin-columns">

	<div class="rpbchessboard-admin-column-left">
		<div class="rpbchessboard-admin-code-block">
			<?php _e('White to move and mate in two:', 'rpbchessboard'); ?>
			<br/><br/>
			[fen]r2qkbnr/ppp2ppp/2np4/4N3/2B1P3/2N5/PPPP1PPP/R1BbK2R w KQkq - 0 6[/fen]
			<br/><br/>
			<?php _e(
				'This position is known as Légal Mate. '.
				'It is named after the French player François Antoine de Kermeur Sire de Legale (1702-1795).'
			, 'rpbchessboard'); ?>
		</div>
		<p>
			<?php echo sprintf(
				__(
					'The string between the %1$s[fen][/fen]%2$s tags describe the position. '.
					'The used notation follows the %3$sForsyth-Edwards notation (FEN)%4$s. '.
					'A comprehensive description of the FEN format is available on %3$sWikipedia%4$s.',
				'rpbchessboard'),
				'<span class="rpbchessboard-admin-code-inline">',
				'</span>',
				sprintf('<a href="%1$s" target="_blank">',
					__('http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation', 'rpbchessboard')
				),
				'</a>'
			); ?>
		</p>
	</div>

	<div class="rpbchessboard-admin-column-right">
		<div class="rpbchessboard-admin-visu-block">
			<p><?php _e('White to move and mate in two:', 'rpbchessboard'); ?></p>
			<pre class="jsChessLib-fen-source" id="rpbchessboard-admin-example1">r2qkbnr/ppp2ppp/2np4/4N3/2B1P3/2N5/PPPP1PPP/R1BbK2R w KQkq - 0 6</pre>
			<script type="text/javascript">
				jsChessRenderer.processFENByID("rpbchessboard-admin-example1", 28, true);
			</script>
			<p>
				<?php _e(
					'This position is known as Légal Mate. '.
					'It is named after the French player François Antoine de Kermeur Sire de Legale (1702-1795).'
				, 'rpbchessboard'); ?>
			</p>
		</div>
	</div>

</div>





<h4><?php _e('PGN game', 'rpbchessboard'); ?></h4>

<div class="rpbchessboard-admin-columns">

	<div class="rpbchessboard-admin-column-left">
		<div class="rpbchessboard-admin-code-block">
			[pgn]
			<br/><br/>
			[Event "1&lt;sup&gt;st&lt;/sup&gt; American Chess Congress"]<br/>
			[Site "New York, NY USA"]<br/>
			[Date "1857.11.03"]<br/>
			[Round "4.6"]<br/>
			[White "Paulsen, Louis"]<br/>
			[Black "Morphy, Paul"]<br/>
			[Result "0-1"]<br/>
			<br/>
			1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. Bb5 Bc5 5. O-O O-O 6. Nxe5 Re8
			7. Nxc6 dxc6 8. Bc4 b5 9. Be2 Nxe4 10. Nxe4 Rxe4 11. Bf3 Re6
			12. c3 Qd3 13. b4 Bb6 14. a4 bxa4 15. Qxa4 Bd7 16. Ra2 Rae8
			17. Qa6<br/>
			<br/>
			{[pgndiagram]
			<?php
				_e(
					'Morphy took twelve minutes over his next move, '.
					'probably to assure himself that the combination was sound and '.
					'that he had a forced win in every variation.',
				'rpbchessboard');
			?>}<br/>
			<br/>
			17... Qxf3 $3 18. gxf3 Rg6+ 19. Kh1 Bh3 20. Rd1<br/>
			<br/>
			({<?php _e('Not', 'rpbchessboard'); ?>} 20. Rg1 Rxg1+ 21. Kxg1 Re1+ $19)<br/>
			<br/>
			20... Bg2+ 21. Kg1 Bxf3+ 22. Kf1 Bg2+<br/>
			<br/>
			(22...Rg2 $1 {<?php _e('would have won more quickly. For instance:', 'rpbchessboard'); ?>}
			23. Qd3 Rxf2+ 24. Kg1 Rg2+ 25. Kh1 Rg1#)<br/>
			<br/>
			23. Kg1 Bh3+ 24. Kh1 Bxf2 25. Qf1
			{<?php _e('Absolutely forced.', 'rpbchessboard'); ?>}
			25... Bxf1 26. Rxf1 Re2 27. Ra1 Rh6 28. d4 Be3 0-1
			<br/><br/>
			[/png]
		</div>
		<p>
			<?php echo sprintf(
				__(
					'The code between the %1$s[pgn][/pgn]%2$s tags describe the game. '.
					'The used notation follows the standard %3$sPGN format%4$s. '.
					'It can be copy-pasted from a .pgn file generated by any chess database software, '.
					'including %5$sChessbase%6$s, %7$sScid%8$s, etc...',
				'rpbchessboard'),
				'<span class="rpbchessboard-admin-code-inline">',
				'</span>',
				sprintf('<a href="%1$s" target="_blank">',
					__('http://en.wikipedia.org/wiki/Portable_Game_Notation', 'rpbchessboard')
				),
				'</a>',
				'<a href="http://www.chessbase.com/" target="_blank">',
				'</a>',
				'<a href="http://scid.sourceforge.net/" target="_blank">',
				'</a>'
			); ?>
		</p>
		<p>
			<?php echo sprintf(
				__(
					'Please note the %1$s[pgndiagram]%2$s tag placed inside a commentary '.
					'to insert a diagram showing the current position.',
				'rpbchessboard'),
				'<span class="rpbchessboard-admin-code-inline">',
				'</span>'
			); ?>
		</p>
	</div>

	<div class="rpbchessboard-admin-column-right">
		<div class="rpbchessboard-admin-visu-block">
			<pre class="jsChessLib-pgn-source" id="rpbchessboard-admin-example3-in">
				[Event "1<sup>st</sup> American Chess Congress"]
				[Site "New York, NY USA"]
				[Date "1857.11.03"]
				[Round "4.6"]
				[White "Paulsen, Louis"]
				[Black "Morphy, Paul"]
				[Result "0-1"]

				1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. Bb5 Bc5 5. O-O O-O 6. Nxe5 Re8
				7. Nxc6 dxc6 8. Bc4 b5 9. Be2 Nxe4 10. Nxe4 Rxe4 11. Bf3 Re6
				12. c3 Qd3 13. b4 Bb6 14. a4 bxa4 15. Qxa4 Bd7 16. Ra2 Rae8
				17. Qa6

				{
					<span class="jsChessLib-anchor-diagram"></span>
					<?php
						_e(
							'Morphy took twelve minutes over his next move, '.
							'probably to assure himself that the combination was sound and '.
							'that he had a forced win in every variation.',
						'rpbchessboard');
					?>
				}

				17... Qxf3 $3 18. gxf3 Rg6+ 19. Kh1 Bh3 20. Rd1

				({<?php _e('Not', 'rpbchessboard'); ?>} 20. Rg1 Rxg1+ 21. Kxg1 Re1+ $19)

				20... Bg2+ 21. Kg1 Bxf3+ 22. Kf1 Bg2+

				(22...Rg2 $1 {<?php _e('would have won more quickly. For instance:', 'rpbchessboard'); ?>}
				23. Qd3 Rxf2+ 24. Kg1 Rg2+ 25. Kh1 Rg1#)

				23. Kg1 Bh3+ 24. Kh1 Bxf2 25. Qf1
				{<?php _e('Absolutely forced.', 'rpbchessboard'); ?>}
				25... Bxf1 26. Rxf1 Re2 27. Ra1 Rh6 28. d4 Be3 0-1
			</pre>
			<div class="jsChessLib-invisible" id="rpbchessboard-admin-example3-out">
				<div class="rpbchessboard-game-head">
					<div class="jsChessLib-field-fullNameWhite">
						<span class="rpbchessboard-white-square">&nbsp;</span>
						<span class="jsChessLib-anchor-fullNameWhite"></span>
					</div>
					<div class="jsChessLib-field-fullNameBlack">
						<span class="rpbchessboard-black-square">&nbsp;</span>
						<span class="jsChessLib-anchor-fullNameBlack"></span>
					</div>
					<div class="jsChessLib-field-Event">
						<span class="jsChessLib-anchor-Event"></span>
						<span class="jsChessLib-field-Round">(<span class="jsChessLib-anchor-Round"></span>)</span>
						<span class="jsChessLib-field-Date">- <span class="jsChessLib-anchor-Date"></span></span>
					</div>
				</div>
				<div class="rpbchessboard-game-body jsChessLib-field-moves">
					<span class="jsChessLib-anchor-moves"></span>
					<div class="jsChessLib-field-Result">
						<span class="jsChessLib-anchor-Result"></span>
					</div>
				</div>
			</div>
			<script type="text/javascript">
				jsChessRenderer.processPGNByID("rpbchessboard-admin-example3");
			</script>
		</div>
	</div>

</div>
