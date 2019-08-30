<!-- DO NOT EDIT README.html. edit README.md instead -->
# Plugin Name: 1Point21 Data Vizualizer

Plugin URI: [https://github.com/samzabala](https://github.com/samzabala)  
Description: Data visualizer using d3 and svgs  
Version: 1.0.1  
Author: 1Point21 Interactive  
Author URI: [https://www.1point21interactive.com/](https://www.1point21interactive.com/)

# Table of contents

1. [Shortcode](#shortcode)]

2. [Shortcode Parameters](#shortcodeparameters)

2. [Backend Settings](#backendsettings)

3. [Functions](#functions)

# Shortcode

You can add a data visualizer using the shortcode `dv` or `data_visalizer`

Examples:

``` txt
[dv id=666 width=800 height=600]
```

``` txt
[data_visalizer id=666 width=800 height=600]
```

_**Note:** in case `dv` conflicts with another shortcode, the plugin will output an error in the back end and advise to use `data_visualizer`_

# Shortcode Parameters

*	**`id`**

	**[ REQUIRED | Default: `null` | type: number ]**

	post id of the graph to display.

*	**`margin`**

	**[ optional | Default: `10` | type: number ]**

	gutter to set on graph canvas to compensate spaces for ticks and labels.

*	**`margin_offset`**

	**[ optional | Default: `2` | type: number ]**

	multiplier of the gutter.

*	**`width`**

	**[ optional | Default: `600` | type: number ]**

	width of canvas. if graph spacing has small spacing or font sizes look too big, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.

*	**`height`**

	**[ optional | Default: `600` | type: number ]**

	height canvas. if graph spacing has small spacing or font sizes look too big, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.

*	**`transition`**

	**[ optional | Default: `1500` | type: number ]**

	how long should all animations or transitions take

*	**`delay`**

	**[ optional | Default: `250` | type: number ]**

	delay of rendering the graph. useful in case there is a script that needs to load before the graph rendering

*	**`font_size`**

	**[ optional | Default: `'16px'` | type: integer / string ]**

	base font size to size text relative to. also accepts integer value.

# Backend Settings

## Description

**[ optional | Default: `''` ]**

Add a subtilte or description for the data visual

## Data Settings

###	*Type*

**[ REQUIRED | Default: *Bar* (`bar`) | options: *Line* (`line`), *Pie* (`pie`), *Scatter plot* (`scatter`) ]**

Type of graph the data will be presented as.

###	*Source*

*	***Source Type***

	**[ REQUIRED | options: *File (csv,tsv)* (`file`), *URL* (`url`), *Text (JSON code)* (`text`), *Rows (UI Field)* (`rows`) ]**

	Type of source on how the data will be imported. (For not accepted files are json,csv,tsv)

	depending on set option, one of the fields below for data input will be shown.

	*	***File***

		**[ REQUIRED | Valid file types: `csv`, `tsv` | Available when: *Source Type* is `file` ]**

		Input directly from the media library. 

		_**Note:** JSON is not allowed through this method for security_
	
	*	***URL (url)***

		**[ REQUIRED | Valid file types: `csv`, `tsv`, `json` | Available when: *Source Type* is `url` ]**

		Input data through an external file's url
	
	*	***Text (JSON code)***

		**[ REQUIRED | Valid file types: `json` | Available when: *Source Type* is `text` ]**

		Input through the data in json format through a textbox. recommended for a more customized and controlled data
	
	*	***Rows***

		**[ REQUIRED | Valid file types: Available when: *Source Type* is `rows` ]**

		Input via acf repeater fields. For each row there are available input fields
		
		*	***Name***

			**[ REQUIRED ]***

			Name for the data
		
		*	***Value***

			**[ REQUIRED ]***

			Value for the data
		
		*	***Category***

			**[ Optional | Available when: *Type* is set to `bar`, `line`, `scatter` ]**

			Category value to represent the color the data
		
		*	***Plot Point Area***

			**[ Optional | Available when: *Type* is set to `scatter` ]**

			Numeric data value that will influence the size of the scatter plot point
		
*	**Source Key**

	**[ optional | Valid file types: Available when: *Source Type* is `file`, `url`, `text` ]**

	object key to the data to use.

	if left blank, data will be taken from the root level

	if there is a value, the data returned from that key will be used
	

### *Data Keys*

*	***Name Key***

	**[ REQUIRED | Available when: *Source Type* is `file`, `url`, `text` ]**

	Key relative to a datum instance's level to represent the data' name

*	***Value Key***

	**[ REQUIRED | Available when: *Source Type* is `file`, `url`, `text` ]**

	Key relative to a datum instance's level to represent the data's value

*	***Plot Points Area Key***

	**[ Optional | Available when: *Source Type* is `file`, `url`, `text`; *Type* is `scatter` ]**

	Key relative to a datum instance's level to represent the data's value

*	***Color Key***

	**[ Optional | Available when: *Source Type* is `file`, `url`, `text`; *Type* is NOT `pie` ]**

	Key relative to a datum instance's level to represent the data's value

### *Set Name Key As Numeric*

**[ Optional | Default: `false` | Available when: *Source Type* is `file`, `url`, `text`; *Type* is NOT `pie`, NOT `bar` ]**

Adds numeric capabilities to name data.

__**Note:** If name value is not numeric, this will cause errors and the graph will not render properly_


###	*Format Settings*

**[ Optional | Available for: `name`, `value`, `color` keys ]**

These are optional settings to allow reformatting data on the visualizer

*	***Prepend***

	**[ Optional | Default: `''` ]**

	Character/s to append to the data.

	_**Note:** Input will be translated as a parsed string_

* 	***Append***

	**[ Optional | Default: `''` ]**

	Character/s to append to the data.

	_**Note:** Input will be translated as a parsed string_

*	***Divider***

	**[ Optional | Default: `1` | Available for/when: `value` key; *Set Name Key As Numeric* is set to `true` ]**

	Amount to divide numeric data by. good for shortening values.
	
	For example, presenting `100000` as dollar value in thousands as `$100K`

	- `$` Comes from set *Prepend*
	- `100000` is divided by `Divider` set to `1000` to shorten to `100`
	- `K` comes from set *Append*

*	***Advanced***

	*	***Format Parameter***

		**[ Optional ]**

		Accepts a string that follows the format for [`d3.format()`](https://github.com/d3/d3-format#locale_format)

		Or a javascript function that passes the `data` and its `index`

	*	***More options will be added soon!***


## Graph Settings

### X and Y Settings

**[ Optional |  Available when: *Type* is `bar`,`line`,`scatter` ]**

*	***Axis Data***

	**[ REQUIRED | Default: *Name Data* (For X); *Value Data* (For Y); | options: *Name Data* (`0`), *Value Data* (`1`) ]**

	Links the data that will be represented along the axis

*	***Alignment***

	**[ REQUIRED | Default: *Bottom* (For X); *Left* (For Y); | options: *Top* (`top`), *Bottom* (`bottom`), *Left* (`left`), *Right* (`right`) ]**

	Alignment of the axis

*	***Use Ticks?***

	**[ Optional | Default: `false` ]**

	Insert ruler along the axis of alignment

*	***Label***

	**[ Optional ]**

	Text label along the axis

*	***Minimum***

	**[ Optional | Available when: *Axis Data* is *Value Data*; *Type* is *`scatter`*, *Axis Data* is *Name Data*, *Set Name Key As Numeric* is `true`; ]**

	Minimum value of the axis.

	Leaving blank will automatically set the minimum from the smallest value present in data


*	***Maximum***

	**[ Optional | Available when: *Axis Data* is *Value Data*; *Type* is *`scatter`*, *Axis Data* is *Name Data*, *Set Name Key As Numeric* is `true`; ]**

	Maximum value of the axis.

	Leaving blank will automatically set the maximum from the largest value present in data
	
	Recommended to increase if more negative space is desired

* ***Tick Settings***

	**[ Available when: *Use Ticks?* is `true` ]**

	* ***Ticks Amount***

