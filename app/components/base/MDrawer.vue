<template>
	<ClientOnly>
		<Teleport to="body">
			<div
				v-show="is_open"
				:class="['m-drawer', `m-drawer--${props.side}`]"
				:style="{ zIndex: props.zIndex }"
				@keydown.esc="closeModal(props.name)"
			>
				<div class="m-drawer__backdrop" @click="closeModal(props.name)" />

				<div
					ref="panel"
					class="m-drawer__panel"
					role="dialog"
					aria-modal="true"
					:aria-labelledby="$slots['header'] ? header_id : undefined"
					tabindex="-1"
					:style="{ width: `min(${props.width}px, 100vw)` }"
				>
					<div v-if="$slots['header']" class="m-drawer__header">
						<MHeading :id="header_id" variant="2" size="5" class="m-drawer__title">
							<slot name="header" />
						</MHeading>
						<MButtonIcon
							name="light-times"
							title="Close"
							variant="ghost"
							radius="full"
							@click="closeModal(props.name)"
						/>
					</div>

					<div class="m-drawer__content">
						<slot />
					</div>

					<div v-if="$slots['footer']" class="m-drawer__footer">
						<slot name="footer" />
					</div>
				</div>
			</div>
		</Teleport>
	</ClientOnly>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, useId, watch } from 'vue'
import MButtonIcon from './MButtonIcon.vue'
import MHeading from './MHeading.vue'

interface Props {
	name: string
	side?: 'left' | 'right'
	width?: number
	zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
	side: 'right',
	width: 400,
	zIndex: 9998,
})

const header_id = useId()
const { isOpen, closeModal } = useModal()

const panel = ref<HTMLElement | null>(null)
let return_focus: HTMLElement | null = null

const is_open = computed(() => isOpen(props.name))

watch(is_open, async (open) => {
	if (!import.meta.client) return

	if (open) {
		return_focus = document.activeElement as HTMLElement | null
		await nextTick()
		panel.value?.focus()
		return
	}

	return_focus?.focus()
	return_focus = null
})

onUnmounted(() => {
	if (is_open.value) closeModal(props.name)
})
</script>
