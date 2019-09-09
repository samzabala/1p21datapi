<?php

/********************************************************************************************
* global settings fields
*********************************************************************************************/

//whitelist our group of options so WP knows they exist
	function _1p21_dv_options_register(){
		
		register_setting(
			'_1p21_dv_options_group',
			'_1p21_dv_opts',
			array(
				'sanitize_callback' => '_1p21_dv_options_validate',
				'default' => array(
					'dv_optimize' => false
				)
			)
		);	
	}
	add_action( 'admin_init', '_1p21_dv_options_register' );

//add the page to the admin menu to hold our form. do it when the world is ready for global settings
	function _1p21_dv_options_add_page(){
		//add_options_page(title, menu name, capability, slug, form callback);

		// add_options_page('Data Visualizer Settings', 'Settings','manage_options', '1p21-dv-options-page', '_1p21_dv_options_build_form');
		
		// if(function_exists('acf_add_options_sub_page') || function_exists('acf_add_local_field_group')){

		// 	if(function_exists('acf_add_options_sub_page')){
		// 		acf_add_options_sub_page(array(
		// 			'capability'	=> 'edit_posts',
		// 			'redirect'		=> false,
		// 			'page_title' 	=> 'Data Visualizer Settings (ACF)',
		// 			'menu_title' 	=> 'Settings',
		// 			'menu_slug' 	=> '1p21-dv-settings',
		// 			'parent_slug' 	=> 'edit.php?post_type=data-visual',
		// 		));
		// 	}

			
		// }else{
			add_submenu_page(
				'edit.php?post_type=data-visual',
				'Data Visualizer Settings',
				'Settings','manage_options',
				'1p21-dv-settings',
				function(){ return _1p21_dv_render_admin_page_template('settings-form.php'); }
			);
		// }
	}
	add_action( 'admin_menu', '_1p21_dv_options_add_page',11 );


//add link
	add_filter('plugin_action_links_' . _1P21_DV_PLUGIN_BASENAME, '_1p21_dv_add_settings_link');
	function _1p21_dv_add_settings_link( $links ) {
		
		$links[] = '<a href="' .
		get_admin_url( null,'edit.php?post_type=data-visual&page=1p21-dv-settings' ) .
			'">' . __('Settings') . '</a>';
		return $links;
	}

//validation
function _1p21_dv_options_validate($input){

	/*
	
	//remove all HTML, PHP, Mysql from some inputs
	$input['company_phone'] = wp_filter_nohtml_kses($input['company_phone']);
	$input['support_email'] = wp_filter_nohtml_kses($input['support_email']);
	$input['message_source'] = wp_filter_nohtml_kses($input['message_source']);
	
	//for fields with allowed HTML
	$allowed_tags = array(
		'br' => array(),
		'p' => array(),
		'em' => array(),
		'b' => array(),
		'strong' => array(),
		'i' => array(),
		'a' => array( //attributes allowed in this tag only:
			'href' => array(),
			'title' => array()
		)
	);
	//allow HTML in the address for line breaks
	$input['company_address'] = wp_kses( $input['company_address'], $allowed_tags );
	$input['welcome_message'] = wp_kses($input['welcome_message'], $allowed_tags );
	
	//checkbox validation. turn the value to zero if not checked
	$input['show_quote'] = ( $input['show_quote'] == 1 ? 1 : 0 );
	
	*/

	//remove all HTML, PHP, Mysql from some inputs
	
	// add_settings_error
	// https://digwp.com/2016/05/wordpress-admin-notices/

	foreach($input as $setting=> $value){
		$input[$setting] = $value ? true : false;
	}
	
	return $input;
}

// @TODO in case settings need to be intense, implement acf as a ui usage