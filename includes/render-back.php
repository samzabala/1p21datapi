<?php

/********************************************************************************************
* Render data
*********************************************************************************************/

/*

 this where u generate php bois and validate which ones are valid
*/
function _1p21_dv_get_data_visual_object($args = array()) {
	global $_1p21_dv;


	if( isset($args['id']) ){
		$id = $args['id'];
		$post_exists = get_post( $id );
		$post_type = $post_exists->post_type;
	}


	// dont give shit if boi doesnt even exist
	
	if(!isset($id) || !$post_exists || $post_type !== 'data-visual') {
		return false;
	}else{

		//validation booleans and shit
		$validation_src_color_row_exists = false;
		//validation booleans and shit
		$validation_src_scatter_row_exists = false;

		require _1P21_DV_PLUGIN_PATH . 'fields/acf-cpt.php';
	
		$data_visual = array();
		$prefix = 'dv_';

		//the id
		$data_visual['id'] = $id;

		//title and shit
		$data_visual['title'] = get_the_title($id);

		//settings
		if(!empty($args)){
			$data_visual['settings'] =  wp_parse_args( array_change_key_case($args), $_1p21_dv['defaults'] );

			$data_visual['settings']['id'] =filter_var($data_visual['settings']['id'],FILTER_VALIDATE_INT);


			$data_visual['settings']['margin'] = explode(',',filter_var($data_visual['settings']['margin'],FILTER_SANITIZE_STRING));
			foreach( $data_visual['settings']['margin'] as $margin){
				$margin = filter_var($margin,FILTER_VALIDATE_INT);
			}

			$data_visual['settings']['margin'] = implode(',',$data_visual['settings']['margin']);
			


			if( is_string($data_visual['settings']['font_size']) ){
				$data_visual['settings']['font_size'] =filter_var($data_visual['settings']['font_size'],FILTER_VALIDATE_REGEXP,
				array(
					 "options" => array("regexp"=>"/(([+-]?\d*\.?\d+(\s)*(px|em|ex|pt|in|pc|mm|cm)?)|thin|medium|thick)(\s|;|$)/i")
				));
			}else{
				$data_visual['settings']['font_size'] =filter_var($data_visual['settings']['font_size'],FILTER_VALIDATE_INT);
			}


			$data_visual['settings']['name_size'] =filter_var($data_visual['settings']['name_size'],FILTER_VALIDATE_FLOAT);
			$data_visual['settings']['value_size'] =filter_var($data_visual['settings']['value_size'],FILTER_VALIDATE_FLOAT);

			$data_visual['settings']['width'] =filter_var($data_visual['settings']['width'],FILTER_VALIDATE_INT);
			$data_visual['settings']['height'] =filter_var($data_visual['settings']['height'],FILTER_VALIDATE_INT);


			$data_visual['settings']['align'] =filter_var($data_visual['settings']['align'],FILTER_SANITIZE_STRING);

			$data_visual['settings']['transition'] =filter_var($data_visual['settings']['transition'],FILTER_VALIDATE_INT);
			$data_visual['settings']['delay'] =filter_var($data_visual['settings']['delay'],FILTER_VALIDATE_INT);


		}
		
		$retrieved_dv_post_meta = _1p21_dv_deep_sub_fields(array(
			'id' => $id,
			'fields' => $_1p21_dv_fields_cpt['fields'],
		));

		// fields that make the bby
		$data_visual = array_merge(
			$data_visual,
			$retrieved_dv_post_meta
		);

		//also parse sources. yuckeeee
		$data_src_arr = array();


		foreach($data_visual['src'] as $property=>$value){

			// if($value){
				$data_src_arr[$property] = $data_visual['src'][$property];
			// }

		}


		$data_src_arr['type'] = $data_visual['src']['type'];
		$data_src_arr['key'] = $data_visual['src']['key'];

		switch($data_visual['src']['type']){
			case 'file':
				$data_src_arr['data'] = wp_get_attachment_url($data_visual['src']['file']);
				break;
			case 'url':
				$data_src_arr['data'] = $data_visual['src']['url'];
				break;
			case 'text':
				$data_src_arr['data'] = $data_visual['src']['text'];
				break;
			case 'rows':
				$parsed_src_rows = array();

				foreach( $data_visual['src']['row'] as $i=>$row ){
					$parsed_src_rows[$i][0] = $row[0];
					$parsed_src_rows[$i][1] = $row[1];


					if( 
						!empty($data_visual['color']['palette'])
						&& $data_visual['type'] !== 'pie'
						&& isset($parsed_src_rows[$i]['color'])
					) {

						if($validation_src_color_row_exists == false){
							$validation_src_color_row_exists = true;
						}

						$parsed_src_rows[$i]['color'] = $row['color'];
					}

					if(  $data_visual['src']['type'] == 'scatter' && $parsed_src_rows[$i]['area'] ) {
						if($validation_src_scatter_row_exists == false){
							$validation_src_scatter_row_exists = true;
						}
						$parsed_src_rows[$i]['area'] = $row['area'];
					}
				}

				$data_src_arr['data'] = $parsed_src_rows;
				break;
		}

		$data_visual['src'] = $data_src_arr;

		//validate data lkeys
		if( $data_visual['src']['type'] == 'rows' ){
			$data_visual['key'] = array(
				0=>0,
				1=>1
			);

			if($validation_src_color_row_exists == true){
				$data_visual['key']['color'] = 'color';
			}

			if($validation_src_scatter_row_exists == true){
				$data_visual['key']['scatter'] = 'scatter';
			}
		}
		

			
		if( $data_visual['type'] !== 'scatter' ){
			unset($data_visual['key']['area']);
		}
		
		if( $data_visual['type'] == 'pie' ){
			unset($data_visual['key']['color']);
		}




		// parse and remove itemz we dont need

		//remove based on multiple
		echo 'yieie';

		if( !isset($data_visual['multiple']) ){
			//src
			echo 'mayo igdi';
				unset($data_visual['src']['reverse_multiple']);
				unset($data_visual['src']['key_multiple']);

		}else{
			echo 'buray';
			var_dump($data_visual['name_is_num']);
		}


		//remove based on type
		if($data_visual['type'] !== 'line' && $data_visual['type'] !== 'scatter'){
			unset($data_visual['name_is_num']);
		}


		//validate format 

		if( !isset($data_visual['name_is_num']) ){
			unset($data_visual['format'][0]['divider']);
		}

		if ($data_visual['type'] !== 'pie') {
			unset($data_visual['pi']);
			unset($data_visual['name']);
			unset($data_visual['value']);

			$coordinates = ['x','y'];

			foreach($coordinates as $coordinate){
				//validate x
				switch($data_visual[$coordinate]['ticks']){
					case false:
						unset($data_visual[$coordinate]['ticks_amount']);
						unset($data_visual[$coordinate]['label']);
						unset($data_visual[$coordinate]['grid']);
						unset($data_visual[$coordinate]['grid_increment']);
					case true: //let false casecade to true too
						
						if( !isset($data_visual['name_is_num'])
							&& $data_visual[$coordinate]['data'] == 0
						){
							unset($data_visual[$coordinate]['min']);
							unset($data_visual[$coordinate]['max']);
							unset($data_visual[$coordinate]['ticks_amount']);
							// unset($data_visual[$coordinate]['divider']);
						}

						if(
							!isset($data_visual[$coordinate]['grid'])
							&& (
								!isset($data_visual[$coordinate]['ticks_amount'])
							)){

							unset($data_visual[$coordinate]['grid_increment']);
							
						}

						break;

				}
				
			}


			//no data means it fucks with the name. no need for legegends
			if( !isset($data_visual['key']['color']) || $data_visual['key']['color'] == null){
				unset($data_visual['color']['legend']);
			}

			if($data_visual['type'] !== 'line') {
				unset($data_visual['line']);
			}


			if($data_visual['type'] !== 'scatter') {
				unset($data_visual['area']);
			}

		}else{
			unset($data_visual['x'],$data_visual['y'],$data_visual['line'],$data_visual['color']['data']);
			// $data_visual['color']['legend'] = true;
		}

		//parse olors array is ugly lets make it pretty
		$data_palette_arr = array(); //place shit here3

		foreach($data_visual['color']['palette'] as $row){
			$data_palette_arr[] = $row['color'];
		}
		
		$data_visual['color']['palette'] = $data_palette_arr;


		return $data_visual;
		// return $data_visual;
	}
}