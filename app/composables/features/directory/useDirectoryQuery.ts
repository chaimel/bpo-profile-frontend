import { computed } from 'vue'

type QueryPatch = Record<string, string | undefined>

// Directory filters live in the URL: shareable, crawlable, and a 1:1
// match for the API's query params (docs/API.md §3), so swapping the
// static search for the typed client changes nothing here.
export function useDirectoryQuery<K extends string>(keys: readonly K[]) {
	const route = useRoute()

	const params = computed(() => {
		const out: Partial<Record<K, string>> = {}
		for (const key of keys) {
			const value = route.query[key]
			if (typeof value === 'string' && value.trim()) out[key] = value
		}
		return out
	})

	const page = computed(() => {
		const value = Number(route.query.page)
		return Number.isInteger(value) && value > 0 ? value : 1
	})

	// Any filter change returns to page 1.
	function update(patch: QueryPatch) {
		const query: Record<string, string> = {}
		const merged: QueryPatch = { ...params.value, ...patch }

		for (const [key, value] of Object.entries(merged)) {
			if (value) query[key] = value
		}

		navigateTo({ path: route.path, query }, { replace: true })
	}

	function clear() {
		navigateTo({ path: route.path, query: {} }, { replace: true })
	}

	function pageLink(target: number) {
		const query: Record<string, string> = { ...params.value } as Record<string, string>
		if (target > 1) query.page = String(target)
		return { path: route.path, query }
	}

	return { params, page, update, clear, pageLink }
}
