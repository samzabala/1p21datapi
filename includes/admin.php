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

		$settings = get_option( '_1p21_dv_opts' );

		if($settings['dv_optimize'] == true){
			//handles will be dummies now
			
			wp_register_style( '1p21-dv-d3-styles', false );

			wp_register_script( 'd3',false);
				wp_register_script( '1p21-dv-d3', false);

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
	add_action( 'wp_enqueue_scripts', '_1p21_dv_register_scripts_front' );


	function _1p21_dv_register_scripts_admin(){

		$settings = get_option( '_1p21_dv_opts' );

		if($settings['dv_optimize'] == true){
			//handles will be dummies now
			wp_register_style( '1p21-dv-d3-styles-admin', false );

		}else{
			wp_register_style( '1p21-dv-d3-styles-admin', _1P21_DV_PLUGIN_URL . 'assets/admin.css',array(),null );
		}

	}
	add_action( 'admin_enqueue_scripts', '_1p21_dv_register_scripts_admin' );
	
//enqueueadmin


	//style classes of acf
	function _1p21_dv_acf_fields_styles(){
		wp_enqueue_style('1p21-dv-d3-styles-admin');
		wp_add_inline_style('1p21-dv-d3-styles-admin',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH . '/assets/admin.css') );
	}
	add_action('admin_head', '_1p21_dv_acf_fields_styles');

//if optimize setting is false, scripts get enqueued only when the shortcode is called, if not we can only embed all the assets an all pages because enqueueing dem bois embeded on the html only when a shortcode is present on an optimal setup is too komplikado
function _1p21_dv_merge_include_assets(){
	global $_1p21_dv;
	$settings = get_option( '_1p21_dv_opts' );

	if($settings['dv_optimize'] == true){

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
add_action( 'wp_head', '_1p21_dv_merge_include_assets' );

// display id on edit page
function _1p21_dv_display_id_to_edit_page() {
	global $post;
	$scr = get_current_screen();


	if ( $scr->post_type == 'data-visual' && $scr->parent_base === 'edit' ){

		echo '<h2 style="font-size: 1.25em;margin-top:.75em;display:inline-block;border: 1px solid #ccc;">Data Visual ID: <span class="wp-ui-highlight" style="position:relative; bottom: .0625em; left: .125em; padding: .25em .5em; font-family: monospace;">'.$post->ID.'</span></h2>';
	}
		return;
}

add_action( 'edit_form_after_title', '_1p21_dv_display_id_to_edit_page' );


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
			<div class="_1p21-dv-content">

				<?php
				include_once _1P21_DV_PLUGIN_PATH .'/README.html';

				?>
			</div>
			<?php
		};

}
add_action( 'admin_menu', '_1p21_dv_add_documentation_link_to_cpt_dropdown',11 );


//add link
add_filter('plugin_action_links_' . _1P21_DV_PLUGIN_BASENAME, '_1p21_dv_add_documentation_link_to_plugins');
function _1p21_dv_add_documentation_link_to_plugins( $links ) {
	echo 'shit';
	$links[] = '<a href="' .
	get_admin_url( null,'edit.php?post_type=data-visual&page=1p21-dv-documentation' ) .
		'">' . __('Documentation') . '</a>';
	return $links;
}