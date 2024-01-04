export default async (query: string = 'COORDINATE') => {
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

	for (let i = 0; i < foundNodes.length; i++) {
		const node = foundNodes[i];

		// get top-level parent
		let baseFrame = node.parent;

		// traverse up the tree until we find a page or frame
		while (
			baseFrame?.parent?.type !== 'PAGE' &&
			baseFrame?.parent?.type === 'FRAME'
		) {
			baseFrame = baseFrame?.parent;
		}

		// ensure we have a frame
		if (!results.nodes) results.nodes = {};
		if (!results.nodes[baseFrame.name]) results.nodes[baseFrame.name] = {};

		const id = node.name.slice(query.length);

		// store under page -> node -> stuff
		results.nodes[baseFrame.name][id] = {
			x: node.absoluteTransform[0][2] - baseFrame.absoluteTransform[0][2],
			y: node.absoluteTransform[1][2] - baseFrame.absoluteTransform[1][2],
			width: node.width,
			height: node.height,
			type: node.type,
		};
	}

	figma.ui.postMessage({ type: 'coordinated', results });

	return results;
};
