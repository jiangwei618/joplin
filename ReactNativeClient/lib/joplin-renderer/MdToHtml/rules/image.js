// const Resource = require('lib/models/Resource.js');
const utils = require('../../utils');
const htmlUtils = require('../../htmlUtils.js');

function installRule(markdownIt, mdOptions, ruleOptions) {
	const defaultRender = markdownIt.renderer.rules.image;

	markdownIt.renderer.rules.image = (tokens, idx, options, env, self) => {
		const Resource = ruleOptions.ResourceModel;

		const token = tokens[idx];
		const src = utils.getAttr(token.attrs, 'src');

		if (!Resource.isResourceUrl(src) || ruleOptions.plainResourceRendering) return defaultRender(tokens, idx, options, env, self);

		const r = utils.imageReplacement(ruleOptions.ResourceModel, src, ruleOptions.resources, ruleOptions.resourceBaseUrl);
		if (typeof r === 'string') return r;

		if (r) {
			const titleStr = token.content.split('=')[0];
			if (token.content.split('=')[1]) {
				const width = token.content.split('=')[1].split('*')[0];
				const height = token.content.split('=')[1].split('*')[1];
				return `<p class="graph-img" style="text-align: center;"><img data-from-md ${htmlUtils.attributesHtml(Object.assign({}, r, { title: titleStr }))} style="width:${width};height:${height}" /></p> <p class="graph-text" style="text-align: center">图：${titleStr}</p>`;
			}
			return `<p class="graph-img" style="text-align: center;"><img data-from-md ${htmlUtils.attributesHtml(Object.assign({}, r, { title: titleStr }))}/></p> <p class="graph-text" style="text-align: center">图：${titleStr}</p>`;
		}

		return defaultRender(tokens, idx, options, env, self);
	};
}

module.exports = function(context, ruleOptions) {
	return function(md, mdOptions) {
		installRule(md, mdOptions, ruleOptions);
	};
};
