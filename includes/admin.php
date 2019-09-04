<?php
/********************************************************************************************
* filter + hooks, enqueues and stuff
*********************************************************************************************/

// output the front end influenced global variable
	function _1p21_dv_output_what_the_fuck_is_going_on(){
		$debug = false;
		$debug = apply_filters('_1p21_dv_info',$debug);


			if($debug) {
				global $_1p21_dv;
				_1p21_dv_output_arr($_1p21_dv);
			}
	}
	add_action( 'wp_footer', '_1p21_dv_output_what_the_fuck_is_going_on');

//alow json,csv, and tsv files
	function _1p21_dv_allow_file_types($mimes) {
		$mimes['csv'] = 'text/csv';
		$mimes['tsv'] = 'text/tsv';
		return $mimes;
	}
	add_filter('upload_mimes', '_1p21_dv_allow_file_types');


//register scripts. enqueue only happens when data visualizer is present
	function _1p21_dv_register_scripts_front() {

		$values = get_option( '_1p21_dv_opts' );

		if(isset($values['dv_optimize'])){
			//handles will be dummies now
			
			wp_register_style( '1p21-dv-d3-styles', null,array(),null );

			wp_register_script( 'd3',null,array(),null,true);
				wp_register_script( '1p21-dv-d3', null,array('d3'),null,true);

		}else{
			
			wp_register_style( '1p21-dv-d3-styles', _1P21_DV_PLUGIN_URL . 'assets/style.css',array(),null );

			wp_register_script( 'd3',_1P21_DV_PLUGIN_URL.'assets/d3.v5.min.js',array(),false,true);
				if(current_user_can('administrator')) {
					wp_register_script( '1p21-dv-d3', _1P21_DV_PLUGIN_URL . 'src/main.js',array('d3'),null,true);
				}else{
					wp_register_script( '1p21-dv-d3', _1P21_DV_PLUGIN_URL . 'assets/main.min.js',array('d3'),null,true);
				}
		}

		
	}
	add_action( 'wp_enqueue_scripts', '_1p21_dv_register_scripts_front',1 );


	function _1p21_dv_register_scripts_admin(){

		$values = get_option( '_1p21_dv_opts' );

		if(isset($values['dv_optimize'])){
			//handles will be dummies now
			wp_register_style( '1p21-dv-styles-admin', null );
			wp_register_script( '1p21-dv-script-admin', null,array(),null,true);

		}else{
			wp_register_style( '1p21-dv-styles-admin', _1P21_DV_PLUGIN_URL . 'assets/admin.css',array(),null );
			wp_register_script( '1p21-dv-script-admin', _1P21_DV_PLUGIN_URL.'assets/admin.min.js',array(),false,true,array(),null,true);
		}


		wp_enqueue_style('1p21-dv-styles-admin');
		wp_enqueue_script('1p21-dv-script-admin');
		if(isset($values['dv_optimize'])){

			wp_add_inline_style('1p21-dv-styles-admin',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH . '/assets/admin.css') );

			wp_add_inline_script('1p21-dv-script-admin',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH.'/assets/admin.min.js') );
		}

	}
	add_action( 'admin_enqueue_scripts', '_1p21_dv_register_scripts_admin',1 );

//add inline
	//if optimize setting is false, we are able to enqueue scriptsonly when the shortcode is called,
	// if not, we can only embed all the assets an all pages because enqueueing dem bois embedded on the html only when a shortcode is present on an optimal setup is too komplikado
	//wp_enqueue functions happen on render-front functions
	function _1p21_dv_merge_include_assets(){
		global $_1p21_dv;

		$values = get_option( '_1p21_dv_opts' );

		if(isset($values['dv_optimize'])){

			if($_1p21_dv['enqueued'] == false){

				//stylesheet
					wp_add_inline_style('1p21-dv-d3-styles',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH . '/assets/style.css') );

				//script
					wp_add_inline_script('d3',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH.'/assets/d3.v5.min.js') );

					if(current_user_can('administrator')) {
						wp_add_inline_script( '1p21-dv-d3', _1p21_dv_get_file_as_string( _1P21_DV_PLUGIN_PATH . 'src/main.js') );
					}else{
						wp_add_inline_script( '1p21-dv-d3', _1p21_dv_get_file_as_string( _1P21_DV_PLUGIN_PATH . '/assets/main.min.js') );
					}

				$_1p21_dv['enqueued'] = true;
			}
		}
	}
	add_action( 'wp_head', '_1p21_dv_merge_include_assets',1 );


	//add documentation link
		function _1p21_dv_add_documentation_link_to_cpt_dropdown(){
			// add_options_page(title, menu name, capability, slug, form callback);

			add_submenu_page(
				'edit.php?post_type=data-visual',
				__('1p21 Data Visualizer Documentation'),
				__('Documentation'),
				'edit_posts',
				'1p21-dv-documentation',
				'_1p21_dv_get_documentation'
				);

				function _1p21_dv_get_documentation(){
					?>
					<div class="_1p21_dv-content">

						<?php
						include_once _1P21_DV_PLUGIN_PATH .'/README.html';

						?>
					</div>
					<?php
				};

		}
		add_action( 'admin_menu', '_1p21_dv_add_documentation_link_to_cpt_dropdown',11 );


	//add doc link to plugin setting
		add_filter('plugin_action_links_' . _1P21_DV_PLUGIN_BASENAME, '_1p21_dv_add_documentation_link_to_plugins');
		function _1p21_dv_add_documentation_link_to_plugins( $links ) {
			echo 'shit';
			$links[] = '<a href="' .
			get_admin_url( null,'edit.php?post_type=data-visual&page=1p21-dv-documentation' ) .
				'">' . __('Documentation') . '</a>';
			return $links;
		}


// EDIT PAGE
	//display id
		function _1p21_dv_display_id_to_edit_page() {
			global $post;
			$scr = get_current_screen();

			if ( $scr->post_type == 'data-visual' && $scr->parent_base === 'edit' ){

				add_thickbox();

				echo '<h2 style="font-size: 1.25em;margin-top:.75em;display:inline-block;border: 1px solid #ccc;">Data Visual ID: <span class="wp-ui-highlight" style="position:relative; bottom: .0625em; left: .125em; padding: .25em .5em; font-family: monospace;">'.$post->ID.'</span></h2>';
			}
				return;
		}
		add_action( 'edit_form_after_title', '_1p21_dv_display_id_to_edit_page' );

	//add wysiwyg features to add data visualizer

		//add button
			function _1p21_dv_add_wysiwyg_button(){

				?>
				<a href="#TB_inline?&width=780&height=auto&inlineId=_1p21_dv-media-modal" class="thickbox button _1p21_dv-button"><i class="dashicons-before dashicons-chart-bar"></i><?= __('Add Data Visualizer'); ?></a>
				<?php

			}
			add_action('media_buttons', '_1p21_dv_add_wysiwyg_button');

		// implement thickbox for modal
			function _1p21_dv_add_modal(){
				add_thickbox();
				?>
				<div id="_1p21_dv-media-modal" style="display:none;">
					<form class="_1p21_dv-form" onsubmit="return _1p21.appendShortcode(event);">
						<h2>Add Data Visualiser</h2>
							<h3>Select a Data Visual to add</h3>
						<div class="col-1">
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

								<span class="note">Note: Only published Data visuals are available</span>
							</div>
						</div>
						
						
						<h3>Margin</h3>
						<div class="col-2">
							<div class="_1p21_dv-field">
								<label for="_1p21_dv-margin">Margin</label>	
								<div class="_1p21_dv-input-contatiner">
									<input type="text" placeholder="10" name="margin" class="_1p21_dv-input" id="_1p21_dv-margin">
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
						<div class="col-2">
							<div class="_1p21_dv-field">
								<label for="_1p21_dv-width">Width</label>	
								<div class="_1p21_dv-input-contatiner">
									<input type="number" placeholder="600" name="width" class="_1p21_dv-input" id="_1p21_dv-width">
								</div>
							</div>

							<div class="_1p21_dv-field">
								<label for="_1p21_dv-height">Height</label>	
								<div class="_1p21_dv-input-contatiner">
									<input type="number" placeholder="600" name="height" class="_1p21_dv-input" id="_1p21_dv-height">
								</div>
							</div>
						</div>

						<button type="submit" class="button button-primary">Submit</button>
					</form>
					
				</div>
				<?php
			}
			add_action('admin_footer', '_1p21_dv_add_modal');
