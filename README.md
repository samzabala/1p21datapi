<!-- DO NOT EDIT OR REMOVE documentation.php as this is compiled from README.md. README.md must be edited instead -->
# 1Point21 Data Vizualizer

Plugin URI: [https://github.com/samzabala/1p21datapi](https://github.com/samzabala/1p21datapi)  
Description: Data visualizer using d3 and svgs  
Version: 2.0.0 
Author: 1Point21 Interactive  
Author URI: [https://www.1point21interactive.com/](https://www.1point21interactive.com/)

## Table of contents

1. [Shortcode](#shortcode)
2. [Shortcode Parameters](#shortcodeparameters)
3. [Backend Settings](#backendsettings)
4. [Functions](#functions)
5. [Troubleshooting](#troubleshooting)
--------------------------
## Shortcode

You can add a data visualizer using the shortcode `dv` or `data_visualizer`

Examples:

###	Using `dv`
	
```
[dv id=666 width=800 height=600]
```
	
###	Using `data_visualizer`

```
[data_visalizer id=666 width=800 height=600]
```

_**Note:** in case_ `dv` _conflicts with another shortcode, the plugin will output an error in the back end and advise to use_ `data_visualizer`

## Shortcode Parameters

*	**`id`**

	**[ REQUIRED | Default: `null` | type: number ]**

	post id of the graph to display.
	

*	**`align`**

	**[ Optional | Default: `'center'` | type: string | options available: `'left'`,`'center'`,`'right'` ]**

	alignment of title and description

*	**`margin`**

	**[ Optional | Default: `10` | type: number,array ]**

	gutter to set on graph canvas to compensate space for ticks and labels.

	For multiple set margins, separate each margin with commas. The sequence of margins must replicate the [shorthand css margin property](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)

	eg:

	
	This will set all sides to 40

	```
	[dv id=666 margin=40]
	```

	This will set top and bottom sides to 40, and left and right sides to 60
	
	```
	[dv id=666 margin=40,60]
	```

*	**`width`**

	**[ Optional | Default: `600` | type: number ]**

	width of canvas.

	Note that this setting will also act like an aspect ratio to ensure responsiveness. Size below 600 may not be recommended depending on the number of data to render
	
	if graph has small spacing or font sizes look too big, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.

*	**`height`**

	**[ Optional | Default: `600` | type: number ]**

	height canvas.

	Note that this setting will also act like an aspect ratio to ensure responsiveness. Size below 600 may not be recommended depending on the number of data to render
	
	if graph has small spacing or font sizes look too big, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.


*	**`font_size`**

	**[ Optional | Default: `'16px'` | type: number / string ]**

	css base font size to size all text relative to
	
	If given a number, it will be interpreted as pixels.

*	**`transition`**

	**[ Optional | Default: `1500` | type: number ]**

	how long should all animations or transitions take

*	**`delay`**

	**[ Optional | Default: `250` | type: number ]**

	delay of rendering the graph.

## Backend Settings

### Description

**[ Optional | Default: `''` | Meta Key : `'dv_description'` ]**

Add a subtitle or description for the data visual

### Source Settings

####	*Multiple Graph*

**[ Optional | Meta Key : `'dv_src_multiple'` | Default: `false` | type: boolean ]**

Enable mutliple graphs of data groups setup

####	*Source*

*	**Source Type**

	**[ REQUIRED | Meta Key : `'dv_src'` | options: 'File (csv,tsv)', 'URL', 'Text (JSON code)', 'Rows (UI Field)' ]**

	Type of source on how the data will be imported. (For now, accepted files are json,csv,tsv,dsv)

	depending on set option, one of the fields below for data input will be shown.

	*	**File**

		**[ REQUIRED | Meta Key : `'dv_src_file'` | Valid file types: `csv`, `tsv` | Available when: *Source Type* is 'File (csv,tsv)' ]**

		Input directly from the media library. 

		_**Note:** JSON is not allowed through this method for security_
	
	*	**URL (url)**

		**[ REQUIRED | Meta Key : `'dv_src_url'` | Valid file types: `csv`, `tsv`, `json` | Available when: *Source Type* is 'URL' ]**

		Input data through an external file's url
	
	*	**Text (JSON code)**

		**[ REQUIRED | Meta Key : `'dv_src_text'` | Valid file types: `json` | Available when: *Source Type* is 'Text (JSON code)' ]**

		Input through the data in json format through a textbox. recommended for a more customized and controlled data
	
	*	**Rows**

		**[ REQUIRED | Meta Key : `'dv_src_row'` | Valid file types: Available when: *Source Type* is 'Rows (UI Field)' ]**

		Input via acf repeater fields. For each row there are available input fields
		
		*	**Name**

			**[ REQUIRED | Meta Key : `'dv_src_row_'.$index.'_0'` ]**

			Name for the data
		
		*	**Value**

			**[ REQUIRED | Meta Key : `'dv_src_row_'.$index.'_1'` ]**

			Value for the data
		
		*	**Category**

			**[ Optional | Meta Key : `'dv_src_row_'.$index.'_color'` | Available when: *Type* is set to 'Bar', 'Line', 'Scatter Plot' ]**

			Category value to represent the color the data
		
		*	**Plot Point Area**

			**[ Optional | Meta Key : `'dv_src_row_'.$index.'_area'` | Available when: *Type* is set to 'Scatter Plot' ]**

			Numeric data value that will influence the size of the scatter plot point
	
*	**Source Key**

	**[ Optional | Meta Key : `'dv_src_key'` | Default: `null` | Valid file types: Available when: *Source Type* is NOT 'Rows (UI Field)' ]**

	object key to the data to use.

	if left blank, data will be taken from the root level

	if there is a value, the data returned from that key will be used
	
*	**Multiple Source Key**

	**[ Optional | Meta Key : `'dv_src_key_multiple'` | Default: `null` | Valid file types: Available when: *Source Type* is NOT 'Rows (UI Field)', *Multiple Graph* is `true` ]**

	object key to the data to use.

	if left blank, data will be taken from the root level

	if there is a value, the data returned from that key will be used
	
### Data Settings

####	*Type*

**[ REQUIRED | Default: *Bar* | Meta Key : `'dv_type'` | options: *Bar*, *Line*, *Pie*, *Scatter Plot* ]**

Type of graph the data will be presented as.

#### *Data Keys*

**[ Available when: *Source Type* is NOT 'Rows (UI Field)' ]**

*	**Name Key**

	**[ REQUIRED  | Meta Key : `'dv_key_0'` | Default: `null` ]**

	Key relative to a datum instance's level to represent the data' name

*	**Value Key**

	**[ REQUIRED  | Meta Key : `'dv_key_1'` | Default: `null` ]**

	Key relative to a datum instance's level to represent the data's value

*	**Plot Points Area Key**

	**[ Optional | Meta Key : `'dv_key_area'` | Default: `null` | Available when: *Type* is 'Scatter Plot' ]**

	Key relative to a datum instance's level to represent the data's value

*	**Color Key**

	**[ Optional | Meta Key : `'dv_key_color'` | Default: `null` | *Type* is NOT 'Pie' ]**

	Key relative to a datum instance's level to represent the data's value


#### *Reverse Settings*

Check or set to true the following you would like to reverse order of


*	**Reverse Name Order**

	**[ Optional | Meta Key : `'dv_reverse_0'` | Default: `false` | type: boolean | Available When: *Multiple Graph* is `true` ]**

*	**Reverse Value Order**

	**[ Optional | Meta Key : `'dv_reverse_1'` | Default: `false` | type: boolean | Available When: *Multiple Graph* is `true` ]**

*	**Reverse Multiple Data Order**

	**[ Optional | Meta Key : `'dv_reverse_multiple'` | Default: `false` | type: boolean | Available When: *Multiple Graph* is `true` ]**

	Reverse order of data groups

#### *Set Name Key As Numeric?*

**[ Optional | Meta Key : `'dv_name_is_num'` | Default: `false` | *Type* is 'Line', 'Scatter' ]**

Adds numeric capabilities to name data.

__**Note:** If the data for the name data key is not numeric, this will cause errors and the graph will not render properly_


####	*Format Settings*

**[ Optional | Available for: `name`, `value`, `color` *keys* ]**

These are optional settings to allow reformatting data on the visualizer

*	**Prepend**

	**[ Optional | Meta Key : `'dv_format_'.$data_key.'_prepend'` | Default: `''` ]**

	Character/s to append to the data.

	_**Note:** Input will be translated as a parsed string_

*	**Append**

	**[ Optional | Meta Key : `'dv_format_'.$data_key.'_append'` | Default: `''` ]**

	Character/s to append to the data.

	_**Note:** Input will be translated as a parsed string_

*	**Divider**

	**[ Optional | Meta Key : `'dv_format_'.$data_key.'_divider'` | Default: `1` | Available for/when: `value` key; *Set Name Key As Numeric?* is set to `true` ]**

	Amount to divide numeric data by. good for shortening values.
	
	For example, presenting `'100000'` as dollar value in thousands as `'$100K'`

	> `'$'` Comes from set **Prepend**
	>
	> `100000` is divided by **Divider** set to `1000` to shorten to `100`
	>
	> `'K'` comes from set **Append**

*	**Advanced**

	*	**Format Parameter**

		**[ Optional | Meta Key : `'dv_format_'.$data_key.'_parameter'` | Default: `null` ]**

		Accepts a string that follows the format for [`d3.format()`](https://github.com/d3/d3-format#locale_format)

		Or a javascript function that passes the `data` and its `index`

		```
		function(data,index) {
			//format and declare returned formatted data here
		}
		```

	*	**More options will be added soon!**


### Graph Settings

#### X and Y Settings

**[ Optional | Available when: *Type* is 'Bar','Line','Scatter Plot' ]**

*	**Axis Data**

	**[ REQUIRED | Meta Key : `'dv_'.$axis.'_data'` | Default: 'Name Data' (For X); 'Value Data' (For Y); | options: 'Name Data', 'Value Data' ]**

	Links the data that will be represented along the axis

*	**Alignment**

	**[ REQUIRED | Meta Key : `'dv_'.$axis.'_align'` | Default: 'Bottom' (For X); 'Left' (For Y); | options: 'Top', 'Bottom', 'Left', 'Right' ]**

	Alignment of the axis

*	**Use Ticks?**

	**[ Optional | Meta Key : `'dv_'.$axis.'_ticks'` | Default: `false` ]**

	Insert ruler along the axis of alignment

*	**Label**

	**[ Optional | Meta Key : `'dv_'.$axis.'_label'` | Default `null` ]**

	Text label along the axis

*	**Minimum**

	**[ Optional | Meta Key : `'dv_'.$axis.'_min'` | Default: `null` | Available when: *Axis Data* is 'Value Data'; *Type* is 'Scatter Plot', *Axis Data* is 'Name Data', *Set Name Key As Numeric?* is `true` ]**

	Minimum value of the axis.

	Leaving blank will automatically set the minimum from the smallest value present in data


*	**Maximum**

	**[ Optional | Meta Key : `'dv_'.$axis.'_max'` | Default: `null` | Available when: *Axis Data* is 'Value Data'; *Type* is 'Scatter Plot', *Axis Data* is 'Name Data', *Set Name Key As Numeric?* is `true`; ]**

	Maximum value of the axis.

	Leaving blank will automatically set the maximum from the largest value present in data
	
	Recommended to increase if more negative space is desired

* **Tick Settings**

	**[ Available when: *Use Ticks?* is `true` ]**

	*	**Ticks Amount**

		**[ Optional | Meta Key : `'dv_'.$axis.'_ticks_amount'` | Default: `null` | Available when: *Use Ticks?* is `true` and *Axis Data* is 'Value Data' OR *Type* is NOT 'Bar', *Axis Data* is 'Name Data', *Set Name Key As Numeric?* is `true` OR *Type* is 'Scatter',*Set Name Key As Numeric?* is `true`, *Axis Data* is NOT 'Value Data' ]**

		Number of ticks to display

		Leaving blank will automatically set the amount based on the data given
	
	*	**Add Grid**

		**[ Optional | Meta Key : `'dv_'.$axis.'_grid'` | Default: `false` | Available when: *Axis Data* is 'Value Data' or *Type* is NOT 'Bar' ]**

		Enable grid along the axis

	*	**Grid Increment**

		**[ Optional | Meta Key : `'dv_'.$axis.'_increment'` | Default: `1` | Available when: *Add Grid?* is `true` and *Ticks Amount* is NOT `null` ]**

		Amount of grid rules each tick mark will be equal to.

		_**Note:** This field is available only if **Tick Amount** is set as the renderer needs a set amount of ticks to calculate the grid rules from_



#### Bar Settings


**[ Optional | Available when: *Type* is 'Bar' ]**

*	**Gutter**

	**[ REQUIRED | Meta Key : `'dv_bar_gutter'` | Default : '.1'  ]**

	amount of margin between bars

*	**Text within Bar**

	**[ REQUIRED | Meta Key : `'dv_bar_text_out'` | Default : 'True' ]**

	favors placing text inside of bar instead of outside.

	**NOTE:** if a bar item contains not enough space to place text within it, the text will be placed outside,
	While if this option is not checked, if there's not enough space outside of the bar item within the graph's space, the text will be displayed within the bar

	To override this, either the minimum or the maximum value if the number and maybe name data must be modified to create enough space


#### Line Settings

**[ Optional | Available when: *Type* is 'Line' ]**

*	**Line Style**

	**[ REQUIRED | Meta Key : `'dv_line_style'` | Default : 'None' | Available Options: 'None','Curve','Step' ]**

	Style of the line graph

*	**Stroke Weight**

	**[ Optional | Meta Key : `'dv_line_weight'` | Default : `1` ]**

	Thickness of the line graph stroke

*	**Stroke Color**

	**[ Optional | Meta Key : `'dv_line_color'` | Default : `null` ]**

	Color of the line graph

*	**Add Plot Points?**

	**[ Optional | Meta Key : `'dv_line_points'` | Default : `false` ]**

	Enable plot points on the line graph

	Additional options become available once this is checked

*	**Add Area Fill?**

	**[ Optional | Meta Key : `'dv_line_fill'` | Default : `false` ]**

	Enable fill on the line graph

	Additional options become available once this is checked

*	**Plot Point Settings**

	**[ Available when: 'Add Plot Points?' is `true` ]**

	*	**Points Color**
		
		**[ Optional | Meta Key : `'dv_line_points_color'` ]**

		Color of plot points

		If not set, the color of the points will be the same as set *Stroke Color*

		_**Note:** If **Color Palette** has rows, this data will be overriden_

	*	**Size**
		
		**[ Optional | Meta Key : `'dv_line_points_size'` ]**

		Size of plot points radius


*	**Area Settings**

	**[ Available when: 'Add Plot Points?' is `true` ]**

	*	**Color**

		**[ Optional | Meta Key : `'dv_line_fill_color'` ]**

		Color of the fill

		If not set, the fill will be the same as set *Stroke Color*

	*	**Opacity**

		**[ Optional | Meta Key : `'dv_line_fill_opacity'` | Default: `.5` ]**

		Opacity of the fill

	*	**Invert Axis?**

		**[ Optional | Meta Key : `'dv_line_fill_invert'` | Default: `false` ]**

		Whether or not to invert the fill opposite to the alignment of the axis

*	**Advanced**

	*	**Dash Array**

		**[ Optional | Meta Key : `'dv_line_dash'` | Default: `null` ]**

		Set dashes on the line graph. The pattern is `dash, gap, dash, gap...`<br>

		Check [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray) For more information on the documentation
	
	*	**More options will be added soon!**

#### Pie Settings

**[ Optional | Available when: *Type* is 'Pie' ]**

*	**Label Style**

	**[ Optional | Meta Key : `'dv_pi_label_style'` | Default: `false` ]**

	Whether or not to invert the fill opposite to the alignment of the axis


*	**Inner Radius**

	**[ Optional | Meta Key : `'dv_pi_in_radius'` | Default: `0` ]**

	Radius of pie hole


#### Scatter Plot Area Settings

**[ Optional | Available when: *Type* is 'Scatter Plot' ]**

*	**Minimum Radius**

	**[ Optional | Meta Key : `'dv_area_min'` | Default: `10` ]**

	Minimum size of plot points

*	**Maximum Radius**

	**[ Optional | Meta Key : `'dv_area_max'` | Default: `50` ]**

	Maximum size of plot points


*	**Opacity**

	**[ Optional | Meta Key : `'dv_area_opacity'` | Default: `.8` ]**

	Opacity of plot points. Recommended to be below .9 as scatter plots will overlap


#### Color Settings

*	**Color Palette**

	**[ Optional | Meta Key : `'dv_color_palette'`, `'dv_color_palette_'.$index.'_color'` for each color row ]**

	Repeater field of colors to use for the data. The color will be used based on the datum instance's index. 

	If *Color Key* is not set and there are colors inputted, the colors will be applied based on the *Name Key* value of the data

	If not set, the plugin's loaded css will apply a default color palette

	Adding one color will apply the color to all graph elements

*	**Legend**

	**[ Optional | Meta Key : `'dv_color_legend'` | Default: `true` (when available) | Available when *Color Key* is set; *Type* is 'Pie'; *Category* in *Row* field has any value ]**

	Enable legend presentation of data

#### Text Settings 

*	**`dv_text_name_size`**

	**[ Optional | Default: `.75` | type: number ]**

	Name data's relative size to `font_size` upon display. Will be interpeted as `em` css unit

	This is only visible when both name and data values are set up to display with the graph item

*	**`dv_text_value_size`**

	**[ Optional | Default: `1.75` | type: number ]**

	Value data's relative size to `font_size` upon display. Will be interpeted as `em` css unit

	This is only visible when both name and data values are set up to display with the graph item

*	**`dv_text_ticks_size`**

	**[ Optional | Default: `.75` | type: number ]**

	tick rule text's relative size to `font_size` upon display. Will be interpeted as `em` css unit

	This is only visible ticks are enabled

*	**`dv_text_legend_size`**

	**[ Optional | Default: `.75` | type: number ]**

	color legend text's relative size to `font_size` upon display. Will be interpeted as `em` css unit

	This is only visible legends are enabled


#### Tooltip Settings

*	**Enable Tooltip**

	**[ Optional | Meta Key : `'dv_tooltip_enable'` | Default: `false` ]**

	Whether or not to add tooltip functionality to your graph. When enabled, the following fields will be available as well

*	**Text Align**

	**[ Optional | Meta Key : `'dv_tooltip_text_align'` | Default: `'left'` ]**

	Alignment of tooltip text

*	**Width**

	**[ Optional | Meta Key : `'dv_tooltip_width'` | Default: `'auto'` ]**

	Set width of tooltip. Note that whatever set value this is, it cannot max out 80vw

*	**Advanced**

	*	**Direction**

		**[ Optional | Meta Key : `'dv_tooltip_direction'` | Default: `'n'` ]**

		Function or string that will be used by the `d3.tip.direction()` method. View documentation [https://github.com/caged/d3-tip/shape/master/docs/positioning-tooltips.md#tipdirection](Here)


	*	**Content**

		**[ Optional | Meta Key : `'dv_tooltip_content'` | Default: `null` ]**

		Function that will be used `by the d3.tip.html()` method. View documentation here: [https://github.com/caged/d3-tip/shape/master/docs/initializing-tooltips.md#d3tip](Here)


## Functions

*	**`get_data_visualizer($args = array(),$echo);`**

	Function to get html render of data visualizer as string

	*	**`$args`**

		**[ REQUIRED ]**

		Accepts arguments of the [shortcode parameters](#shortcodeparameters) in array format

	*	**$echo**

		**[ Optional | Default: `false` ]**

		Whether to output the html or return a string


*	**`the_data_visualizer($args = array());`**

	Function to output an existing data visualizer. Unlike `get_data_visualizer()` this function does not accept an echo parameter because duh.
		

## Settings

#### Enable Optimization

Embeds scripts and stylesheets directly on the markup of the page to optimize performance. May cause script conflicts

## Troubleshooting

Good luck.


# For Sam's Eyes only
[] shortcode modal admin weak
[] align labels opts