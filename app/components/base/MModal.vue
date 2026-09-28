<template>
	<ClientOnly>
		<Teleport to="body">
			<div
				v-show="is_open"
				v-bind="attrs"
				:class="['m-modal', `m-modal--${props.variant}`]"
				:style="{ zIndex: props.zIndex }"
				@keydown.esc="onEscape"
			>
				<div class="m-modal__backdrop" @click="onBackdrop" />

				<div
					ref="dialog"
					class="m-modal__dialog"
					role="dialog"
					aria-modal="true"
					:aria-labelledby="$slots['header'] ? header_id : undefined"
					tabindex="-1"
					:style="{ maxWidth: props.variant === 'full' ? 'none' : `${props.maxWidth}px` }"
				>
					<!-- caller owns the whole surface -->
					<slot v-if="props.variant === 'custom'" />

					<!-- alert: icon + short message + decision -->
					<template v-else-if="props.variant === 'alert'">
						<div class="m-modal__alert" :class="{ 'm-modal__alert--no-icon': !$slots['icon'] }">
							<span v-if="$slots['icon']" class="m-modal__alert-icon" :class="`m-modal__alert-icon--${props.tone}`">
								<slot name="icon" />
							</span>

							<div class="m-modal__alert-body">
								<MHeading v-if="$slots['header']" :id="header_id" variant="2" size="5" class="m-modal__alert-title">
									<slot name="header" />
								</MHeading>
								<slot v-if="$slots['content']" name="content" />
								<MText v-else size="medium" color="--text-secondary">
									<slot />
								</MText>
							</div>

							<MButtonIcon
								v-if="props.closable"
								class="m-modal__close"
								name="light-times"
								title="Close"
								variant="ghost"
								radius="full"
								@click="closeModal(props.name)"
							/>
						</div>

						<div v-if="$slots['footer']" class="m-modal__footer">
							<slot name="footer" />
						</div>
					</template>

					<!-- basic + full -->
					<template v-else>
						<div v-if="$slots['header']" class="m-modal__header">
							<MHeading :id="header_id" variant="2" size="4" class="m-modal__title">
								<slot name="header" />
							</MHeading>

							<MButtonIcon
								v-if="props.closable"
								class="m-modal__close"
								name="light-times"
								title="Close"
								variant="ghost"
								radius="full"
								@click="closeModal(props.name)"
							/>
						</div>

						<div v-if="$slots['content']" class="m-modal__content">
							<slot name="content" />
						</div>

						<div v-if="$slots['footer']" class="m-modal__footer">
							<slot name="footer" />
						</div>
					</template>
				</div>
			</div>
		</Teleport>
	</ClientOnly>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, useAttrs, useId, watch } from 'vue'
import MButtonIcon from './MButtonIcon.vue'
import MHeading from './MHeading.vue'
import MText from './MText.vue'

defineOptions({
	inheritAttrs: false,
})

interface Props {
	name: string
	closeOnBackdrop?: boolean
	variant?: 'basic' | 'alert' | 'full' | 'custom'
	// alert icon tone
	tone?: 'brand' | 'warning' | 'danger' | 'success'
	maxWidth?: number
	closable?: boolean
	zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
	closeOnBackdrop: true,
	variant: 'basic',
	tone: 'brand',
	maxWidth: 580,
	closable: true,
	zIndex: 9999,
})

const attrs = useAttrs()
const header_id = useId()
const { isOpen, closeModal } = useModal()

const dialog = ref<HTMLElement | null>(null)
let return_focus: HTMLElement | null = null

const is_open = computed(() => isOpen(props.name))

// Move focus into the dialog on open and hand it back on close.
watch(is_open, async (open) => {
	if (!import.meta.client) return

	if (open) {
		return_focus = document.activeElement as HTMLElement | null
		await nextTick()
		dialog.value?.focus()
		return
	}

	return_focus?.focus()
	return_focus = null
})

function onBackdrop() {
	if (!props.closeOnBackdrop) return
	if (is_open.value) closeModal(props.name)
}

function onEscape() {
	if (props.closable && is_open.value) closeModal(props.name)
}

// A modal unmounting while open would otherwise leave the scroll lock on.
onUnmounted(() => {
	if (is_open.value) closeModal(props.name)
})
</script>
