<template>
	<div
		:style="backgroundStyle"
		class="h-screen flex flex-col justify-center items-center relative"
	>
		<div class="w-1/2">
			<ClockDate />
			<SearchBar />
		</div>
		<div
			v-if="artistCredit"
			class="absolute bottom-4 left-4 text-white text-sm shadow-lg drop-shadow-lg"
		>
			{{ artistCredit }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import Clock from '~/components/ClockDate.vue';

const configStore = useConfigStore();
const backgroundStyle = ref({});
const artistCredit = ref('');

onMounted(async () => {
	const backgroundImage = await configStore.getCurrentBackgroundImage();
	if (backgroundImage) {
		backgroundStyle.value = {
			backgroundImage: `url(${backgroundImage.src})`,
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
		};
		artistCredit.value = `Credit: ${backgroundImage.credit}`;
	}
});
</script>

<style>

</style>