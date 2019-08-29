<!-- DO NOT EDIT document.php. edit README.md instead -->

<h1 id="pluginname:1point21datavizualizer">Plugin Name: 1Point21 Data Vizualizer</h1>

<p>Plugin URI: <a href="https://github.com/samzabala">https://github.com/samzabala</a></p>

<p>Description: Data visualizer using d3 and svgs</p>

<p>Version: 1.0.1</p>

<p>Author: 1Point21 Interactive</p>

<p>Author URI: <a href="https://www.1point21interactive.com/">https://www.1point21interactive.com/</a></p>

<h2 id="tableofcontents">Table of contents</h2>

<ol>
<li><a href="#shortcodeparameters">Shortcode Parameters</a></li>
<li><a href="#backendsettings">Backend Settings</a></li>
<li><a href="#functions">Functions</a></li>
</ol>

<h2 id="shortcode">Shortcode</h2>

<p>You can add a data visualizer using the shortcode <code>dv</code> or <code>data_visalizer</code></p>

<p>Examples:</p>

<pre><code class="txt">[dv id=666 width=800 height=600]
</code></pre>

<pre><code class="txt">[data_visalizer id=666 width=800 height=600]
</code></pre>

<p><em><strong>Note:</strong> in case <code>dv</code> conflicts with another shortcode, the plugin will output an error in the back end and advise to use <code>data_visualizer</code></em></p>

<h2 id="shortcodeparameters">Shortcode Parameters</h2>

<p><strong><code>id</code></strong></p>

<blockquote>
<p><strong>(REQUIRED | default: <code>null</code> | type: number)</strong></p>

<p>post id of the graph to display.</p>
</blockquote>

<p><strong><code>margin</code></strong></p>

<blockquote>
<p><strong>( optional | default: <code>10</code> | type: number)</strong></p>

<p>gutter to set on graph canvas to compensate spaces for ticks and labels.</p>
</blockquote>

<p><strong><code>margin_offset</code></strong></p>

<blockquote>
<p><strong>( optional | default: 2 | type: number)</strong></p>

<p>multiplier of the gutter.</p>
</blockquote>

<p><strong><code>width</code></strong></p>

<blockquote>
<p><strong>( optional | default: <code>600</code> | type: number)</strong></p>

<p>width of canvas. if graph spacing has small spacing or font sizes look too big, the default canvas just isn&#8217;t enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.</p>
</blockquote>

<p><strong><code>height</code></strong></p>

<blockquote>
<p><strong>( optional | default: <code>600</code> | type: number)</strong></p>

<p>height canvas. if graph spacing has small spacing or font sizes look too big, the default canvas just isn&#8217;t enough space to display all the data visual elements with spacing. adjust until spacing of data is rendered as desired.</p>
</blockquote>

<p><strong><code>transition</code></strong></p>

<blockquote>
<p><strong>( optional | default: <code>1500</code> | type: number)</strong></p>

<p>how long should all animations or transitions take</p>
</blockquote>

<p><strong><code>delay</code></strong></p>

<blockquote>
<p><strong>( optional | default: <code>250</code> | type: number)</strong></p>

<p>delay of rendering the graph. useful in case there is a script that needs to load before the graph rendering</p>
</blockquote>

<p><strong><code>font_size</code></strong></p>

<blockquote>
<p><strong>( optional | default: <code>'16px'</code> | type: integer / string)</strong></p>

<p>base font size to size text relative to. also accepts integer value.</p>
</blockquote>

<h2 id="backendsettings">Backend Settings</h2>

<h3 id="description">Description</h3>

<blockquote>
<p><strong>( optional | default: <code>bar</code>)</strong></p>

<p>Add a subtilte or description for the data visual</p>
</blockquote>

<h3 id="datasettings">Data Settings</h3>

<h4 id="type">Type</h4>

<blockquote>
<p><strong>( default: <code>bar</code>)</strong><br />
how long should all animations or transitions take</p>
</blockquote>

<h4 id="source">Source</h4>

<p>**Source Type **</p>

<blockquote>
<p><strong>( REQUIRED | default: Bar (<code>bar</code>) | options: )</strong></p>

<p>Type of source on how the data will be imported. (For not accepted files are json,csv,tsv)</p>
</blockquote>

<p>available options:</p>

<ul>
<li>file - input directly from the media library. (Note: JSON is not allowed through this method due to Wordpress security reasons)</li>
<li>url - input data through a url</li>
<li>text - input through the data in json format through a textbox. recommended for a more customized and controlled data</li>
<li>rows - input via acf repeater fields</li>
</ul>

<p>depending on set option one of the appropriate REQUIRED fields for input will be shown.</p>

<ul>
<li>File</li>
<li>Url</li>
<li>Text</li>
<li>Rows</li>
</ul>

<h3 id="datasetup">Data Setup</h3>

<h4 id="sourcekey">Source key</h4>

<p>Key where the data to be used is stored. This is in case the loaded data could not be modified and is in one or two sublevels deep of the data requested</p>

<h4 id="namekey">Name Key</h4>

<p>data Key that will link the representation of each graph element. set relative to the instance of data</p>

<h4 id="valuekey">Value Key</h4>

<p>data Key that will link the representation of each graph element. set relative to the instance of data</p>

<h3 id="layout">Layout</h3>

<h4 id="typedefault:bar">Type (default: &#8216;bar&#8217;)</h4>

<p>what type of graph to visualize the data into. appropriate graph settings fields will appear for the set option</p>

<p>available options:</p>

<ul>
<li>Bar</li>
<li>Line (Not yet)</li>
<li>Pie (Not Yet)</li>
</ul>

<h4 id="xandysettings">X and Y Settings</h4>

<p>Only available for Bar and line graph. Each axis setting has the following fields</p>

<h5 id="axisdatadefault:namekeyxvaluekeyy">Axis Data (default: Name Key (x)| Value Key (y))</h5>

<p>Key that will represent the axis ( name key or value key)</p>

<p>options available:
*Name Key
*Value Key</p>

<h5 id="alignmentdefault:bottomxlefty">Alignment (default: Bottom (x), Left (y))</h5>

<p>which corner the axis or the graph elements offset from</p>

<h5 id="useticksdefault:false">Use Ticks (default: false)</h5>

<p>Whether to use a tick ruler for the axis</p>

<h5 id="label">Label</h5>

<p>Custom text label for the axis</p>

<h5 id="colorspalette">Colors Palette</h5>

<p>Scheme to color graphic items</p>

<h5 id="advancedsettings">Advanced Settings</h5>

<table>
<colgroup>
<col />
<col />
<col />
<col />
</colgroup>

<thead>
<tr>
	<th> Settings name </th>
	<th> Default </th>
	<th> Available Options </th>
	<th> Description </th>
</tr>
</thead>

<tbody>
<tr>
	<td> Ticks format </td>
	<td> '' </td>
	<td> n/a </td>
	<td> string or javascript function to format data </td>
</tr>
<tr>
	<td> Ticks amount </td>
	<td> '' </td>
	<td> n/a </td>
	<td> string or javascript function to set amount of data </td>
</tr>
<tr>
	<td> Minimum  </td>
	<td> null </td>
	<td> n/a </td>
	<td> number to minimum of axis </td>
</tr>
<tr>
	<td> Maximum  </td>
	<td> null </td>
	<td> n/a </td>
	<td> number to maximum of axis </td>
</tr>
</tbody>
</table>

<h4 id="linesettings">Line Settings</h4>

<p>Only available for Pie graph</p>

<h4 id="piesettings">Pie Settings</h4>

<h5 id="strokecolor">Stroke Color</h5>

<p>yes</p>

<h5 id="addplotpoints">Add Plot Points</h5>

<p>add a doot doot on a data instance</p>

<h3 id="advancedtab">Advanced Tab</h3>

<h2 id="functions">Functions</h2>
