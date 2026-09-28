// Location hierarchy (GET /api/locations): country -> region -> city,
// with a city also allowed directly under a country (docs/DATABASE.md
// §4.6). Countries with no providers still exist as served markets.
import type { LocationItem, LocationRef } from '~/types/features/directory'

const locations: LocationItem[] = [
	// --- Countries ---------------------------------------------
	{ id: 1, parent_id: null, type: 'country', name: 'Philippines', slug: 'philippines', iso_code: 'PH' },
	{ id: 2, parent_id: null, type: 'country', name: 'India', slug: 'india', iso_code: 'IN' },
	{ id: 3, parent_id: null, type: 'country', name: 'Colombia', slug: 'colombia', iso_code: 'CO' },
	{ id: 4, parent_id: null, type: 'country', name: 'Mexico', slug: 'mexico', iso_code: 'MX' },
	{ id: 5, parent_id: null, type: 'country', name: 'South Africa', slug: 'south-africa', iso_code: 'ZA' },
	{ id: 6, parent_id: null, type: 'country', name: 'Poland', slug: 'poland', iso_code: 'PL' },
	{ id: 7, parent_id: null, type: 'country', name: 'Jamaica', slug: 'jamaica', iso_code: 'JM' },
	{ id: 8, parent_id: null, type: 'country', name: 'Egypt', slug: 'egypt', iso_code: 'EG' },
	{ id: 9, parent_id: null, type: 'country', name: 'United States', slug: 'united-states', iso_code: 'US' },
	{ id: 10, parent_id: null, type: 'country', name: 'Kenya', slug: 'kenya', iso_code: 'KE' },
	{ id: 11, parent_id: null, type: 'country', name: 'United Kingdom', slug: 'united-kingdom', iso_code: 'GB' },
	{ id: 12, parent_id: null, type: 'country', name: 'Australia', slug: 'australia', iso_code: 'AU' },
	{ id: 13, parent_id: null, type: 'country', name: 'Canada', slug: 'canada', iso_code: 'CA' },
	{ id: 14, parent_id: null, type: 'country', name: 'Germany', slug: 'germany', iso_code: 'DE' },
	{ id: 15, parent_id: null, type: 'country', name: 'France', slug: 'france', iso_code: 'FR' },
	{ id: 16, parent_id: null, type: 'country', name: 'United Arab Emirates', slug: 'united-arab-emirates', iso_code: 'AE' },

	// --- Philippines -------------------------------------------
	{ id: 20, parent_id: 1, type: 'region', name: 'Metro Manila', slug: 'metro-manila', iso_code: null },
	{ id: 21, parent_id: 20, type: 'city', name: 'Manila', slug: 'manila', iso_code: null },
	{ id: 22, parent_id: 20, type: 'city', name: 'Makati', slug: 'makati', iso_code: null },
	{ id: 23, parent_id: 20, type: 'city', name: 'Taguig', slug: 'taguig', iso_code: null },
	{ id: 24, parent_id: 1, type: 'region', name: 'Central Visayas', slug: 'central-visayas', iso_code: null },
	{ id: 25, parent_id: 24, type: 'city', name: 'Cebu City', slug: 'cebu-city', iso_code: null },
	{ id: 26, parent_id: 1, type: 'region', name: 'Davao Region', slug: 'davao-region', iso_code: null },
	{ id: 27, parent_id: 26, type: 'city', name: 'Davao City', slug: 'davao-city', iso_code: null },

	// --- India -------------------------------------------------
	{ id: 30, parent_id: 2, type: 'region', name: 'Telangana', slug: 'telangana', iso_code: null },
	{ id: 31, parent_id: 30, type: 'city', name: 'Hyderabad', slug: 'hyderabad', iso_code: null },
	{ id: 32, parent_id: 2, type: 'region', name: 'Maharashtra', slug: 'maharashtra', iso_code: null },
	{ id: 33, parent_id: 32, type: 'city', name: 'Pune', slug: 'pune', iso_code: null },
	{ id: 34, parent_id: 32, type: 'city', name: 'Mumbai', slug: 'mumbai', iso_code: null },
	{ id: 35, parent_id: 2, type: 'region', name: 'Karnataka', slug: 'karnataka', iso_code: null },
	{ id: 36, parent_id: 35, type: 'city', name: 'Bengaluru', slug: 'bengaluru', iso_code: null },

	// --- Colombia ----------------------------------------------
	{ id: 40, parent_id: 3, type: 'region', name: 'Antioquia', slug: 'antioquia', iso_code: null },
	{ id: 41, parent_id: 40, type: 'city', name: 'Medellín', slug: 'medellin', iso_code: null },
	{ id: 42, parent_id: 3, type: 'city', name: 'Bogotá', slug: 'bogota', iso_code: null },

	// --- Mexico ------------------------------------------------
	{ id: 45, parent_id: 4, type: 'region', name: 'Baja California', slug: 'baja-california', iso_code: null },
	{ id: 46, parent_id: 45, type: 'city', name: 'Tijuana', slug: 'tijuana', iso_code: null },
	{ id: 47, parent_id: 4, type: 'region', name: 'Jalisco', slug: 'jalisco', iso_code: null },
	{ id: 48, parent_id: 47, type: 'city', name: 'Guadalajara', slug: 'guadalajara', iso_code: null },
	{ id: 49, parent_id: 4, type: 'city', name: 'Mexico City', slug: 'mexico-city', iso_code: null },

	// --- South Africa ------------------------------------------
	{ id: 50, parent_id: 5, type: 'region', name: 'Western Cape', slug: 'western-cape', iso_code: null },
	{ id: 51, parent_id: 50, type: 'city', name: 'Cape Town', slug: 'cape-town', iso_code: null },
	{ id: 52, parent_id: 5, type: 'region', name: 'Gauteng', slug: 'gauteng', iso_code: null },
	{ id: 53, parent_id: 52, type: 'city', name: 'Johannesburg', slug: 'johannesburg', iso_code: null },
	{ id: 54, parent_id: 5, type: 'region', name: 'KwaZulu-Natal', slug: 'kwazulu-natal', iso_code: null },
	{ id: 55, parent_id: 54, type: 'city', name: 'Durban', slug: 'durban', iso_code: null },

	// --- Poland ------------------------------------------------
	{ id: 60, parent_id: 6, type: 'region', name: 'Lesser Poland', slug: 'lesser-poland', iso_code: null },
	{ id: 61, parent_id: 60, type: 'city', name: 'Kraków', slug: 'krakow', iso_code: null },
	{ id: 62, parent_id: 6, type: 'region', name: 'Masovia', slug: 'masovia', iso_code: null },
	{ id: 63, parent_id: 62, type: 'city', name: 'Warsaw', slug: 'warsaw', iso_code: null },

	// --- Jamaica -----------------------------------------------
	{ id: 70, parent_id: 7, type: 'city', name: 'Kingston', slug: 'kingston', iso_code: null },
	{ id: 71, parent_id: 7, type: 'city', name: 'Montego Bay', slug: 'montego-bay', iso_code: null },

	// --- Egypt -------------------------------------------------
	{ id: 75, parent_id: 8, type: 'city', name: 'Cairo', slug: 'cairo', iso_code: null },
	{ id: 76, parent_id: 8, type: 'city', name: 'Alexandria', slug: 'alexandria', iso_code: null },

	// --- United States -----------------------------------------
	{ id: 80, parent_id: 9, type: 'region', name: 'Florida', slug: 'florida', iso_code: null },
	{ id: 81, parent_id: 80, type: 'city', name: 'Tampa', slug: 'tampa', iso_code: null },
	{ id: 82, parent_id: 9, type: 'region', name: 'Texas', slug: 'texas', iso_code: null },
	{ id: 83, parent_id: 82, type: 'city', name: 'San Antonio', slug: 'san-antonio', iso_code: null },

	// --- Kenya -------------------------------------------------
	{ id: 85, parent_id: 10, type: 'city', name: 'Nairobi', slug: 'nairobi', iso_code: null },
]

const countries = locations.filter(location => location.type === 'country')

function findLocation(id: number | null | undefined): LocationItem | undefined {
	if (id === null || id === undefined) return undefined
	return locations.find(location => location.id === id)
}

function findCountryBySlug(slug: string): LocationItem | undefined {
	return countries.find(country => country.slug === slug)
}

function childrenOf(id: number): LocationItem[] {
	return locations.filter(location => location.parent_id === id)
}

// The location itself plus everything below it. Geographic filters
// match a subtree (docs/API.md §3).
function subtreeIds(id: number): number[] {
	const ids = [id]
	for (const child of childrenOf(id)) ids.push(...subtreeIds(child.id))
	return ids
}

function countryOf(location: LocationItem): LocationItem {
	let current = location
	while (current.parent_id !== null) {
		const parent = findLocation(current.parent_id)
		if (!parent) break
		current = parent
	}
	return current
}

function regionOf(location: LocationItem): LocationItem | undefined {
	const parent = findLocation(location.parent_id)
	return parent?.type === 'region' ? parent : undefined
}

function toLocationRef(id: number): LocationRef {
	const location = findLocation(id)
	if (!location) throw new Error(`Unknown location ${id}`)
	return { id: location.id, name: location.name, country: countryOf(location).name }
}

export {
	locations,
	countries,
	findLocation,
	findCountryBySlug,
	childrenOf,
	subtreeIds,
	countryOf,
	regionOf,
	toLocationRef,
}
