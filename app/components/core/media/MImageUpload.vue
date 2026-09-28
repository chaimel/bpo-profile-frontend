<template>
	<div :class="['m-image-upload', `m-image-upload--${props.kind}`]">
		<div class="m-image-upload__row">
			<div class="m-image-upload__preview">
				<img v-if="preview" :src="preview" alt="" class="m-image-upload__img">
				<MAvatar v-else-if="props.kind === 'photo'" :name="props.name" size="xl" decorative />
				<MLogo v-else-if="props.kind === 'logo'" :name="props.name" size="lg" decorative />
				<span v-else class="m-image-upload__placeholder">
					<MIcon name="light-image" size="lg" />
				</span>
			</div>

			<div class="m-image-upload__controls">
				<MText size="small" weight="medium" class="m-image-upload__label">{{ props.label }}</MText>
				<div class="m-image-upload__buttons">
					<!-- the label is the button, so the native picker opens on click and Enter -->
					<label :for="props.id" class="m-button m-button--sm m-button--neutral m-image-upload__pick">
						<MIcon name="light-upload" size="xs" />
						{{ preview ? 'Replace image' : 'Upload image' }}
					</label>
					<input
						:id="props.id"
						ref="input"
						type="file"
						class="sr-only"
						accept="image/jpeg,image/png,image/webp"
						:aria-describedby="`${props.id}-rules`"
						@change="onFile"
					>
					<MButton v-if="preview" variant="ghost" size="sm" @click="remove">Remove</MButton>
				</div>
				<MText :id="`${props.id}-rules`" size="small" color="--text-muted" class="m-image-upload__rules">
					{{ props.rules }}
				</MText>
				<!-- matches the base inputs' error line, styled by the global .m-field-error -->
				<p v-if="error" class="m-field-error" role="alert">
					<MIcon name="light-exclamation-circle" size="xs" />
					{{ error }}
				</p>
			</div>
		</div>

		<MInput
			v-if="preview"
			:id="`${props.id}-alt`"
			:model-value="props.alt"
			:name="`${props.id}-alt`"
			:max-length="255"
			@update:model-value="emit('update:alt', $event)"
		>
			<template #label>Image description (alt text)</template>
			<template #hint>{{ alt_hint }}</template>
		</MInput>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

// Logo, cover or photo with its alt text. JPEG, PNG and WebP only; the
// API re-validates, re-encodes and strips metadata (docs/ARCHITECTURE.md §7).
interface Props {
	id: string
	kind: 'logo' | 'cover' | 'photo'
	label: string
	// used for the monogram placeholder
	name: string
	src?: string | null
	alt?: string | null
	rules?: string
}

const props = withDefaults(defineProps<Props>(), {
	src: null,
	alt: '',
	rules: 'JPEG, PNG or WebP, up to 5 MB.',
})

const emit = defineEmits<{
	(_e: 'update:alt', _value: string): void
	(_e: 'change', _file: File | null): void
}>()

const allowed_types = ['image/jpeg', 'image/png', 'image/webp']
const max_bytes = 5 * 1024 * 1024

const input = ref<HTMLInputElement | null>(null)
const local_url = ref<string | null>(null)
const removed = ref(false)
const error = ref('')

const preview = computed(() => local_url.value ?? (removed.value ? null : props.src))

const alt_hint = computed(() => {
	if (props.kind === 'photo') return 'For example: “Luis Cruz, smiling, in a navy blazer.”'
	if (props.kind === 'logo') return 'Usually just the company name followed by “logo”.'
	return 'Describe what the image shows, for people who can’t see it.'
})

function revoke() {
	if (local_url.value) URL.revokeObjectURL(local_url.value)
	local_url.value = null
}

function onFile(event: Event) {
	const file = (event.target as HTMLInputElement).files?.[0]
	error.value = ''
	if (!file) return

	if (!allowed_types.includes(file.type)) {
		error.value = 'That file type isn’t supported. Choose a JPEG, PNG or WebP image.'
		return
	}
	if (file.size > max_bytes) {
		error.value = 'That image is larger than 5 MB. Choose a smaller file.'
		return
	}

	revoke()
	local_url.value = URL.createObjectURL(file)
	removed.value = false
	emit('change', file)
}

function remove() {
	revoke()
	removed.value = true
	if (input.value) input.value.value = ''
	emit('change', null)
}

onBeforeUnmount(revoke)
</script>

<style lang="scss" scoped>
.m-image-upload {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__row {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	&__preview {
		display: grid;
		place-items: center;
		flex: 0 0 auto;
		overflow: hidden;
		background: var(--canvas);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	&--photo &__preview {
		width: 96px;
		height: 96px;
		border-radius: 50%;
	}

	&--logo &__preview {
		width: 96px;
		height: 96px;
		border-radius: 22%;
	}

	&--cover {
		.m-image-upload__row {
			flex-direction: column;
			align-items: stretch;
		}

		.m-image-upload__preview {
			width: 100%;
			aspect-ratio: 4 / 1;
			border-radius: var(--radius-md);
		}
	}

	&__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	&__placeholder {
		color: var(--text-muted);
	}

	&__controls {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__label {
		font-family: var(--font-ui);
	}

	&__buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	&__pick {
		cursor: pointer;
	}

	// keyboard focus lands on the hidden input; show it on its label
	input:focus-visible + .m-image-upload__pick,
	&__buttons:has(input:focus-visible) .m-image-upload__pick {
		outline: 2px solid var(--brand);
		outline-offset: 2px;
	}
}
</style>
