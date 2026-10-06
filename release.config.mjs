import preset from '@rtorcato/repo-tooling/semantic-release/github'

// db-common is not published to npm yet (see ROADMAP v1.0). Keep the npm plugin
// for version bumping but disable publishing, which also skips the NPM_TOKEN
// check that was failing the release job. Drop this override (or set
// npmPublish: true) once the package is ready to publish.
//
// The preset also sets `labels: false` on @semantic-release/github, so failure
// issues are created unlabelled and the plugin opens a new one on every failed
// release (rtorcato/browser-common#194). Restore the label so it comments on the
// one issue instead.
export default {
	...preset,
	plugins: preset.plugins.map((p) => {
		const name = Array.isArray(p) ? p[0] : p
		if (name === '@semantic-release/npm') return ['@semantic-release/npm', { npmPublish: false }]
		if (name === '@semantic-release/github')
			return [name, { ...p[1], labels: ['semantic-release'] }]
		return p
	}),
}
