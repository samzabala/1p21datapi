<div class="_1p21_dv-content">
    <h1>Data Visuals Settings</h1>

    <?php settings_errors(); ?>
    
    <form method="post" action="options.php"><!-- always use options.php when parsing options with WP -->
    <?php 
    //must match the name of the group from the register settings step. this associates the settings row to this form
    settings_fields( '_1p21_dv_options_group' ); 
    
    //get current values from DB to prefill the form (use the DB row name)
    $values = get_option( '_1p21_dv_opts' );
    ?>
    
    <!-- Optimize -->
    <h3>Optimize for performance</h3>
    <p>
        <label for="_1p21_dv-optimize">
            <input id="_1p21_dv-optimize" class="_1p21" type="checkbox" name="_1p21_dv_opts[dv_optimize]" <?= $values['dv_optimize'] == true ? 'checked' : '' ?> /> Optimize rendering for performance <em>(note: turning this one may cause script conflicts)</em>
        </label>
    </p>
    
    <hr class="form-foot-divider">
    
    <p class="submit">
        <input type="submit" value="Save Changes" class="button-primary" />
    </p>		
        
    </form>
</div>