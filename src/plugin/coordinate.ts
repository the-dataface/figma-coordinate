export default async (query: string = 'COORDINATE') => {
	// wait for page to load
	await figma.currentPage.loadAsync();

	// stash nodes in object where key = node name and value = coordinate stuff
	const results: Results = {
		count: 0,
		nodes: {},
	};

	// nodes that match the query
	const foundNodes = figma.currentPage.findAll((node) =>
		node.name.startsWith(query)
	);

	results.count = foundNodes.length;

	const acceptableParents = new Set(['FRAME', 'SECTION', 'PAGE']);

	for (let i = 0; i < foundNodes.length; i++) {
		const node = foundNodes[i];

		// get top-level parent
		let baseFrame = node.parent;

		// traverse up the tree until we find a page or frame
		while (
			baseFrame?.parent?.type !== 'PAGE' &&
			(baseFrame?.type === 'FRAME' || baseFrame?.type === 'SECTION')
		) {
			baseFrame = baseFrame?.parent;
		}

		if (!baseFrame || !acceptableParents.has(baseFrame.type)) continue;

		// ensure we have a frame
		if (!results.nodes) results.nodes = {};
		if (!results.nodes?.[baseFrame.name]) results.nodes[baseFrame.name] = {};

		const id = node.name.slice(query.length);

		// store under page -> node -> stuff
		results.nodes[baseFrame.name][id] = {
			x: node.absoluteTransform[0][2] - baseFrame?.absoluteTransform[0][2],
			y: node.absoluteTransform[1][2] - baseFrame?.absoluteTransform[1][2],
			width: node.width,
			height: node.height,
			type: node.type,
		};

		switch (node.type) {
			case 'TEXT': {
				results.nodes[baseFrame.name][id].characters = node.characters;
				results.nodes[baseFrame.name][id].opacity = node.opacity;

				results.nodes[baseFrame.name][id].textAlignment =
					node.textAlignHorizontal.toUpperCase() as Result['textAlignment'];

				// symbols are complicated, oof

				if (typeof node.fontName !== 'symbol') {
					const { family, style } = node.fontName as FontName;

					results.nodes[baseFrame.name][id].fontFamily = family;

					results.nodes[baseFrame.name][id].fontWeight = style.split(' ')[0];

					results.nodes[baseFrame.name][id].italic = style
						.toLowerCase()
						.includes('italic');
				}

				if (typeof node.fontSize !== 'symbol') {
					results.nodes[baseFrame.name][id].fontSize = node.fontSize;
				}

				if (
					typeof node.lineHeight !== 'symbol' &&
					node.lineHeight.unit !== 'AUTO'
				) {
					//  pixel value
					if (node.lineHeight.unit === 'PIXELS') {
						results.nodes[baseFrame.name][id].lineHeight =
							node.lineHeight.value;
					}

					// convert to pixels, if possible
					if (
						node.lineHeight.unit === 'PERCENT' &&
						typeof node.fontSize === 'number'
					) {
						results.nodes[baseFrame.name][id].lineHeight =
							(node.lineHeight.value / 100) * node.fontSize;
					}
				}

				if (typeof node.fills !== 'symbol' && node.fills[0].type === 'SOLID') {
					const { r, g, b } = node.fills[0].color;
					results.nodes[baseFrame.name][id].color = `rgb(${[r, b, g]
						.map((c) => Math.round(c * 255))
						.join(',')})`;
				}

				break;
			}

			case 'RECTANGLE': {
				results.nodes[baseFrame.name][id].isAsset = node.isAsset;
				break;
			}
		}
	}

	figma.ui.postMessage({ type: 'coordinated', results });

	return results;
};
