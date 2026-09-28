// Loads the token and base styles a consuming page would, so browser tests measure real layout.
import '../lib/tokens/tokens.css';
import '../lib/styles/globals.css';
import '../lib/styles/typography.css';

// A consuming page registers the glyphs it renders. These are every default and fixed glyph the
// components declare in their metadata (`phosphor`), so no test trips gv-icon's missing-glyph warning
// by accident; tests of the warning use names Phosphor does not have.
import '@phosphor-icons/webcomponents/PhArrowLeft';
import '@phosphor-icons/webcomponents/PhCheckCircle';
import '@phosphor-icons/webcomponents/PhCopy';
import '@phosphor-icons/webcomponents/PhHouse';
import '@phosphor-icons/webcomponents/PhInfo';
import '@phosphor-icons/webcomponents/PhPalette';
import '@phosphor-icons/webcomponents/PhTree';
import '@phosphor-icons/webcomponents/PhWarningCircle';
