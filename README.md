<!-- DO NOT EDIT OR REMOVE README.html. edit README.md instead -->
# Plugin Name: 1Point21 Data Vizualizer

Plugin URI: [https://github.com/samzabala](https://github.com/samzabala)  
Description: Data visualizer using d3 and svgs  
Version: 1.0.1  
Author: 1Point21 Interactive  
Author URI: [https://www.1point21interactive.com/](https://www.1point21interactive.com/)

# Table of contents

1. [Shortcode](#shortcode)
2. [Shortcode Parameters](#shortcodeparameters)
3. [Backend Settings](#backendsettings)
4. [Functions](#functions)
5. [Troubleshooting](#troubleshooting)
--------------------------
# Shortcode {#shortcode}

You can add a data visualizer using the shortcode `dv` or `data_visalizer`

Examples:

Using `dv`

	[dv id=666 width=800 height=600]

Using `data_visualizer`

	[data_visalizer id=666 width=800 height=600]


_**Note:** in case_ `dv` _conflicts with another shortcode, the plugin will output an error in the back end and advise to use_ `data_visualizer`

# Shortcode Parameters

*	**`id`**

	**[ REQUIRED | Default: `null` | type: number ]**

	post id of the graph to display.

*	**`margin`**

	**[ Optional | Default: `10` | type: number ]**

	gutter to set on graph canvas to compensate spaces for ticks and labels.

*	**`margin_offset`**

	**[ Optional | Default: `2` | type: number ]**

	multiplier of the gutter.

*	**`width`**

	**[ Optional | Default: `600` | type: number ]**

	width of canvas.

	Note that this setting will also act like an aspect ratio to ensure responsiveness. Size below 600 may not be recommended depending on the number of data to render
	
	if graph spacing has small spacing or font sizes look too big, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.

*	**`height`**

	**[ Optional | Default: `600` | type: number ]**

	height canvas.

	Note that this setting will also act like an aspect ratio to ensure responsiveness. Size below 600 may not be recommended depending on the number of data to render
	
	if graph spacing has small spacing or font sizes look too big, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.

*	**`transition`**

	**[ Optional | Default: `1500` | type: number ]**

	how long should all animations or transitions take

*	**`delay`**

	**[ Optional | Default: `250` | type: number ]**

	delay of rendering the graph. useful in case there is a script that needs to load before the graph rendering

*	**`font_size`**

	**[ Optional | Default: `'16px'` | type: number / string ]**

	css base font size to size all text relative to
	
	If given a number, it will be interpreted as to pixels.

# Backend Settings

## Description

**[ Optional | Default: `''` ]**

Add a subtilte or description for the data visual

## Data Settings

###	*Type*

**[ REQUIRED | Default: *Bar* | options: *Bar*, *Line*, *Pie*, *Scatter Plot* ]**

Type of graph the data will be presented as.

###	*Source*

*	**Source Type**

	**[ REQUIRED | options: 'File (csv,tsv)', 'URL', 'Text (JSON code)', 'Rows (UI Field)' ]**

	Type of source on how the data will be imported. (For not accepted files are json,csv,tsv)

	depending on set option, one of the fields below for data input will be shown.

	*	**File**

		**[ REQUIRED | Valid file types: `csv`, `tsv` | Available when: *Source Type* is 'File (csv,tsv)' ]**

		Input directly from the media library. 

		_**Note:** This input is available if *Tick Amount* is set JSON is not allowed through this method for security_
	
	*	**URL (url)**

		**[ REQUIRED | Valid file types: `csv`, `tsv`, `json` | Available when: *Source Type* is 'URL' ]**

		Input data through an external file's url
	
	*	**Text (JSON code)**

		**[ REQUIRED | Valid file types: `json` | Available when: *Source Type* is 'Text (JSON code)' ]**

		Input through the data in json format through a textbox. recommended for a more customized and controlled data
	
	*	**Rows**

		**[ REQUIRED | Valid file types: Available when: *Source Type* is 'Rows (UI Field)' ]**

		Input via acf repeater fields. For each row there are available input fields
		
		*	**Name**

			**[ REQUIRED ]**

			Name for the data
		
		*	**Value**

			**[ REQUIRED ]**

			Value for the data
		
		*	**Category**

			**[ Optional | Available when: *Type* is set to 'Bar', 'Line', 'Scatter Plot' ]**

			Category value to represent the color the data
		
		*	**Plot Point Area**

			**[ Optional | Available when: *Type* is set to 'Scatter Plot' ]**

			Numeric data value that will influence the size of the scatter plot point
		
*	**Source Key**

	**[ Optional | Default: `null` | Valid file types: Available when: *Source Type* is 'File (csv,tsv)', 'URL', 'Text (JSON code)' ]**

	object key to the data to use.

	if left blank, data will be taken from the root level

	if there is a value, the data returned from that key will be used
	

### *Data Keys*

*	**Name Key**

	**[ REQUIRED | Default: `null` | Available when: *Source Type* is 'File (csv,tsv)', 'URL', 'Text (JSON code)' ]**

	Key relative to a datum instance's level to represent the data' name

*	**Value Key**

	**[ REQUIRED | Default: `null` | Available when: *Source Type* is 'File (csv,tsv)', 'URL', 'Text (JSON code)' ]**

	Key relative to a datum instance's level to represent the data's value

*	**Plot Points Area Key**

	**[ Optional | Default: `null` | Available when: *Source Type* is 'File (csv,tsv)', 'URL', 'Text (JSON code)'; *Type* is 'Scatter Plot' ]**

	Key relative to a datum instance's level to represent the data's value

*	**Color Key**

	**[ Optional | Default: `null` | Available when: *Source Type* is 'File (csv,tsv)', 'URL', 'Text (JSON code)'; *Type* is NOT 'Pie' ]**

	Key relative to a datum instance's level to represent the data's value

### *Set Name Key As Numeric?*

**[ Optional | Default: `false` | Available when: *Source Type* is 'File (csv,tsv)', 'URL', 'Text (JSON code)'; *Type* is NOT 'Pie', NOT 'Bar' ]**

Adds numeric capabilities to name data.

__**Note:** This input is available if *Tick Amount* is set If name value is not numeric, this will cause errors and the graph will not render properly_


###	*Format Settings*

**[ Optional | Available for: `name`, `value`, `color` *keys* ]**

These are optional settings to allow reformatting data on the visualizer

*	**Prepend**

	**[ Optional | Default: `''` ]**

	Character/s to append to the data.

	_**Note:** This input is available if *Tick Amount* is set Input will be translated as a parsed string_

*	**Append**

	**[ Optional | Default: `''` ]**

	Character/s to append to the data.

	_**Note:** This input is available if *Tick Amount* is set Input will be translated as a parsed string_

*	**Divider**

	**[ Optional | Default: `1` | Available for/when: `value` key; *Set Name Key As Numeric?* is set to `true` ]**

	Amount to divide numeric data by. good for shortening values.
	
	For example, presenting `'100000'` as dollar value in thousands as `'$100K'`

	> `'$'` Comes from set *Prepend*
	>
	> `100000` is divided by `Divider` set to `1000` to shorten to `100`
	>
	> `'K'` comes from set *Append*

*	**Advanced**

	*	**Format Parameter**

		**[ Optional | Default: `null` ]**

		Accepts a string that follows the format for [`d3.format()`](https://github.com/d3/d3-format#locale_format)

		Or a javascript function that passes the `data` and its `index`

	*	**More options will be added soon!**


## Graph Settings

### X and Y Settings

**[ Optional | Available when: *Type* is 'Bar','Line','Scatter Plot' ]**

*	**Axis Data**

	**[ REQUIRED | Default: 'Name Data' (For X); 'Value Data' (For Y); | options: 'Name Data', 'Value Data' ]**

	Links the data that will be represented along the axis

*	**Alignment**

	**[ REQUIRED | Default: `Bottom` (For X); `Left` (For Y); | options: `Top`, `Bottom`, `Left`, `Right` ]**

	Alignment of the axis

*	**Use Ticks?**

	**[ Optional | Default: `false` ]**

	Insert ruler along the axis of alignment

*	**Label**

	**[ Optional | Default `null` ]**

	Text label along the axis

*	**Minimum**

	**[ Optional | Default: `null` | Available when: *Axis Data* is 'Value Data'; *Type* is 'Scatter Plot', *Axis Data* is 'Name Data', *Set Name Key As Numeric?* is `true`; ]**

	Minimum value of the axis.

	Leaving blank will automatically set the minimum from the smallest value present in data


*	**Maximum**

	**[ Optional | Default: `null` | Available when: *Axis Data* is 'Value Data'; *Type* is 'Scatter Plot', *Axis Data* is 'Name Data', *Set Name Key As Numeric?* is `true`; ]**

	Maximum value of the axis.

	Leaving blank will automatically set the maximum from the largest value present in data
	
	Recommended to increase if more negative space is desired

* **Tick Settings**

	**[ Available when: *Use Ticks?* is `true` ]**

	*	**Ticks Amount**

		**[ Optional | Default: `null` | Available when: *Use Ticks?* is `true` and *Axis Data* is 'Value Data' or *Type* is NOT 'Bar', *Axis Data* is 'Name Data', *Set Name Key As Numeric?* is `true`; ]**

		Number of ticks to display

		Leaving blank will allow the plugin to automatically set the amount based on the data given
	
	*	**Add Grid**

		**[ Optional | Default: `false` | Available when: *Axis Data* is 'Value Data' or *Type* is NOT 'Bar' ]**

		Enable grid along the axis

	*	**Grid Increment**

		**[ Optional | Default: `1` | Available when: *Add Grid?* is `true` and 'Ticks Amount' is NOT `null`]**

		Amount of grid rules each tick mark will be equal to.

		_**Note:** This field is available only if *Tick Amount* is set




### Line Settings

**[ Optional | Available when: *Type* is 'Line' ]**

*	**Line Style**

	**[ REQUIRED | Default : 'None' | Available Options: 'None','Curve','Step' ]**

	Style of the line graph

*	**Stroke Weight**

	**[ Optional | Default : `1` ]**

	Thickness of the line graph stroke

*	**Stroke Color**

	**[ Optional | Default : `null` ]**

	Color of the line graph

*	**Add Plot Points?**

	**[ Optional | Default : `false` ]**

	Enable plot points on the line graph

	Additional options become available once this is checked

*	**Add Area Fill?**

	**[ Optional | Default : `false` ]**

	Enable fill on the line graph

	Additional options become available once this is checked

*	**Plot Point Settings**

	**[ Available when: 'Add Plot Points?' is `true` ]**

	*	**Points Color**
		
		**[ Optional ]**

		Color of plot points

		If not set, the color of the points will be the same as set *Stroke Color*

		_**Note:** If 'Color Palette' has rows, this data will be overriden_

	*	**Size**
		
		**[ Optional ]**

		Size of plot points radius


*	**Area Settings**

	**[ Available when: 'Add Plot Points?' is `true` ]**

	*	**Color**

		**[ Optional ]**

		Color of the fill

		If not set, the fill will be the same as set *Stroke Color*

	*	**Opacity**

		**[ Optional | Default: `.5` ]**

		Opacity of the fill

	*	**Invert Axis?**

		**[ Optional | Default: `false` ]**

		Whether or not to invert the fill opposite to the alignment of the axis

*	Advanced

	*	**Dash Array**

		**[ Optional | Default: `null` ]**

		Set dashes on the line graph. The pattern is `dash, gap, dash, gap...`<br>

		Check [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray) For more information on the documentation
	
	*	**More options will be added soon!**

### Pie Settings

**[ Optional | Available when: *Type* is 'Pie' ]**

*	**Label Style**

	**[ Optional | Default: `false` ]**

	Whether or not to invert the fill opposite to the alignment of the axis


*	**Inner Radius**

	**[ Optional | Default: `0` ]**

	Radius of pie hole


### Scatter Plot Area Settings

**[ Optional | Available when: *Type* is 'Scatter Plot' ]**

*	**Minimum Radius**

	**[ Optional | Default: `10` ]**

	Minimum size of plot points

*	**Maximum Radius**

	**[ Optional | Default: `50` ]**

	Maximum size of plot points


*	**Opacity**

	**[ Optional | Default: `.8` ]**

	Opacity of plot points. Recommended to be below .9 as scatter plots will overlap


### Color Settings

*	**Color Palette**

	**[ Optional ]**

	Repeater field of colors to use for the data. The color will be used based on the datum instance's index

	If *Color Key* is not set and there are colors inputted, the colors will be applied based on the *Name Key* value of the data

	If not set, the plugin's loaded css will apply a default color palette

	Adding one color will apply the color to all graph elements

*	**Legend**

	**[ Optional | Default: `true` (when available) | Available when *Color Key* is set; *Type* is 'Pie`; *Category* in *Row* field has any value ]**

	Enable legend presentation of data

# Functions

*	**`get_data_visualizer($args = array(),$echo);`**

	Function to get html render of data visualizer as string

	*	**`$args`**

		**[ REQUIRED ]**

		Accepts arguments of the [shortcode parameters](#shortcodeparameters) in array format

	*	$echo

		**[ Optional | Default: `false` ]**

		Whether to output the html or return a string


*	**`the_data_visualizer($args = array());`**

	Function to output an existing data visualizer. Unlike `get_data_visualizer()` this function does not accept an echo parameter because duh.
		

# Settings


### Enable Optimization

Embeds scripts and stylesheets directly on the markup of the page to optimize performance. May cause script conflicts

# Troubleshooting

Good luck.