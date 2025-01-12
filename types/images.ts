export interface BackgroundImage {
	id?: string;
	name: string;
	src: string;
	credit?: string;
}

export const validateBackgroundImage = (image: unknown): image is BackgroundImage => {
	if (!image || typeof image !== 'object') return false;

	const requiredKeys: (keyof BackgroundImage)[] = [
		'id', 'name', 'src', 'credit',
	];

	return requiredKeys.every(key =>
		key in image && typeof (image as any)[key] === 'string',
	);
};
