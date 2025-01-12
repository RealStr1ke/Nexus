<template>
	<div
		:style="backgroundStyle"
		class="h-screen flex items-center justify-center"
	>
		<div class="w-2/5">
			<SearchBar />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useConfigStore } from '@/stores/config';

const configStore = useConfigStore();
const backgroundStyle = ref({});

watch(
	() => configStore.devBackgroundImagesLoaded,
	async (loaded) => {
		if (loaded) {
			const backgroundImage = configStore.getCurrentBackgroundImage();
			console.log('Current background image:', backgroundImage);
			if (backgroundImage) {
				backgroundStyle.value = {
					backgroundImage: `url(${backgroundImage.src})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				};
			}
		}
	},
);

onMounted(async () => {
	await new Promise<void>((resolve) => {
		if (configStore.devBackgroundImagesLoaded) {
			resolve();
			return;
		}
		const unwatch = watch(
			() => configStore.devBackgroundImagesLoaded,
			(loaded) => {
				if (loaded) {
					unwatch();
					resolve();
				}
			},
		);
		// configStore.loadDevBackgroundImages();
	});

	const backgroundImage = configStore.getCurrentBackgroundImage();
	if (backgroundImage) {
		backgroundStyle.value = {
			backgroundImage: `url(${backgroundImage.src})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
		};
	}

});
</script>

<style>
/* Add any custom styles here */
</style>