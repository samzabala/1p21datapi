<?php

/********************************************************************************************
* setting up documentation page
*********************************************************************************************/

//create documentation page + put it in the cpt dropdown

function _1p21_dv_render_documentation(){
	_1p21_dv_render_admin_page_template('documentation.html');
	?>
	<div class="wrap">
		<!-- add empty h2 for errors to output at because wordpress admin is weird -->
		<h2></h2>
		<div class="_1p21_dv-content">
			<?php
			include_once _1P21_DV_PLUGIN_PATH . 'templates/documentation.html';
			?>
		</div>
	</div>
	<?php
};
function _1p21_dv_add_documentation_link_to_cpt_dropdown(){
	// add_options_page(title, menu name, capability, slug, form callback);

	add_submenu_page(
		'edit.php?post_type=data-visual',
		__('1p21 Data Visualizer Documentation'),
		__('Documentation'),
		'edit_posts',
		'1p21-dv-documentation',
		function(){ return _1p21_dv_render_admin_page_template('documentation.html'); }
		);

}
add_action( 'admin_menu', '_1p21_dv_add_documentation_link_to_cpt_dropdown',11 );



//add doc link to plugin setting
add_filter('plugin_action_links_' . _1P21_DV_PLUGIN_BASENAME, '_1p21_dv_add_documentation_link_to_plugins');
function _1p21_dv_add_documentation_link_to_plugins( $links ) {
	echo 'shit';
	$links[] = '<a href="' .
	get_admin_url( null,'edit.php?post_type=data-visual&page=1p21-dv-documentation' ) .
		'">' . __('Documentation') . '</a>';
	return $links;
}

