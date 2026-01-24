<script lang="ts">
	// No props needed for this static guide
</script>

<div class="guide-container">
	<h3>Ludos Plugin Guide</h3>
	<p>Welcome to Ludos, your game design companion for Obsidian.</p>

	<h4>How to use</h4>
	<p>To enable Ludos features for a note, add a <code>type</code> property to the YAML frontmatter of your markdown file.</p>

	<div class="code-block">
<pre>---
type: mechanic/verb
---</pre>
	</div>

	<h4>Supported Types</h4>
	<ul>
		<li>
			<strong>mechanic/verb</strong>: Enables a properties form for defining game mechanics (Input, Cooldown, etc.).
		</li>
		<li>
			<strong>mechanic/interaction</strong> or <strong>entity/door</strong>: Enables "The Door Problem Checklist" to ensure comprehensive design.
		</li>
	</ul>

    <p>Open a note and add a type to get started!</p>
</div>

<style>
	.guide-container {
		padding: 10px;
		color: var(--text-normal);
	}
	h3 {
		margin-top: 0;
		border-bottom: 1px solid var(--background-modifier-border);
		padding-bottom: 8px;
	}
	h4 {
		margin-bottom: 8px;
		margin-top: 16px;
	}
	.code-block {
		background-color: var(--background-primary-alt);
		padding: 8px;
		border-radius: 4px;
		font-family: var(--font-monospace);
		font-size: 0.9em;
		border: 1px solid var(--background-modifier-border);
	}
    pre {
        margin: 0;
    }
	ul {
		padding-left: 20px;
	}
	li {
		margin-bottom: 6px;
	}
    code {
        background-color: var(--background-primary-alt);
        padding: 2px 4px;
        border-radius: 3px;
        font-family: var(--font-monospace);
    }
</style>
