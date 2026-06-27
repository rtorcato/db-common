import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import type { ReactElement } from 'react'
import InstallTabs from '@site/src/components/InstallTabs'
import styles from './index.module.css'

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconKey = 'brackets' | 'shield' | 'feather' | 'layers'

type IconProps = {
	icon: IconKey
	title: string
	className?: string
	size?: number
}

function Icon({ icon, title, className, size = 22 }: IconProps): ReactElement {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
		>
			<title>{title}</title>
			{ICONS[icon]}
		</svg>
	)
}

const ICONS: Record<IconKey, ReactElement> = {
	brackets: (
		<>
			<path d="m9 8-5 4 5 4" />
			<path d="m15 8 5 4-5 4" />
		</>
	),
	shield: (
		<>
			<path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6z" />
			<path d="m9 12 2 2 4-4" />
		</>
	),
	feather: (
		<>
			<path d="M20.2 5.8a5 5 0 0 0-7 0L4 15v5h5l9.2-9.2a5 5 0 0 0 0-7z" />
			<path d="M16 8 2 22" />
			<path d="M17.5 15H9" />
		</>
	),
	layers: (
		<>
			<path d="M12 2 2 7l10 5 10-5z" />
			<path d="m2 12 10 5 10-5" />
			<path d="m2 17 10 5 10-5" />
		</>
	),
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Pillar = {
	title: string
	desc: string
	icon: IconKey
}

const PILLARS: Pillar[] = [
	{
		title: 'TypeScript-first',
		desc: 'Strict types, generics preserved, JSDoc-rich in your IDE. Helpers that infer, not just accept `any`.',
		icon: 'brackets',
	},
	{
		title: 'Tree-shakeable',
		desc: 'ESM-only with `sideEffects: false`. Bundlers keep just the helpers you import — nothing else ships.',
		icon: 'feather',
	},
	{
		title: 'Database-agnostic',
		desc: 'Small primitives for query building, pagination, and result shaping — independent of any single driver.',
		icon: 'layers',
	},
	{
		title: 'Safe by default',
		desc: 'Predictable return shapes and guarded edges. No surprise throws from the common path.',
		icon: 'shield',
	},
]

type Sibling = {
	name: string
	tagline: string
	href: string
	dest: 'Docs' | 'GitHub'
}

const SIBLINGS: Sibling[] = [
	{
		name: '@rtorcato/js-common',
		tagline: 'Tree-shakeable TypeScript utilities — tiny bundles, full type safety, CLI included.',
		href: 'https://rtorcato.github.io/js-common/',
		dest: 'Docs',
	},
	{
		name: '@rtorcato/browser-common',
		tagline:
			'Tree-shakeable TypeScript wrappers around 40+ browser Web APIs — one subpath per spec.',
		href: 'https://rtorcato.github.io/browser-common/',
		dest: 'Docs',
	},
	{
		name: '@rtorcato/js-tooling',
		tagline:
			'Shared Biome, TypeScript, Vitest and semantic-release presets that power the @rtorcato/* family.',
		href: 'https://rtorcato.github.io/js-tooling/',
		dest: 'Docs',
	},
]

const HERO_CODE = `import { paginate } from '@rtorcato/db-common'

const { limit, offset } = paginate({ page: 2, size: 25 })
// → { limit: 25, offset: 25 }`

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Hero(): ReactElement {
	return (
		<header className={styles.hero}>
			<div className={styles.heroGlow} aria-hidden />
			<div className={styles.heroInner}>
				<div className={styles.wordmark}>
					<span className={styles.wmDb}>db</span>
					<span className={styles.wmDash}>-</span>
					<span className={styles.wmCommon}>common</span>
				</div>
				<p className={styles.tagline}>
					Shared, tree-shakeable TypeScript database utilities for the @rtorcato/* family.
				</p>

				<div className={styles.heroBody}>
					<CodeWindow />
				</div>

				<div className={styles.heroActions}>
					<div className={styles.heroButtons}>
						<Link
							className={clsx('button button--primary button--lg', styles.cta)}
							to="/docs/guides/installation"
						>
							Get started →
						</Link>
						<Link className={clsx('button button--lg', styles.ctaSecondary)} to="/docs">
							Read the docs
						</Link>
					</div>
					<InstallTabs pkg="@rtorcato/db-common" />
				</div>
			</div>
		</header>
	)
}

function CodeWindow(): ReactElement {
	return (
		<div className={styles.codeWindow}>
			<div className={styles.codeBar}>
				<span className={styles.dot} style={{ background: '#ff5f57' }} />
				<span className={styles.dot} style={{ background: '#febc2e' }} />
				<span className={styles.dot} style={{ background: '#28c840' }} />
				<span className={styles.codeFile}>query.ts</span>
			</div>
			<pre className={styles.codePre}>{HERO_CODE}</pre>
		</div>
	)
}

function Pillars(): ReactElement {
	return (
		<section className={styles.section}>
			<div className={styles.pillarGrid}>
				{PILLARS.map((p) => (
					<div key={p.title} className={styles.pillar}>
						<div className={styles.pillarIcon}>
							<Icon icon={p.icon} title={p.title} size={20} className={styles.pillarIconSvg} />
						</div>
						<div className={styles.pillarTitle}>{p.title}</div>
						<div className={styles.pillarDesc}>{p.desc}</div>
					</div>
				))}
			</div>
		</section>
	)
}

function Siblings(): ReactElement {
	return (
		<section className={styles.section}>
			<div className={styles.sectionHead}>
				<div>
					<h2 className={styles.h2}>Sibling projects</h2>
					<p className={styles.sub}>
						More from <code>@rtorcato</code> — same conventions, same release pipeline.
					</p>
				</div>
			</div>
			<div className={styles.siblingGrid}>
				{SIBLINGS.map((s) => (
					<Link key={s.name} href={s.href} className={styles.card}>
						<div className={styles.cardHead}>
							<div className={styles.cardName}>{s.name}</div>
							<div className={styles.cardCount}>{s.dest} ↗</div>
						</div>
						<p className={styles.cardDesc}>{s.tagline}</p>
					</Link>
				))}
			</div>
		</section>
	)
}

export default function Home(): ReactElement {
	return (
		<Layout
			title="db-common"
			description="Shared, tree-shakeable TypeScript database utilities for the @rtorcato/* family."
		>
			<main>
				<Hero />
				<Pillars />
				<Siblings />
			</main>
		</Layout>
	)
}
