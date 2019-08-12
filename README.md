Plugin Name: 1Point21 Data Vizualizer
Plugin URI: https://www.1point21interactive.com/
Description: Data visualizer using d3 and svgs
Version: 1.0.0
Author: 1Point21 Interactive
Author URI: https://www.1point21interactive.com/
Github: https://github.com/samzabala



Hi. If you like graphs use this :)

# Shortcode Parameters



### id (REQUIRED | default: null | type: number),
    - post id of the graph to display
### margin (default: 10 | type: number),
    - gutter to set on graph canvas to compensate spaces for ticks and labels
### margin_offset (default: 2 | type: number),
    - multiplier of the gutter
### width (default: 600 | type: number),
    - dug
### height (default: 600 | type: number),
    - dug
### transition (default: 100 | type: number),
    - how long should all animations or transitions take
### delay (default: 500 | type: number),
    - delay of rendering the boi. useful in case there is a script that needs to load before the graph rendering




# Shortcode Parameters
### apply_filters( '_1p21_dv_info', boolean $debug )
- output array of the current data visuals on the page
