// Canonical link for an indexable page (docs/PLAN.md §7). Filtered and
// paginated views point at the unfiltered path: filter permutations are
// not landing pages (docs/API.md §3).
export function useCanonical(path: string) {
	const config = useRuntimeConfig()
	const href = path === '/' ? config.public.siteUrl : `${config.public.siteUrl}${path}`

	useHead({ link: [{ rel: 'canonical', href }] })

	return href
}
