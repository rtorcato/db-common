import preset from '@rtorcato/repo-tooling/semantic-release/github'

// The preset sets `labels: false` on @semantic-release/github, so failure
// issues are created unlabelled and the plugin opens a new one on every failed
// release (rtorcato/browser-common#194). Restore the label so it comments on the
// one issue instead.
export default {
	...preset,
	plugins: preset.plugins.map((p) => {
		const name = Array.isArray(p) ? p[0] : p
		if (name === '@semantic-release/github')
			return [name, { ...p[1], labels: ['semantic-release'] }]
		return p
	}),
}
