<?php

/********************************************************************************************
* global settings fields
*********************************************************************************************/

//whitelist our group of options so WP knows they exist
    function _1p21_dv_options_register(){
        //register_setting(name of group, DB entry,  validator callback)
        register_setting(
            '_1p21_dv_options_group',
            '_1p21_dv_opts',
            array(
                'sanitize_callback' => '_1p21_dv_options_validate',
                'default' => array(
                    'legacy_support'    => 'false'
                )
            )
        );	
    }
    add_action( 'admin_init', '_1p21_dv_options_register' );

//add the page to the admin menu to hold our form. do it when the world is ready for global settings
    function _1p21_dv_options_add_page(){
        //add_options_page(title, menu name, capability, slug, form callback);

        // add_options_page('Data Visualizer Settings', 'Data Visualizer Settings','manage_options', '1p21-dv-options-page', '_1p21_dv_options_build_form');
        
        if(function_exists('acf_add_options_sub_page') || function_exists('acf_add_local_field_group')){

            if(function_exists('acf_add_options_sub_page')){
                acf_add_options_sub_page(array(
                    'capability'	=> 'edit_posts',
                    'redirect'		=> false,
                    'page_title' 	=> 'Data Visualizer Settings (ACF)',
                    'menu_title' 	=> 'Data Visualizer Settings',
                    'menu_slug' 	=> '1p21-dv-settings',
                    'parent_slug' 	=> 'edit.php?post_type=data-visual',
                ));
            }

            
        }else{
            add_submenu_page('edit.php?post_type=data-visual','Data Visualizer Settings', 'Data Visualizer Settings','manage_options', '1p21-dv-settings', '_1p21_dv_options_build_form');
        }
    }
    add_action( 'admin_menu', '_1p21_dv_options_add_page',11 );


//add link
    add_filter('plugin_action_links_' . _1P21_DV_PLUGIN_BASENAME, '_1p21_dv_add_settings_link');
    function _1p21_dv_add_settings_link( $links ) {
        echo 'shit';
        $links[] = '<a href="' .
        get_admin_url( null,'edit.php?post_type=data-visual&page=1p21-dv-settings' ) .
            '">' . __('Settings') . '</a>';
        return $links;
    }


//Draw the form for the page (name must match callback above)
function _1p21_dv_options_build_form(){ ?>
    <div class="wrap">
        <h2>Data Visuals Settings</h2>
        <form method="post" action="options.php"><!-- always use options.php when parsing options with WP -->
        <?php 

        //must match the name of the group from the register settings step. this associates the settings row to this form
        settings_fields( '_1p21_dv_options_group' ); 
        
        //get current values from DB to prefill the form (use the DB row name)
        $values = get_option( '_1p21_dv_opts' );
        ?>
        
        
        <p>
            <label>
                <input type="checkbox" name="_1p21_dv_opts[legacy_support]" <?= $values['legacy_support'] == true ? 'checked' : '' ?> /> Enable Legacy Support
            </label>
        </p>
        
        yeet
        <p class="submit">
            <input type="submit" value="Save Changes" class="button-primary" />
        </p>		
            
        </form>
    </div>
<?php }


//validation
function _1p21_dv_options_validate($input){
    /*
    
    //remove all HTML, PHP, Mysql from some inputs
    $input['company_phone'] = wp_filter_nohtml_kses($input['company_phone']);
    $input['support_email'] = wp_filter_nohtml_kses($input['support_email']);
    $input['message_source'] = wp_filter_nohtml_kses($input['message_source']);
    
    //for fields with allowed HTML
    $allowed_tags = array(
        'br' => array(),
        'p' => array(),
        'em' => array(),
        'b' => array(),
        'strong' => array(),
        'i' => array(),
        'a' => array( //attributes allowed in this tag only:
            'href' => array(),
            'title' => array()
        )
    );
    //allow HTML in the address for line breaks
    $input['company_address'] = wp_kses( $input['company_address'], $allowed_tags );
    $input['welcome_message'] = wp_kses($input['welcome_message'], $allowed_tags );
    
    //checkbox validation. turn the value to zero if not checked
    $input['show_quote'] = ( $input['show_quote'] == 1 ? 1 : 0 );
    
    */

    $input['legacy_support'] = wp_filter_nohtml_kses($input['legacy_support']);

    return $input;
}