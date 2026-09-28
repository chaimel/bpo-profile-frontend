<template>
	<div class="admin">
		<a href="#main-content" class="skip-link">Skip to content</a>

		<Sidebar
			:groups="adminNav"
			:open="is_menu_open"
			label="Platform admin"
			context="Platform admin"
			:user="{ name: user_name, role: 'Platform admin' }"
			@navigate="is_menu_open = false"
		/>

		<button
			v-if="is_menu_open"
			type="button"
			class="admin__backdrop"
			aria-label="Close navigation"
			@click="is_menu_open = false"
		/>

		<div class="admin__main">
			<Topbar
				:user="{ name: user_name, email: adminMe.email }"
				:menu-open="is_menu_open"
				@toggle-menu="is_menu_open = !is_menu_open"
			>
				<template #context>
					<MBadge tone="slate" icon="light-shield" size="sm">Platform admin</MBadge>
				</template>
			</Topbar>

			<main id="main-content" class="admin__content" tabindex="-1">
				<slot />
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Sidebar from '@/components/layout/panel/Sidebar.vue'
import Topbar from '@/components/layout/panel/Topbar.vue'

const { adminMe, adminNav } = useSessionStore()

const route = useRoute()
const is_menu_open = ref(false)
const user_name = `${adminMe.first_name} ${adminMe.last_name}`

watch(() => route.path, () => {
	is_menu_open.value = false
})
</script>

<style lang="scss" scoped>
.admin {
	min-height: 100vh;
	background: var(--canvas);

	&__main {
		margin-left: 264px;
		min-height: 100vh;
	}

	&__content {
		padding: 32px;

		&:focus {
			outline: none;
		}
	}

	&__backdrop {
		position: fixed;
		inset: 0;
		z-index: 45;
		background: var(--overlay);
	}
}

@media only screen and (max-width: 1024px) {
	.admin {
		&__main {
			margin-left: 0;
		}

		&__content {
			padding: 20px 16px 32px;
		}
	}
}
</style>
