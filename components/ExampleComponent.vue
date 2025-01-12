<template>
	<div>
		<button @click="setDarkTheme">
			Set Dark Theme
		</button>
		<button @click="setLightTheme">
			Set Light Theme
		</button>
	</div>
</template>

<script lang="ts" setup>
import { useConfigStore } from '@/stores/config';

const configStore = useConfigStore();

function setDarkTheme() {
	configStore.settings.theme.theme = 'dark';
	configStore.saveSettings();
}

function setLightTheme() {
	configStore.settings.theme.theme = 'light';
	configStore.saveSettings();
}
</script>
