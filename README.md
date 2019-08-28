# Plugin Name: 1Point21 Data Vizualizer

###### Plugin URI: https://www.1point21interactive.com/

###### Description: Data visualizer using d3 and svgs
###### Version: 1.0.0
###### Author: 1Point21 Interactive
###### Author URI: https://www.1point21interactive.com/
###### Github: https://github.com/samzabala



Hi. If you like graphs use this :)

## Shortcode Parameters




#### id (REQUIRED | default: null | type: number),
post id of the graph to display

#### margin (default: 10 | type: number),
gutter to set on graph canvas to compensate spaces for ticks and labels

#### margin_offset (default: 2 | type: number),
multiplier of the gutter

#### width (default: 600 | type: number),
width of canvas. if graph spacing seems broken, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired

#### height (default: 600 | type: number),
height canvas. if graph spacing seems broken, the default canvas just isn't enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired

#### transition (default: 1500 | type: number),
how long should all animations or transitions take

#### delay (default: 250 | type: number),
delay of rendering the boi. useful in case there is a script that needs to load before the graph rendering


## Backend Settings

### Source Tab

#### Source Type (REQUIRED)
Type of source on how the data will be imported. (For not accepted files are json,csv,tsv)

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
## Filters
#### apply_filters( '_1p21_dv_info', boolean $debug )
- output array of the current data visuals on the page
