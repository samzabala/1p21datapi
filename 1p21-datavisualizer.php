<?php
/*
Plugin Name: 1Point21 Data Vizualizer
Plugin URI: https://github.com/samzabala/1p21datapi
Description: Data visualizer using d3 and svgs
Version: 1.2.0
Author: 1Point21 Interactive
Author URI: https://www.1point21interactive.com/
*/


/********************************************************************************************
* VARIABLES
*********************************************************************************************/




$_1p21_dv = array();

//track visible data visuals and duplicate instances in the front end to avoid script conflicts
$_1p21_dv['present'] = array();

//default front end displaying related arguments or attributes to each instances
$_1p21_dv['defaults'] = array(
	'id' => null, //post id
	//shortcode render reliant parameters
		'align' => 'center', // default value is not in js because js doesnt need to use this boi. use it @ shortcode render
	//js reliant parameters
		'margin' => null, //spacing necessary within the canvas to avoid cuttong off elements
		'margin_offset' => null, //multiplier for spacing
		'font_size' => null,
		'width' => null, //duh
		'height' => null, //duh
		'transition' => null, //duh
		'delay' => null, //duh
);

$_1p21_dv['enqueued'] = false;

define('_1P21_DV_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define('_1P21_DV_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define('_1P21_DV_PLUGIN_BASENAME',plugin_basename(__FILE__));


/*
Roast the user in the admin because ACF is not installed
*/

//  yes
function _1p21_dv_check_for_acf(){
	if (!class_exists('ACF')){
		$message = 'Advanced Custom Fields PRO is not installed. 1Point21 Data Vizualizer needs this plugin for complete functionality';

		_1p21_dv_create_admin_error($message);
	};
}
add_action('admin_init','_1p21_dv_check_for_acf');

require_once _1P21_DV_PLUGIN_PATH . 'includes/helpers.php';
require_once _1P21_DV_PLUGIN_PATH . 'includes/setup-admin.php';

/********************************************************************************************
* OK HERE WE GOOOOOOO
*********************************************************************************************/

if( !post_type_exists('data-visual') ){
	require_once _1P21_DV_PLUGIN_PATH . 'includes/register-enqueues.php';
	require_once _1P21_DV_PLUGIN_PATH . 'includes/register-cpt.php';
	require_once _1P21_DV_PLUGIN_PATH . 'includes/register-settings.php';
	require_once _1P21_DV_PLUGIN_PATH . 'includes/register-fields.php';

	require_once _1P21_DV_PLUGIN_PATH . 'includes/render-documentation.php';
	require_once _1P21_DV_PLUGIN_PATH . 'includes/render-back.php';
	require_once _1P21_DV_PLUGIN_PATH . 'includes/render-front.php';

}else{
	add_action( 'admin_notices', function(){

		$class = 'notice notice-error';
		$message = __( '1p21 Data Vizualizer cannot work. a data-visual post type already exists!' );
	
		printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $message ) ); 
	} );
}


	


	/////test




	// add_action('_1p21_dv_info',function(){ return true; },99);