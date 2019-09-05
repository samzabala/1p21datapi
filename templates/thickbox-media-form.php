
<div id="_1p21_dv-media-modal" style="display:none;">
	<form class="_1p21_dv-form" onsubmit="return _1p21.appendShortcode(event,this);">
		<h2>Add Data Visualiser</h2>

		<h3>Select a Data Visual to add</h3>
		<div class="_1p21_dv-col-1">
			<div class="_1p21_dv-field">
				<label for="_1p21_dv-id">Data Visual</label>	

				<div class="_1p21_dv-input-contatiner">

					<select required name="id" class="_1p21_dv-input" id="_1p21_dv-id">
						<!-- custom query boi -->
						<option value="">Select Data Visual..</option>
						<?php
						$available_dv = new WP_Query(array(
							'post_type' => 'data-visual',
							'post_status' => 'publish',
							'posts_per_page' => -1
						));

						if($available_dv->have_posts()): while($available_dv->have_posts()): 
							$available_dv->the_post();
							?>
							
							<option value="<? the_ID(); ?>"><? the_title(); ?></option>
							<?php
						endwhile; endif;
						
						wp_reset_postdata();
						?>
					</select>
				</div>

				<span class="_1p21_dv-note">Note: Only published Data visuals are available</span>
			</div>
		</div>

	<h3>Content</h3>
		<div class="_1p21_dv-col-1">
			<div class="_1p21_dv-field">
				<label for="_1p21_dv-align">Text Align</label>	

				<div class="_1p21_dv-input-contatiner">

					<select required name="align" class="_1p21_dv-input" id="_1p21_dv-align">
						<!-- custom query boi -->
						<option value="center" selected>Center</option>
						<option value="left">Left</option>
						<option value="right">Right</option>
					</select>
				</div>
			</div>
		</div>
		
		
		<h3>Margin Setup</h3>
		<div class="_1p21_dv-col-2">
			<div class="_1p21_dv-field">
				<label for="_1p21_dv-margin">Margin (px)</label>	
				<div class="_1p21_dv-input-contatiner">
					<input type="number" placeholder="10" name="margin" class="_1p21_dv-input" id="_1p21_dv-margin">
				</div>
			</div>

			<div class="_1p21_dv-field">
				<label for="_1p21_dv-margin_offset">Margin Offset</label>	
				<div class="_1p21_dv-input-contatiner">
					<input type="number" placeholder="1" name="margin_offset" class="_1p21_dv-input" id="_1p21_dv-margin_offset">
				</div>
			</div>
		</div>


		
		<h3>Sizing</h3>
		<div class="_1p21_dv-col-2">
			<div class="_1p21_dv-field">
				<label for="_1p21_dv-width">Width (px)</label>	
				<div class="_1p21_dv-input-contatiner">
					<input type="number" placeholder="600" name="width" class="_1p21_dv-input" id="_1p21_dv-width">
				</div>
			</div>

			<div class="_1p21_dv-field">
				<label for="_1p21_dv-height">Height (px)</label>	
				<div class="_1p21_dv-input-contatiner">
					<input type="number" placeholder="600" name="height" class="_1p21_dv-input" id="_1p21_dv-height">
				</div>
			</div>
		</div>



		
		<h3>Advanced Options</h3>
		<div class="_1p21_dv-col-3">
			<div class="_1p21_dv-field">
				<label for="_1p21_dv-transition">Transition (milliseconds)</label>	
				<div class="_1p21_dv-input-contatiner">
					<input type="number" placeholder="1500" name="transition" class="_1p21_dv-input" id="_1p21_dv-transition">
				</div>
			</div>

			<div class="_1p21_dv-field">
				<label for="_1p21_dv-delay">Delay (milliseconds)</label>	
				<div class="_1p21_dv-input-contatiner">
					<input type="number" placeholder="250" name="delay" class="_1p21_dv-input" id="_1p21_dv-delay">
				</div>
			</div>

			<div class="_1p21_dv-field">
				<label for="_1p21_dv-font_size">Font Size (px)</label>	
				<div class="_1p21_dv-input-contatiner">
					<input type="number" placeholder="16" name="font_size" class="_1p21_dv-input" id="_1p21_dv-font_size">
				</div>
			</div>
		</div>

		<hr>

		<button type="submit" class="button button-primary">Submit</button>
	</form>
	
</div>