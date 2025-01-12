<template>
	<div :style="backgroundStyle" class="h-screen flex items-center justify-center">
		<div class="w-2/5">
			<SearchBar />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useConfigStore } from '@/stores/config';

const configStore = useConfigStore();
const backgroundStyle = ref({});

onMounted(async () => {
	const backgroundImage = await configStore.getCurrentBackgroundImage();
	console.log(backgroundImage);
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