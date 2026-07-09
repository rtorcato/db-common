import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { GITHUB_PROFILE, copyright, projectFamilyItems } from '@rtorcato/shared-docs'
import { themes as prismThemes } from 'prism-react-renderer'

// The @rtorcato open-source family — sourced from @rtorcato/shared-docs so the
// list lives in one place. Surfaced as a navbar "Projects" dropdown (Docusaurus
// renders navbar items in the mobile menu too) and in the footer.
const PROJECT_FAMILY = projectFamilyItems()

const config: Config = {
	title: 'db-common',
	tagline: 'Shared, tree-shakeable TypeScript database utilities for the @rtorcato/* family.',
	favicon: 'img/logo.svg',

	url: 'https://rtorcato.github.io',
	baseUrl: '/db-common/',

	organizationName: 'rtorcato',
	projectName: 'db-common',

	onBrokenLinks: 'warn',

	markdown: {
		format: 'detect',
		hooks: {
			onBrokenMarkdownLinks: 'warn',
		},
	},

	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	headTags: [
		{
			tagName: 'link',
			attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
		},
		{
			tagName: 'link',
			attributes: {
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossorigin: 'anonymous',
			},
		},
	],

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					// Landing (src/pages/index.tsx) owns '/', docs live under '/docs'.
					routeBasePath: '/docs',
					editUrl: 'https://github.com/rtorcato/db-common/edit/main/apps/docs/',
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	plugins: [
		[
			'docusaurus-plugin-typedoc',
			{
				// Single barrel: TypeDoc resolves the whole public API from index.ts.
				entryPoints: ['../../src/index.ts'],
				tsconfig: '../../tsconfig.json',
				// The library typechecks on its own toolchain; skip TypeDoc's
				// redundant semantic check against the docs workspace's pinned TS.
				skipErrorChecking: true,
				out: 'docs/api',
				readme: 'none',
				includeVersion: false,
				excludePrivate: true,
				excludeInternal: true,
				excludeExternals: true,
				sort: ['source-order'],
				hidePageTitle: false,
				hideBreadcrumbs: false,
				sidebar: {
					// Let Docusaurus autogenerate the API sidebar from docs/api
					// (see sidebars.ts) rather than TypeDoc emitting a sidebar.cjs.
					autoConfiguration: false,
				},
			},
		],
		[
			'@easyops-cn/docusaurus-search-local',
			{
				hashed: true,
				indexDocs: true,
				indexBlog: false,
				docsRouteBasePath: '/docs',
				highlightSearchTermsOnTargetPage: true,
				searchBarShortcutHint: false,
			},
		],
	],

	themeConfig: {
		colorMode: {
			defaultMode: 'dark',
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: 'db-common',
			items: [
				{ to: '/docs', position: 'left', label: 'Docs' },
				{ to: '/docs/guides/installation', position: 'left', label: 'Guides' },
				{ to: '/docs/api', position: 'left', label: 'API' },
				{
					type: 'dropdown',
					label: 'Projects',
					position: 'left',
					items: [{ label: 'All on GitHub →', href: GITHUB_PROFILE }, ...PROJECT_FAMILY],
				},
				{
					href: 'https://github.com/rtorcato/db-common',
					label: 'GitHub',
					position: 'right',
				},
				{
					href: 'https://www.npmjs.com/package/@rtorcato/db-common',
					label: 'npm',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Documentation',
					items: [
						{ label: 'Overview', to: '/docs' },
						{ label: 'Installation', to: '/docs/guides/installation' },
						{ label: 'Usage', to: '/docs/guides/usage' },
						{ label: 'API reference', to: '/docs/api' },
						{ label: 'Changelog', to: '/docs/changelog' },
					],
				},
				{
					title: 'Resources',
					items: [
						{ label: 'GitHub', href: 'https://github.com/rtorcato/db-common' },
						{ label: 'npm', href: 'https://www.npmjs.com/package/@rtorcato/db-common' },
						{ label: 'Issues', href: 'https://github.com/rtorcato/db-common/issues' },
					],
				},
				{
					title: 'Projects',
					items: PROJECT_FAMILY,
				},
				{
					title: 'Community',
					items: [
						{ label: 'Issues', href: 'https://github.com/rtorcato/db-common/issues' },
						{
							label: 'License (MIT)',
							href: 'https://github.com/rtorcato/db-common/blob/main/LICENSE',
						},
						{ label: '@rtorcato', href: GITHUB_PROFILE },
					],
				},
			],
			copyright: copyright(),
		},
		prism: {
			theme: prismThemes.vsDark,
			darkTheme: prismThemes.vsDark,
			additionalLanguages: ['bash', 'json', 'typescript', 'sql'],
		},
	} satisfies Preset.ThemeConfig,
}

export default config
