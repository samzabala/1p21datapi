<?php
/********************************************************************************************
* filter + hooks and stuff
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
	function _1p21_dv_register_scripts() {

		// wp_register_script( 'd3','https://d3js.org/d3.v5.js',array(),false,true);
		wp_register_script( 'd3',_1P21_DV_PLUGIN_URL.'assets/d3.v5.min.js',array(),false,true);
		
		if(current_user_can('administrator')) {
			wp_register_script( '1p21-dv-d3', _1P21_DV_PLUGIN_URL . 'assets/main.js',array('d3'),null,true);
		}else{
			wp_register_script( '1p21-dv-d3', _1P21_DV_PLUGIN_URL . 'assets/main.min.js',array('d3'),null,true);
        }
        
		wp_register_style( '1p21-dv-d3-styles', _1P21_DV_PLUGIN_URL . 'assets/style.css',array(),null );
	}
	add_action( 'wp_enqueue_scripts', '_1p21_dv_register_scripts' );

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

//style classes of acf
	function _1p21_dv_acf_fields_styles(){
		?>
		<style type="text/css">

		._1p21-dv-content {
			max-width: 960px;
			padding: 40px 2em;
			margin: 0 auto;
			font-size: 1.125em;
		}

		._1p21-dv-content p {
			font-size: inherit;
		}

		._1p21-dv-content h3 {
			font-size: 1.2em;
		}

		._1p21-dv-content li {
			margin-bottom: 2em;
		}

		._1p21-dv-content ul {
			padding-left: 2em;
		}

		#acf-group_5d4206c985d00 .dv-code input,
		#acf-group_5d4206c985d00 .dv-code textarea{
			font-family: monospace;
			
		}
		</style>
		<?php 
	}


add_action('admin_head', '_1p21_dv_acf_fields_styles');