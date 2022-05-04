import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import eslint from '@rollup/plugin-eslint';

export default {
	input: 'src/data-visualizer/js/dataVisualizer.js',
	output: {
		name: 'dataVisualizer',
		file: 'assets/js/dataVisualizer.umd.js',
		format: 'umd',
		sourcemap: true,
	},
	moduleContext: {
		this: 'window',
	},
	globals: {
		d3: 'd3',
		//   "d3-v6-tip": "d3"
	},
	onwarn: function (warning) {
		// Skip certain warnings
		// should intercept ... but doesn't in some rollup versions
		if (warning.code === 'THIS_IS_UNDEFINED') {
			return;
		}
		// console.warn everything else
		console.warn(warning.message);
	},
	plugins: [
		eslint(),
		babel({
			exclude: 'node_modules/**',
			babelHelpers: 'bundled',
		}),
		resolve({
			browser: true,
			modulesOnly: true,
		}),
		copy({
			targets: [
				//fonts
				//symbols
				{
					src: ['src/admin/js/script-admin.js'],
					dest: 'assets/js/',
				},
			],
			copyOnce: true,
		}),
	],
};
