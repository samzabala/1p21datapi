<!-- DO NOT EDIT README.php. edit README.md instead -->
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

# Shortcode

You can add a data visualizer using the shortcode `dv` or `data_visualizer`

Examples:

``` txt
[dv id=666 width=800 height=600]
```

``` txt
[data_visualizer id=666 width=800 height=600]
```

_**Note:** in case `dv` conflicts with another shortcode, the plugin will output a warning and the shortcode will fallback to using only `data_visualizer`_

# Shortcode Parameters

<dl>
	<dt><strong><code>id</code></strong></dt>
	<dd><strong>[ REQUIRED | default: <code>null</code> | type: number ]</strong></dd>
	<dd>post id of the graph to display.</dd>
	<dt><strong><code>margin</code></strong></dt>
	<dd><strong>[ optional | default: <code>10</code> | type: number ]</strong></dd>
	<dd>gutter to set on graph canvas to compensate spaces for ticks and labels.</dd>
	<dt><strong><code>margin_offset</code></strong></dt>
	<dd><strong>[ optional | default: <code>2</code> | type: number ]</strong></dd>
	<dd>multiplier of the gutter.</dd>
	<dt><strong><code>width</code></strong></dt>
	<dd><strong>[ optional | default: <code>600</code> | type: number ]</strong></dd>
	<dd>width of canvas. if graph spacing has small spacing or font sizes look too big, the default canvas just isn&#8217;t enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.</dd>
	<dt><strong><code>height</code></strong></dt>
	<dd><strong>[ optional | default: <code>600</code> | type: number ]</strong></dd>
	<dd>height canvas. if graph spacing has small spacing or font sizes look too big, the default canvas just isn&#8217;t enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.</dd>
	<dt><strong><code>transition</code></strong></dt>
	<dd><strong>[ optional | default: <code>1500</code> | type: number ]</strong></dd>
	<dd>how long should all animations or transitions take</dd>
	<dt><strong><code>delay</code></strong></dt>
	<dd><strong>[ optional | default: <code>250</code> | type: number ]</strong></dd>
	<dd>delay of rendering the graph. useful in case there is a script that needs to load before the graph rendering</dd>
	<dt><strong><code>font_size</code></strong></dt>
	<dd><strong>[ optional | default: <code>'16px'</code> | type: integer / string ]</strong></dd>
	<dd>base font size to size text relative to. also accepts integer value.</dd>
</dl>

# Backend Settings


<dl>
    <dt><strong>Description</strong></dt>
    <dd> <strong>[ optional | default: <code>''</code> ]</strong></dd>
    <dd> Add a subtilte or description for the data visual</dd>
</dl>

## Data Settings

<dl>
    <dt><strong>Type</strong></dt>
    <dd> <strong>[ REQUIRED | default: Bar (<code>bar</code>) | options: Line (<code>line</code>), Pie (<code>pie</code>), Scatter plot (<code>scatter</code>) ]</strong></dd>
    <dd> how long should all animations or transitions take</dd>
</dl>

### Source

<dl>
	<dt><strong>Source Type</strong></dt>
	<dd><strong>[ REQUIRED | options: File (csv,tsv) (<code>file</code>), URL (<code>url</code>), Text (JSON code) (<code>text</code>), Rows (UI Field) (<code>rows</code>) ]</strong></dd>
	<dd>Type of source on how the data will be imported. (For not accepted files are json,csv,tsv)</dd>
	<dd>depending on set option one of the appropriate REQUIRED fields for input will be shown.
		<dl>
			<dt></dt>
			<dt><strong>File</strong></dt>
			<dd><strong>[ REQUIRED | Valid file types: <code>csv</code>, <code>tsv</code> | Available when: <em>Source Type</em> is <code>file</code> ]</strong></dd>
			<dd>Input directly from the media library. <em>(Note: JSON is not allowed through this method for security)</em></dd>
			<dt><strong>URL (url)</strong></dt>
			<dd><strong>[ REQUIRED | Valid file types: <code>csv</code>, <code>tsv</code>, <code>json</code> | Available when: <em>Source Type</em> is <code>url</code> ]</strong></dd>
			<dd>Input data through an external file&#8217;s url</dd>
			<dt><strong>Text (JSON code)</strong></dt>
			<dd><strong>[ REQUIRED | Valid file types: <code>json</code> | Available when: <em>Source Type</em> is <code>text</code> ]</strong></dd>
			<dd>Input through the data in json format through a textbox. recommended for a more customized and controlled data</dd>
			<dt><strong>Rows</strong></dt>
			<dd><strong>[ REQUIRED | Valid file types: Available when: <em>Source Type</em> is <code>rows</code> ]</strong></dd>
			<dd>Input via acf repeater fields. For each row there are available input fields
				<dl>
					<dt><strong>Name</strong></dt>
					<dd><strong>[ REQUIRED ]</strong></dd>
					<dd>Name for the data</dd>
					<dt><strong>Value</strong></dt>
					<dd><strong>[ REQUIRED ]</strong></dd>
					<dd>Value for the data</dd>
					<dt><strong>Category</strong></dt>
					<dd><strong>[ Optional | Available when: <em>Type</em> is set to <code>bar</code>, <code>line</code>, or <code>scatter</code> ]</strong></dd>
					<dd>Category value to represent the color the data</dd>
					<dt><strong>Plot Point Area</strong></dt>
					<dd><strong>[ Optional | Available when: <em>Type</em> is set to <code>scatter</code> ]</strong></dd>
					<dd>Numeric data value that will influence the size of the scatter plot point</dd>
				</dl>
			</dd>
			<dt><strong>Source Key</strong></dt>
			<dd><strong>[ optional | Available when: <em>Source Type</em> is <code>file</code>, <code>url</code>, <code>text</code> ]</strong></dd>
			<dd>object key to the data to use.</dd>
			<dd>if left blank, data will be taken from the root level</dd>
			<dd>if there is a value, the data returned from that key will be used</dd>
		</dl>
	</dd>
</dl>

### Data Keys
**Name Key**
: ** [ REQUIRED ] **

#### Source key
Key where the data to be used is stored. This is in case the loaded data could not be modified and is in one or two sublevels deep of the data requested


#### Name Key
data Key that will link the representation of each graph element. set relative to the instance of data

#### Value Key
data Key that will link the representation of each graph element. set relative to the instance of data 



### Layout
#### Type (default: 'bar')
what type of graph to visualize the data into. appropriate graph settings fields will appear for the set option

available options:
* Bar
* Line (Not yet)
* Pie (Not Yet)

#### X and Y Settings
Only available for Bar and line graph. Each axis setting has the following fields

##### Axis Data (default: Name Key (x)| Value Key (y))
Key that will represent the axis ( name key or value key)

options available:
*Name Key
*Value Key

##### Alignment (default: Bottom (x), Left (y))
which corner the axis or the graph elements offset from


##### Use Ticks (default: false)
Whether to use a tick ruler for the axis

##### Label
Custom text label for the axis


##### Colors Palette
Scheme to color graphic items


##### Advanced Settings

| Settings name | Default | Available Options | Description  |
| ------------- | ------- | ----------------- | ------------ |
| Ticks format  | '' | n/a | string or javascript function to format data |
| Ticks amount  | '' | n/a | string or javascript function to set amount of data |
| Minimum       | null | n/a | number to minimum of axis |
| Maximum       | null | n/a | number to maximum of axis |


#### Line Settings
Only available for Pie graph


#### Pie Settings

##### Stroke Color
yes

##### Add Plot Points
add a doot doot on a data instance

### Advanced Tab

## Functions

