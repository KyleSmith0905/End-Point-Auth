// Jest must be compiled. We are using babel for this.

module.exports = {
  presets: [
		['@babel/preset-env', {targets: {node: 'current'}}],
		'@babel/preset-typescript'
	]
}