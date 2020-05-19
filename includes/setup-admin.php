<?php
/********************************************************************************************
* extra admin tweaks and shit
*********************************************************************************************/


//alow json,csv, and tsv files
	function _1p21_dv_allow_file_types($mimes) {
		$mimes['csv'] = 'text/csv';
		$mimes['tsv'] = 'text/tsv';
		return $mimes;
	}
	add_filter('upload_mimes', '_1p21_dv_allow_file_types');
	add_filter('mime_types', '_1p21_dv_allow_file_types');

////////////// EDIT PAGE SHIT


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
				
				require_once _1P21_DV_PLUGIN_PATH . '/templates/thickbox-media-form.php';
			}
			add_action('admin_footer', '_1p21_dv_add_modal');
