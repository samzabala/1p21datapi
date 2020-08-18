<?php




/********************************************************************************************
* Render field groups
*********************************************************************************************/


function _1p21_dv_load_acf(){
	if(function_exists('acf_add_local_field_group')){
		//register them
		require _1P21_DV_PLUGIN_PATH . 'fields/acf-cpt.php';
		acf_add_local_field_group($_1p21_dv_fields_cpt);


		// require _1P21_DV_PLUGIN_PATH . 'fields/acf-settings.php';
		// acf_add_local_field_group($_1p21_dv_fields_settings);


		//update json for debug or update via import

		$fields_cpt_mod = filemtime(_1P21_DV_PLUGIN_PATH . '/fields/acf-cpt.php');
		// $fields_set_mod = filemtime(_1P21_DV_PLUGIN_PATH . '/fields/acf-settings.php');
		$json_mod = filemtime(_1P21_DV_PLUGIN_PATH . '/fields/acf-dv-fields.json');

		
		if( $fields_cpt_mod > $json_mod and function_exists('acf_get_local_fields') and is_admin() ){

			//put bois here
			$json = [];

			//give each boi spotlight
			foreach($_1p21_dv_fields_fields as $arr) {


				// $key = $arr['key'];

				// $group = acf_get_local_field_group($key);
				// $fields = acf_get_local_fields($key);

				// 	unset($group['ID']);
	
				// 	// Add the fields as an array to the group because getting field group doesnt append the fields it has?? what the fook?
				// 	$group['fields'] = $fields;
	
					// Add this group to the array going to be jsonified




				$to_json = $arr;
				if(isset($to_json['ID'])):
					unset($to_json['ID']);
				endif;

				// $json[] = $group;
				$json[] = $to_json;

			}

			//boop
			$json = json_encode($json, JSON_PRETTY_PRINT);

			// Write output to file for easy import into ACF.
			// The file must be writable by the server process.
			$file =  _1P21_DV_PLUGIN_PATH . 'fields/acf-dv-fields.json';

			//pootpoot
			file_put_contents($file, $json );
		}
	}
}


add_action('acf/init', '_1p21_dv_load_acf');



/********************************************************************************************
validate name and value input
*********************************************************************************************/
function _1p21_dv_validate_x_and_y_data($valid,$value,$field,$input){
	if( !$valid ) {
		return $valid;
	}
	if(isset($_POST['acf']['field_5d42110769b59']) && isset($_POST['acf']['field_5d4494e1f5295'])){

		$value_x = $_POST['acf']['field_5d42110769b59'];
		$value_y  = $_POST['acf']['field_5d4494e1f5295'];


		if($value_x == $value_y){
			$valid = 'X Axis Data and Y Axis Data cannot be the same value';
		}
	}
	

	return $valid;
}
add_filter('acf/validate_value/key=field_5d42110769b59', '_1p21_dv_validate_x_and_y_data', 10, 4);
add_filter('acf/validate_value/key=field_5d4494e1f5295', '_1p21_dv_validate_x_and_y_data', 10, 4);



/********************************************************************************************
populate valid multiple layouts based on graph type
*********************************************************************************************/
function _1p21_dv_load_multiple_display($field){

		$layouts = array(
			'0' => 'Select Display',
			'overlap' => 'Overlap',
			'slider' => 'Slider',
		);


		//erase old bois
		$field['choices'] = array();

		foreach( $layouts as $id => $description){
			$value = $id;
			$label = $description;

			$field['choices'][ $value ] = $label;
		}

		return $field;
}
add_filter('acf/load_field/key=field_5ed02cf258c30', '_1p21_dv_load_multiple_display', 10, 4);

