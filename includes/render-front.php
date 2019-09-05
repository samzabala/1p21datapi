<?php
/********************************************************************************************
* Render markup
*********************************************************************************************/

function _1p21_dv_validate_boolean($value){
	return $value == 0 ? 'false' : 'true';
}


function _1p21_dv_validate_arr($value){
	return $value == 0 ? 'false' : 'true';
}


function _1p21_div_get_data_visualizer($args = array(),$echo = false){
	global $_1p21_dv;


	$data_visual = _1p21_dv_get_data_visual_object($args);
	$render = '';

	if($data_visual && get_post_status($data_visual['id']) == 'publish') {

	
		//append this instance as array to the global variable to allow front end manipulation
			if(array_key_exists($args['id'],$_1p21_dv['present'])) {
				$_1p21_dv['present'][$args['id']]['front']['instance']++;
				$data_visual['front']['instance']++;
			}else{
				$_1p21_dv['present'][$args['id']] = $data_visual;

				$_1p21_dv['present'][$args['id']]['front'] = array(
					'instance' => 1
				);
				$data_visual['front']['instance'] = 1;
			};

		
		$att_prefix = 'data-visualizer';
		
		//create unique id for instance to avoid script conflict
			$wrapper_id = "{$att_prefix}-{$args['id']}";

			if($_1p21_dv['present'][$args['id']]['front']['instance'] > 1) {
				$wrapper_id .= "-{$_1p21_dv['present'][$args['id']]['front']['instance']}";
			}

			$_1p21_dv['present'][$args['id']]['front']['wrapper_id'][] = $wrapper_id;
			$data_visual['front']['wrapper_id'] = $wrapper_id;
	
		// start wrapper
		$render .= "<div id='$wrapper_id' class='{$att_prefix} {$att_prefix}-type-{$data_visual['type']} {$att_prefix}-align-{$data_visual['settings']['align']}'>";

		
					
		//heading wrapper
			// $render .= "<div style='opacity:0;' class='{$att_prefix}-heading {$att_prefix}-heading-align-{$data_visual['settings']['align']}'>";
			//	 $render .= "<span class='{$att_prefix}-title'>{$data_visual['title']}</span>";
				
			//	 if(isset($data_visual['description'])){

			//		 $render .= "<span class='{$att_prefix}-description'>{$data_visual['description']}</span>";
			//	 }
			// $render .= "</div>";

					
		
		
		//json if applicable
			if($data_visual['src']['type'] == 'rows' || $data_visual['src']['type'] == 'text'){
				$render .= "<script id='$wrapper_id-data'  type='application/json' >";

				$parsed_data = $data_visual['src']['data'];

				if($data_visual['src']['type'] == 'rows'){

					foreach($data_visual['src']['data'] as $data){
						$parsed_data_arr[] = json_encode($data,JSON_FORCE_OBJECT);
					}

					$parsed_data = '['.implode(',',$parsed_data_arr).']';
					// $parsed_data = json_encode($data_visual['src']['data']);

				}

				$render .= $parsed_data;
				
				$render .= "</script>";
			}

		//script
			$render .= "<script>
			(function(){
				document.addEventListener('DOMContentLoaded', function() {
					_1p21.dataVisualizer('#{$wrapper_id}',{\n";

						foreach($data_visual as $attribute => $value){

							if($attribute !== 'front'){

								switch($attribute){
									case 'settings':

										$not_js_args = array(
											'align', //a class is added to the heading wrapper
											'id' //id is already  in the obj
										);

										foreach( $value as $sub_setting => $sub_value ){
											if( $sub_value != null && !in_array($sub_setting,$not_js_args)) {
												if($sub_setting == 'font_size'){
													
													if( is_numeric($sub_value) ){
														$sub_value = $sub_value.'px';
													}else{
														$sub_value = json_encode($sub_value);
													}
												}
												$render .= _1p21_dv_dashes_to_camel_case($sub_setting).": {$sub_value},\n";
											}
										}
										break;
									case 'title':
									case 'description':
										$parsed_value = json_encode($value);
										$render .= _1p21_dv_dashes_to_camel_case($attribute) .": {$parsed_value},\n";
										break;
									case 'type':

										$render .= "type: '{$data_visual['type']}',\n";
										break;


									case 'key':

										$parsed_keys_arr_string = implode(',',array_map(
											function($value,$key){
												
												return $key.' :\'' . _1p21_parse_data_key($value) . '\'';
											},
											$value,
											array_keys($value)
										));
										$render .= _1p21_dv_dashes_to_camel_case($attribute) .": {{$parsed_keys_arr_string}},\n";

										break;

									
									case 'name_is_num':


										$parsed_value = ($value == 1 ) ? 'true' : 'false';
										$render .= _1p21_dv_dashes_to_camel_case($attribute).": {$parsed_value},\n";

										break;
										
									
									case 'src':


										foreach($value as $sub_setting => $sub_value){
									
											//they are all strings
											
											if($sub_setting == 'data'){
												
												if($value['type'] == 'rows' || $value['type'] == 'text'){
													$parsed_src_path = "window.document.location + '#{$wrapper_id}-data'";
												}else{
													$parsed_src_path = '\''.$sub_value.'\'';

												}
							
												$render .= "srcPath: {$parsed_src_path},\n";
											}elseif($sub_setting == 'key'){

												$parsed_value = _1p21_parse_data_key($sub_value);
												$render .= _1p21_dv_dashes_to_camel_case($attribute.'_'.$sub_setting). ":'".$parsed_value."',\n";

											}else{
												$render .= _1p21_dv_dashes_to_camel_case($attribute.'_'.$sub_setting). ":'".$sub_value."',\n";
											}
										}

										break;

									
									case 'format':
										foreach($value as $key_string=>$sub_fields){

											$attribute_string_prepend = $attribute.'_'.$key_string;

											foreach($sub_fields as $sub_key=>$sub_value){
												$attribute_string_prepend.'_'.$sub_key.'<br>';

												$parsed_value = $sub_value;

												if($sub_key == 'prepend' || $sub_key == 'append' ){
													$parsed_value = '\''.addslashes($sub_value).'\'';
												}
												if($sub_value){
													$render .= _1p21_dv_dashes_to_camel_case($attribute_string_prepend.'_'.$sub_key). ":".$parsed_value.",\n";
												}
											}
										}
										break;
									
										
									case 'x':
									case 'y':
									case 'color':
									case 'line':
									case 'pi':
									case 'name':
									case 'value':
									case 'scatter':

										$string_values = array();
										
										// $data_key_values = array();
										
										$boolean_values = array();
										
										$array_values_from_string =  array();
										$array_values_from_array = array();
											$array_items_are_strings = array();

										switch($attribute){

											case 'color':
												$array_values_from_array = array('palette');
												$array_items_are_strings = array('palette');
												$boolean_values = array('legend');
												break;

											case 'x':
											case 'y':
												$string_values = array('align','label');
												$boolean_values = array('ticks','grid');
												break;

											case 'line':
												$string_values = array('style','stroke','color','points_color','fill_color','fill_axis');
												$boolean_values = array('points','fill','fill_invert');
												$array_values_from_string = array('dash');
												break;

											case 'pi':
												$string_values = array('label_style');
												break;
													
											
										}
										
										
										foreach($value as $sub_setting => $sub_value) {
											if(
												(
													!is_array($sub_value)
													&& $sub_value !== null
													&& $sub_value !== ''
												)
												|| (
													is_array($sub_value)
													&& count($sub_value) > 0
												)
											){
												
												$parsed_settings_key = _1p21_dv_dashes_to_camel_case($attribute . '_' . $sub_setting ); 
												// echo $sub_setting.','.$sub_value.'<br>';
												$parsed_value = $sub_value;

												$imploder = ',';
												$implode_wrapper = ['[',']'];
												
												if(in_array($sub_setting,$array_items_are_strings)){
													$imploder = '\',\'';
													$implode_wrapper = ['[\'','\']'];
												}

												//straight up string
												if(in_array($sub_setting,$string_values)){
													if($sub_value !== null) {

														$parsed_value = '\''.addslashes($sub_value). '\'';
													}

												//boolean bitch
												}elseif(in_array($sub_setting,$boolean_values)){
													$parsed_value = ($sub_value == 1) ? 'true' : 'false';

												// its a string of comma separated shit that can be a half ass array
												}elseif(
													in_array($sub_setting,$array_values_from_string)
													|| in_array($sub_setting,$array_values_from_array)
												){

													if( in_array($sub_setting,$array_values_from_string) ){
														$array_value = $sub_value;
													}else{
														$array_value = implode($imploder,$sub_value);
													}

													$parsed_value  = $implode_wrapper[0] . $array_value . $implode_wrapper[1];

												// its in an array for real and must be translated very much
												}

												// echo $sub_setting.'<br>';
						
						
												$render .= _1p21_dv_dashes_to_camel_case($attribute.'_'.$sub_setting).": {$parsed_value},\n";
													
											}
										}

										break;

									
									
								}
							}

						}


						//end
							$render .= "
					});
				})
			}());
			</script>";


		//end wrapper
		$render .= "</div>";


		// _1p21_dv_output_arr($data_visual);
		
	}else{
		$render =  '<div class="data-visualizer no-data"><div class="data-visualizer-wrapper fatality">Sorry, the data visual does not exist</div></div>';

	}


	if($echo){
		echo $render;
	}else{
		return $render;
	}
}



function _1p21_div_data_visualizer_render($atts = array()){
	global $_1p21_dv;
	$settings = get_option( '_1p21_dv_opts' );

	
	wp_enqueue_script( 'd3' );
	wp_enqueue_script( '1p21-dv-script-front' );
	wp_enqueue_style( '1p21-dv-style-front' );
	
	$args = shortcode_atts($_1p21_dv['defaults'],$atts);

	extract( $args );

	$render = _1p21_div_get_data_visualizer($args);

	return $render;
	
} 


/********************************************************************************************
* Shortcodes
*********************************************************************************************/

$_1p21_dv_shortcode_dv_is_native = false;
if(!shortcode_exists('dv')){

	add_shortcode('dv', '_1p21_div_data_visualizer_render');
	$_1p21_dv_shortcode_dv_is_native = true;

}else{
	//there is a plugin with dv in it. just in case
	if(!shortcode_exists('data_visualizer')){
		_1p21_dv_create_admin_error('<code>dv</code> shortcode could not be used by 1Point21 Data Vizualizer because it\'s already used by another plugin or the theme. Declare data visualizer shortcodes with <code>data_visualizer</code> instead','warning');
	}
	
}

//shortlived legacy / also fallback
add_shortcode('data_visualizer', '_1p21_div_data_visualizer_render');

