<template>
	<nav aria-label="Breadcrumb" :class="['m-breadcrumbs', `m-breadcrumbs--${props.variant}`]">
		<ol class="m-breadcrumbs__list">
			<li v-for="(item, index) in props.items" :key="`${index}-${item.label}`" class="m-breadcrumbs__item">
				<NuxtLink
					v-if="item.to && index < props.items.length - 1"
					:to="item.to"
					class="m-breadcrumbs__link"
				>
					{{ item.label }}
				</NuxtLink>
				<span v-else class="m-breadcrumbs__current" aria-current="page">{{ item.label }}</span>

				<MIcon
					v-if="index < props.items.length - 1"
					name="light-angle-right"
					size="xs"
					class="m-breadcrumbs__separator"
				/>
			</li>
		</ol>
	</nav>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '~/types/base/ui'
import MIcon from './MIcon.vue'

interface Props {
	items: BreadcrumbItem[]
	variant?: 'default' | 'inverse'
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'default',
})
</script>
