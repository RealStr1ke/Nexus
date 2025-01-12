<template>
	<div>
		<label class="input input-bordered flex items-center gap-2 min-w-0 drop-shadow-lg shadow-lg">
			<button
				class="btn btn-ghost btn-sm"
				@click="performSearch"
			>
				<Icon
					:name="getSearchIcon"
					style="color: white"
					class="flex-none shrink-0"
				/>
			</button>
			<input
				v-model="searchQuery"
				type="text"
				class="search-input grow min-w-0"
				placeholder="Search"
				@keydown.enter="performSearch"
			>
		</label>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useConfigStore } from '@/stores/config';

const configStore = useConfigStore();
const searchQuery = ref('');

const getSearchIcon = computed(() => {
	const searchEngine = configStore.settings.search.defaultEngine;
	switch (searchEngine) {
		case 'google':
			return 'fa-brands:google';
		case 'bing':
			return 'fa-brands:microsoft';
		case 'duckduckgo':
			return 'logos:duckduckgo';
		case 'yahoo':
			return 'fa-brands:yahoo';
		case 'baidu':
			return 'simple-icons:baidu';
		case 'yandex':
			return 'simple-icons:yandex';
		default:
			return 'mdi:magnify';
	}
});

function performSearch() {
	const searchEngine = configStore.settings.search.defaultEngine;
	let searchUrl = '';


	switch (searchEngine) {
		case 'google':
			searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`;
			break;
		case 'bing':
			searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery.value)}`;
			break;
		case 'duckduckgo':
			searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery.value)}`;
			break;
		case 'yahoo':
			searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(searchQuery.value)}`;
			break;
		case 'baidu':
			searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`;
			break;
		case 'yandex':
			searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(searchQuery.value)}`;
			break;
		case 'custom':
			if (configStore.settings.search.selectedCustomEngine) {
				searchUrl = configStore.settings.search.selectedCustomEngine.replace('{query}', encodeURIComponent(searchQuery.value));
			}
			break;
		default:
			searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`;
			break;
	}

	window.location.href = searchUrl;
}
</script>

<style>

</style>
