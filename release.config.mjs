import preset from '@rtorcato/js-tooling/semantic-release/github'

// db-common is not published to npm yet (see ROADMAP v1.0). Keep the npm plugin
// for version bumping but disable publishing, which also skips the NPM_TOKEN
// check that was failing the release job. Drop this override (or set
// npmPublish: true) once the package is ready to publish.
export default {
	...preset,
	plugins: preset.plugins.map((p) =>
		(Array.isArray(p) ? p[0] : p) === '@semantic-release/npm'
			? ['@semantic-release/npm', { npmPublish: false }]
			: p
	),
}
