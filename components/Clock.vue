<template>
	<div class="text-center mb-3 shadow-lg backdrop-blur-lg bg-white/20 rounded-md">
		<div class="text-8xl font-bold drop-shadow-lg">
			{{ formattedTime }}
		</div>
		<div class="text-xl font-bold drop-shadow-lg">
			{{ formattedDate }}
		</div>
		<div class="text-base font-bold drop-shadow-lg mt-1">
			{{ greeting }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useConfigStore } from '@/stores/config';
import { getRandomGreeting } from '@/scripts/utils';

const configStore = useConfigStore();
const time = ref(new Date());

const updateTime = () => {
	time.value = new Date();
};

const formattedTime = computed(() => {
	const options: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: 'numeric',
		second: configStore.settings.datetime.showSeconds ? 'numeric' : undefined,
		hour12: configStore.settings.datetime.format === '12h',
	};
	return time.value.toLocaleTimeString([], options);
});

const formattedDate = computed(() => {
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZoneName: 'short',
	};
	return time.value.toLocaleDateString([], options);
});

const greeting = computed(() => getRandomGreeting());

onMounted(() => {
	const interval = setInterval(updateTime, 1000);
	onUnmounted(() => clearInterval(interval));
});
</script>
