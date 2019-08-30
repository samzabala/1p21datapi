<?php



/********************************************************************************************
* HELPERS
*********************************************************************************************/

/*
IDK D:
i might use later
*/

function _1p21_dv_output_arr($args) {

	echo '<div class="content" style="background:#ccc;font-size:10px;padding:1em;margin-bottom:1em;height:400px;overflow:scroll;"><pre>';
	print_r($args);
	echo '</pre></div>';

}

function _1p21_dv_create_admin_error($message,$notice_type = 'error'){
		
	$class = 'notice notice-'.$notice_type;
	$parsed_message = __( $message );
	printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), strip_tags( $parsed_message,"<br><pre><code><br/><strong><b><i><em><p><strong>" ) ); 
}




/*
deep sub field get but only get the post meta that this fuck actually needs
*/

function _1p21_dv_deep_sub_fields($array = array()){
	global $post;
	

	$defaults = array(
		'id' => null,
		'fields' => array(),
		'prefix' => '', //for getting post meta
	);
	
	$args = wp_parse_args($array, $defaults);


	if(!$args['id']){
		return false;
	}

	$return_arr = array();
	$acf_prefix = 'dv_';
	


	foreach($args['fields'] as $field){


		if(
			$field[ 'name' ] !== null
			&& $field[ 'name' ] !== ''
		){ //if it exists and its not a fucking tab or some layout shit fuck it uP



			//parse so we can loop as long as fuck as we want
			$root_field_name = str_replace($acf_prefix,'',$field['name']); //remove dv_ because i dont need it on the object plus it makes js args pretty
			$new_prefix = ($args['prefix'] == '') ? $field['name'] : $args['prefix'].'_'.$root_field_name;




			if( isset($field['sub_fields']) ){


				
				if($field['type'] == 'repeater'){

					$meta_subbed_length = get_post_meta($args['id'],$new_prefix,true);
					
					// o boy
					$return_arr[ $root_field_name ] = array();

					if($meta_subbed_length){

						for( $i = 0; $i < $meta_subbed_length; $i++ ) {

							$return_arr[ $root_field_name ][$i] = _1p21_dv_deep_sub_fields(
								array(
									'id' => $args['id'],
									'fields' => $field['sub_fields'],
									'prefix' => $new_prefix.'_'.$i
								)
							);

						}

					}

				}else{

					$return_arr[ $root_field_name ] = _1p21_dv_deep_sub_fields(
						array(
							'id' => $args['id'],
							'fields' => $field['sub_fields'],
							'prefix' => $new_prefix
						)
					);
				}
				
			}else{
				$return_arr[ $root_field_name ] = get_post_meta($args['id'], $new_prefix,true);
			}

		}
	}
	
	return $return_arr;
}

function _1p21_dv_get_subbed_post_meta($args = array()){
	$args = wp_parse_args($args,array(
		'id' => null,
		'key' => '',
		'sub_keys' => array(),
		'is_incremented' => true
	));

	//to return
	$post_meta = array();

	//all existing
	$all_meta = get_metadata('post',$args['id']);

//if key has increments
	if($args['is_incremented'] == true){


		$meta_subbed_length = get_post_meta($args['id'],$args['key'],true);

		if($meta_subbed_length){

			for( $i = 0; $i < $meta_subbed_length; $i++ ) {
				
				$post_meta[$i] = array(
				);
	
				if(empty($args['sub_keys'])){
	
	
					foreach($all_meta as $meta=>$arr){
						// {$args['key']}_{$i}_{$sub_key}
						$prefix = $args['key'].'_'.$i.'_';
	
						//do not include acf key valued data
						if( strpos($meta,"{$prefix}") !== false && strpos($meta,"_{$prefix}") === false ){
							$post_meta[$i][str_replace($prefix,'',$meta)] = get_post_meta( $args['id'], $meta, true );
						}
					}
				}else{
					foreach($args['sub_keys'] as $sub_key) {
						$post_meta[$i][$args['sub_keys']] = get_post_meta( $args['id'], "{$prefix}_$sub_key", true );
					}
				}
			}
	
		}

	}else{

		foreach($all_meta as $meta => $value){
			

			$prefix = $args['key'].'_';

			if( strpos($meta,"{$prefix}") !== false && strpos($meta,"_{$prefix}") === false ){
				$post_meta[str_replace($prefix,'',$meta)] = get_post_meta( $args['id'], $meta, true );
			}

		}

	}
	
	return $post_meta;



	
}


function _1p21_dv_dashes_to_camel_case($string, $capitalizeFirstCharacter = false) 
{

	$str = str_replace(' ', '', ucwords(str_replace(array('_','-'), ' ', $string)));

	if (!$capitalizeFirstCharacter) {
		$str[0] = strtolower($str[0]);
	}

	return $str;
}


//key selector in a format js understands
function _1p21_parse_data_key($key_string) {

	$parsed_key = $key_string;
	$parsed_key  = str_replace( array("'"),'', $parsed_key); //quotes
	$parsed_key = preg_replace("/\[(.+?)\]/",'.$1',$parsed_key);// brackets

	return $parsed_key;
}
/********************************************************************************************
* HELPERS BUT HMMM other ppl can use it i guess
*********************************************************************************************/



if(!function_exists('get_data_visual_object')){
	function get_data_visual_object($id,$atts) {
		return _1p21_dv_get_data_visual_object($id,$atts);
	}
}

if(!function_exists('output_args')){
	function output_args($args) {
		_1p21_dv_output_arr($args);
	}
}

if(!function_exists('get_data_visualizer')){
	function get_data_visualizer($args,$echo) {
		_1p21_div_get_data_visualizer($args,$echo);
	}
}
if(!function_exists('the_data_visualizer')){
	function the_data_visualizer($args) {
		_1p21_div_get_data_visualizer($args,true);
	}
}
