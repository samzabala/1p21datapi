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

			//update json on changes
			$groups = acf_get_local_field_groups(array('group_5d40bfc5e49db','group_5d4206c985d00')); //taken from files mentioned above
			$json = [];

			foreach ($groups as $group) {
				// Fetch the fields for the given group key
				$fields = acf_get_local_fields($group['key']);

				// Remove unecessary key value pair with key "ID"
				unset($group['ID']);

				// Add the fields as an array to the group
				$group['fields'] = $fields;

				// Add this group to the main array
				$json[] = $group;
			}

			$json = json_encode($json, JSON_PRETTY_PRINT);

			// Write output to file for easy import into ACF.
			// The file must be writable by the server process. In this case, the file is located in
			// the current theme directory.
			$file =  _1P21_DV_PLUGIN_PATH . 'fields/acf-dv-fields.json';
			file_put_contents($file, $json );
		}
	}
}


add_action('acf/init', '_1p21_dv_load_acf');


//validate name and value input
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

