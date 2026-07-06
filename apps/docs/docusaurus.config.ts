import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { themes as prismThemes } from 'prism-react-renderer'

// The @rtorcato open-source family. Surfaced as a navbar "Projects" dropdown
// (Docusaurus renders navbar items in the mobile menu too) and in the footer,
// so every sibling site cross-links to the rest. Keep in sync across repos.
const GITHUB_PROFILE = 'https://github.com/rtorcato'
const PROJECT_FAMILY = [
	{ label: 'js-common', href: 'https://rtorcato.github.io/js-common/' },
	{ label: 'api-common', href: 'https://rtorcato.github.io/api-common/' },
	{ label: 'browser-common', href: 'https://rtorcato.github.io/browser-common/' },
	{ label: 'db-common', href: 'https://rtorcato.github.io/db-common/' },
	{ label: 'cf-common', href: 'https://rtorcato.github.io/cf-common/' },
	{ label: 'react-common', href: 'https://github.com/rtorcato/react-common' },
	{ label: 'swift-common', href: 'https://rtorcato.github.io/swift-common/' },
	{ label: 'js-tooling', href: 'https://rtorcato.github.io/js-tooling/' },
]

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
			copyright: `Copyright © ${new Date().getFullYear()} Richard Torcato. Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.vsDark,
			darkTheme: prismThemes.vsDark,
			additionalLanguages: ['bash', 'json', 'typescript', 'sql'],
		},
	} satisfies Preset.ThemeConfig,
}

export default config
