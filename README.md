<!-- DO NOT EDIT document.php. edit README.md instead -->
# Plugin Name: 1Point21 Data Vizualizer

Plugin URI: [https://github.com/samzabala](https://github.com/samzabala)

Description: Data visualizer using d3 and svgs

Version: 1.0.1

Author: 1Point21 Interactive

Author URI: [https://www.1point21interactive.com/](https://www.1point21interactive.com/)

## Table of contents

1. [Shortcode Parameters](#shortcodeparameters)
2. [Backend Settings](#backendsettings)
3. [Functions](#functions)

## Shortcode

You can add a data visualizer using the shortcode `dv` or `data_visalizer`

Examples:

``` txt
[dv id=666 width=800 height=600]
```

``` txt
[data_visalizer id=666 width=800 height=600]
```

_**Note:** in case `dv` conflicts with another shortcode, the plugin will output an error in the back end and advise to use `data_visualizer`_

## Shortcode Parameters

**`id`**  
> **(REQUIRED | default: `null` | type: number)**  
> post id of the graph to display.

**`margin`**  
> **( optional | default: `10` | type: number)**  
> gutter to set on graph canvas to compensate spaces for ticks and labels.

**`margin_offset`**  
> **( optional | default: 2 | type: number)**  
> multiplier of the gutter.

**`width`**  
> **( optional | default: `600` | type: number)**  
> width of canvas. if graph spacing has small spacing or font sizes look too big, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.

**`height`**  
> **( optional | default: `600` | type: number)**  
> height canvas. if graph spacing has small spacing or font sizes look too big, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.

**`transition`**  
> **( optional | default: `1500` | type: number)**  
> how long should all animations or transitions take

**`delay`**  
> **( optional | default: `250` | type: number)**  
> delay of rendering the graph. useful in case there is a script that needs to load before the graph rendering

**`font_size`**  
> **( optional | default: `'16px'` | type: integer / string)**  
> base font size to size text relative to. also accepts integer value.

## Backend Settings

### Description

> **( optional | default: `bar`)**  
> Add a subtilte or description for the data visual

### Data Settings

#### Type

> **( default: `bar`)**  
> how long should all animations or transitions take

#### Source

**Source Type **
> **( REQUIRED | default: Bar (`bar`) | options: )**  
> Type of source on how the data will be imported. (For not accepted files are json,csv,tsv)

available options:
* file - input directly from the media library. (Note: JSON is not allowed through this method due to Wordpress security reasons)
* url - input data through a url
* text - input through the data in json format through a textbox. recommended for a more customized and controlled data
* rows - input via acf repeater fields

depending on set option one of the appropriate  REQUIRED fields for input will be shown. 
* File
* Url
* Text
* Rows

### Data Setup 

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

