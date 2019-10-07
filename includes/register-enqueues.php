<?php
/********************************************************************************************
* script registers and enqueues and shit
*********************************************************************************************/

//register scripts. enqueue only happens when data visualizer is present
	function _1p21_dv_register_scripts_front() {

		$values = get_option( '_1p21_dv_opts' );

		if(isset($values['dv_optimize'])){
			//handles will be dummies now
			
			wp_register_style( '1p21-dv-style-front', null,array(),null );

			wp_register_script( 'd3',null,array(),null,true);
				wp_register_script( 'd3-tip',null,array('d3'),null,true);
				wp_register_script( '1p21-dv-script-front',null,array('d3','d3-tip'),null,true);

		}else{
			
			wp_register_style( '1p21-dv-style-front',_1P21_DV_PLUGIN_URL . 'assets/style-front.css',array(),null );

			wp_register_script( 'd3',_1P21_DV_PLUGIN_URL.'assets/d3.v5.min.js',array(),false,true);

				wp_register_script( 'd3-tip',_1P21_DV_PLUGIN_URL.'assets/d3-tip.min.js',array('d3'),false,true);

				if(current_user_can('administrator')) {
					wp_register_script( '1p21-dv-script-front',_1P21_DV_PLUGIN_URL . 'src/script-front.js',array('d3','d3-tip'),null,true);
				}else{
					wp_register_script( '1p21-dv-script-front',_1P21_DV_PLUGIN_URL . 'assets/script-front.min.js',array('d3','d3-tip'),null,true);
				}
		}

		
	}
	add_action( 'wp_enqueue_scripts', '_1p21_dv_register_scripts_front',1 );


	function _1p21_dv_register_enqueue_scripts_admin(){
		// No need to optimize these scripts in the admin. plus it casues errors anyway :\
		$values = get_option( '_1p21_dv_opts' );
		
		
		wp_register_style( '1p21-dv-styles-admin', _1P21_DV_PLUGIN_URL . 'assets/style-admin.css',array(),null );
		wp_register_script( '1p21-dv-script-admin', _1P21_DV_PLUGIN_URL.'assets/script-admin.min.js',array(),false,false);


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
					wp_add_inline_style('1p21-dv-style-front',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH . '/assets/style-front.css') );

				//script
					wp_add_inline_script('d3',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH.'/assets/d3.v5.min.js') );
					
						wp_add_inline_script('d3',_1p21_dv_get_file_as_string(_1P21_DV_PLUGIN_PATH.'/assets/d3-tip.min.js') );

						if(current_user_can('administrator')) {
							wp_add_inline_script( '1p21-dv-script-front', _1p21_dv_get_file_as_string( _1P21_DV_PLUGIN_PATH . 'src/script-front.js') );
						}else{
							wp_add_inline_script( '1p21-dv-script-front', _1p21_dv_get_file_as_string( _1P21_DV_PLUGIN_PATH . '/assets/script-front.min.js') );
						}

				$_1p21_dv['enqueued'] = true;
			}
		}
	}
	add_action( 'wp_head', '_1p21_dv_inline_scripts_front',1 );


	





