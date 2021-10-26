// Jest must be compiled. We are using babel for this.

module.exports = {
  presets: [
		['@babel/preset-env', {targets: {node: 'current'}}],
		['@babel/preset-typescript'],
	],
	plugins: [
		["@babel/plugin-transform-modules-commonjs"],
		["@babel/plugin-syntax-dynamic-import"],
	],
	ignore: ['node_modules/@babel/core/lib/config/files/import.js'],

}