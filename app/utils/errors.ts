// Errors thrown by pages.
import { createError } from '#app'

// A 404 whose message is written for people, so error.vue shows it.
// Nuxt's own "no route" 404 carries a technical message and no flag.
function notFound(message: string) {
	return createError({ status: 404, message, data: { friendly: true }, fatal: true })
}

export {
	notFound,
}
