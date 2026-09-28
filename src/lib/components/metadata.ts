/** The Phosphor glyphs a component can render, so tooling knows what a page must register. */
export interface PhosphorGlyphs {
	/** The attribute that sets the glyph, or null when none does. */
	prop: string | null;
	/** Rendered when that attribute is omitted, or null. */
	default: string | null;
	/** Rendered regardless of props; not overridable. */
	fixed: readonly string[];
}

/** A slot a component projects light-DOM content through. */
export interface GroveSlot {
	/** The slot name; '' is the default slot. */
	name: string;
	description: string;
	/** The property rendered when the slot is empty, or null. */
	fallback: string | null;
}

/** The shape every `*Metadata` export satisfies. Sections beyond these stay free-form. */
export interface ComponentMetadata {
	component: {
		name: string;
		tag?: string;
		category: string;
		description: string;
		type: string;
		path: string;
		version: string;
		created: string;
		modified: string;
	};
	phosphor: PhosphorGlyphs;
	composition: {
		/** Every slot the component renders; null when it projects nothing. */
		slots: readonly GroveSlot[] | null;
		[key: string]: unknown;
	};
	[section: string]: unknown;
}
