<template>
	<div class="clock-container">
		<div class="time">
			{{ formattedTime }}
		</div>
		<div class="date">
			{{ formattedDate }}
		</div>
		<div class="greeting">
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

<style scoped>
.clock-container {
	text-align: center;
	margin-bottom: 0.5rem;
	text-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
}

.time {
	font-size: 6rem;
	font-weight: bold;
}

.date {
	font-size: 1.25rem;
	font-weight: bold;
	/* margin-top: 0.25rem; */
}

.greeting {
	font-size: 1rem;
	font-weight: bold;
	/* margin-top: 0.5rem; */
}
</style>