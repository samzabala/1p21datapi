<?php
/********************************************************************************************
* Initialize post type
*********************************************************************************************/

add_action( 'init', '_1p21_dv_init_cpt' );
function _1p21_dv_init_cpt(){
    register_post_type(
        'data-visual',
        array(
            'menu_position' => 10,
            'public'        => false,
            'show_in_menu'  => true,
            'show_ui'       => true,
            'description'   => 'Data that is visually and interactively presented in the front end of the site',
            'menu_icon'     => 'dashicons-chart-bar',
            'hierchichal'   => false,
            'rewrite'       => array(
                'slug'      => 'data-visual'
            ),
            'supports'      => array(
                'title',
                'author',
                'revisions',
                'custom-fields'
            ),
            'labels' => array(
                'name'                      => _x( 'Data visuals', 'post type general name' ),
                'singular_name'             => _x( 'Data visual', 'post type singular name' ),
                'menu_name'                 => _x( 'Data visuals', 'admin menu' ),
                'name_admin_bar'            => _x( 'Data visual', 'add new on admin bar' ),
                'add_new'                   => _x( 'Add New', 'Data visual' ),
                'add_new_item'              => __( 'Add New data visual' ),
                'new_item'                  => __( 'New data visual' ),
                'edit_item'                 => __( 'Edit data visual' ),
                'view_item'                 => __( 'View data visual' ),
                'view_items'                => __( 'View data visuals' ),
                'all_items'                 => __( 'All data visuals' ),
                'search_items'              => __( 'Search data visuals' ),
                'not_found'                 => __( 'No data visuals found.' ),
                'not_found_in_trash'        => __( 'No data visuals found in trash.' ),
                'item_updated'              => __( 'Data visual updated.' ),
                'item_published'            => __( 'Data visualizer published' ),
                'item_published_privately'  => __( 'Data visualizer published privately' ),
                'archives'                  => __( 'Data visual archives.' ),
                'attributes'                => __( 'Data visual attributes' ),
                'insert_into_item'          => __( 'Insert into data visual' ),
                'uploaded_to_this_item'     => __( 'Upload to this data visual' )

            )
        )
    );


    remove_post_type_support( 'data-visual', 'editor' );

}


/********************************************************************************************
* Customize columns
*********************************************************************************************/


//make em columns
    function _1p21_dv_edit_cpt_col( $columns ) {

        $columns = array(
            'cb' => '&lt;input type="checkbox" />',
            'title' => __( 'Title' ),
            'id' => __( 'ID' ),
            'date' => __( 'Date' )
        );

        return $columns;
    }
    add_filter( 'manage_edit-data-visual_columns', '_1p21_dv_edit_cpt_col' );


// put content on them tall bois

    function _1p21_dv_cust_col( $column, $post_id ) {
        global $post;

        switch( $column ) {

            /* If displaying the 'duration' column. */
            case 'id' :
            echo '<b>'.$post->ID.'</b>';
            default :
                break;
        }
    }
    add_action( 'manage_data-visual_posts_custom_column', '_1p21_dv_cust_col', 10, 2 );

/********************************************************************************************
* FLUSH
*********************************************************************************************/
    function _1p21_dv_flush(){
        _1p21_dv_init_cpt();
        flush_rewrite_rules();
    }

    register_activation_hook( __FILE__, '_1p21_dv_flush' );


