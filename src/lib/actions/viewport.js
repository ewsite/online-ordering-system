function viewport(node) {
	const monitorElementVisibility = (entries) => {
		entries.forEach((entry) => {
			node.dispatchEvent(new CustomEvent(entry.isIntersecting ? 'viewportin' : 'viewportout'));
		});
	};

	const elementObserver = new IntersectionObserver(monitorElementVisibility);

	elementObserver.observe(node);

	return {
		destroy() {
			node.removeEventListener('viewportin', null);
			node.removeEventListener('viewportout', null);
		}
	};
}

export default viewport;
