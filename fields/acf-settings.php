<?php

$_1p21_dv_fields_settings = array(
	'key' => 'group_5d40bfc5e49db',
	'title' => 'Data Visualizer Settings',
	'fields' => array(
		array(
			'key' => 'field_5d40bfd2562be',
			'label' => 'Legacy Support',
			'name' => 'dv_legacy_support',
			'type' => 'true_false',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'message' => '',
			'default_value' => 0,
			'ui' => 0,
			'ui_on_text' => '',
			'ui_off_text' => '',
		),
		array(
			'key' => 'field_5d42155513d47',
			'label' => 'Optimize for performance',
			'name' => 'dv_optimize',
			'type' => 'text',
			'instructions' => 'Optimize rendering for performance (note: turning this one may cause script conflicts)',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
			'maxlength' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'options_page',
				'operator' => '==',
				'value' => '1p21-dv-settings',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => 1,
	'description' => '',
);
