import { computed, reactive } from 'vue'

// Module-scoped so every caller shares one registry of open overlays.
// MModal and MDrawer both open and close through it, and the body
// scroll lock follows whether anything is still open.
const open_modals = reactive(new Set<string>())

export function useModal() {
	function isOpen(name: string) {
		return open_modals.has(name)
	}

	function openModal(name: string) {
		open_modals.add(name)

		if (import.meta.client) document.body.classList.add('active')
	}

	function closeModal(name: string) {
		open_modals.delete(name)

		if (import.meta.client && open_modals.size === 0) {
			document.body.classList.remove('active')
		}
	}

	function toggleModal(name: string) {
		if (isOpen(name)) closeModal(name)
		else openModal(name)
	}

	function closeAll() {
		open_modals.clear()

		if (import.meta.client) document.body.classList.remove('active')
	}

	return {
		isOpen,
		openModal,
		closeModal,
		toggleModal,
		closeAll,
		openCount: computed(() => open_modals.size),
	}
}
