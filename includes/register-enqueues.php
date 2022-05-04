<?php
/********************************************************************************************
* script registers and enqueues and shit
*********************************************************************************************/

//register scripts. enqueue only happens when data visualizer is present
	function _1p21_dv_register_scripts_front() {

		$values = get_option( '_1p21_dv_opts' );
			//@TODO cleanup so it's not performance boggy n shit
			wp_register_script( 'd3',_1P21_DV_PLUGIN_URL.'assets/vendor/d3.js',array(),false,true);
			wp_register_script( 'd3-tip',_1P21_DV_PLUGIN_URL.'assets/vendor/d3-tip.min.js',array('d3'),false,true);

		if(isset($values['dv_optimize'])){
			//handles will be dummies now
			
			wp_register_style( '1p21-dv-data-visualizer-style', null,array(),null );
			wp_register_script( '1p21-dv-data-visualizer-script',null,array('d3','d3-tip'),null,true);

		}else{
			wp_register_style( '1p21-dv-data-visualizer-style',_1P21_DV_PLUGIN_URL . 'assets/css/dataVisualizer.css',array(),null );
			wp_register_script( '1p21-dv-data-visualizer-script',_1P21_DV_PLUGIN_URL . 'assets/js/dataVisualizer.umd.js',false,null,true);
		}

		
	}
	add_action( 'wp_enqueue_scripts', '_1p21_dv_register_scripts_front',1 );


	function _1p21_dv_register_enqueue_scripts_admin(){
		// No need to optimize these scripts in the admin. plus it casues errors anyway :\
		$values = get_option( '_1p21_dv_opts' );
		
		
		wp_register_style( '1p21-dv-styles-admin', _1P21_DV_PLUGIN_URL . 'assets/css/style-admin.css',array(),null );
		wp_register_script( '1p21-dv-script-admin', _1P21_DV_PLUGIN_URL.'assets/js/script-admin.js',array(),false,false);


		wp_enqueue_style('1p21-dv-styles-admin');
		wp_enqueue_script('1p21-dv-script-admin');


	}
	add_action( 'admin_enqueue_scripts', '_1p21_dv_register_enqueue_scripts_admin');

//add inline
	//if optimize setting is false, we are able to enqueue scriptsonly when the shortcode is called,
	// if not, we can only embed all the assets an all pages because enqueueing dem bois embedded on the html only when a shortcode is present on an optimal setup is too komplikado
	//wp_enqueue functions happen on render-front functions
	function _1p21_dv_inline_scripts_front(){
		global $_1p21_dv;

		$values = get_option( '_1p21_dv_opts' );

		if(isset($values['dv_optimize'])){

			if($_1p21_dv['enqueued'] == false){

				//stylesheet
					wp_add_inline_style('1p21-dv-data-visualizer-style',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH . '/assets/datVisualizer.css') );

				//script

			// if(current_user_can('administrator')) {
			// 	wp_add_inline_script('d3',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH.'/assets/vendor/d3.js') );
			// }else{
			// 	wp_add_inline_script('d3',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH.'/assets/vendor/d3.min.js') );
			// }
					
			// 			wp_add_inline_script('d3',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH.'/assets/vendor/d3-tip.min.js') );

						if(current_user_can('administrator')) {
							wp_add_inline_script( '1p21-dv-data-visualizer-script', _1p21_dv_get_file_as_string( _1P21_DV_PLUGIN_PATH . 'assets/js/dataVisualizer.js') );
						}else{
							wp_add_inline_script( '1p21-dv-data-visualizer-script', _1p21_dv_get_file_as_string( _1P21_DV_PLUGIN_PATH . '/assets/js/dataVisualizer.umd.js') );
						}

				$_1p21_dv['enqueued'] = true;
			}
		}
	}
	add_action( 'wp_head', '_1p21_dv_inline_scripts_front',1 );


	





