import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess'
/** @type {import('@sveltejs/kit').Config} */
const config = {
        adapter: adapter({
          runtime: 'nodejs18.x',
        }),
	preprocess: [preprocess({ postcss: true }), vitePreprocess()]
}

export default config
