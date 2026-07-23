import html

class SandboxedPreviewRenderer:
    """
    Renders untrusted generated HTML/JS code inside an isolated container
    with strict Content Security Policy (CSP) and cookie domain isolation.
    """

    def sanitize_and_wrap(self, raw_html: str) -> str:
        # Wrap in iframe container with strict sandbox policy
        csp_header = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';"
        escaped_src = html.escape(raw_html)
        
        return f"""
        <iframe
          srcdoc="{escaped_src}"
          sandbox="allow-scripts"
          csp="{csp_header}"
          style="width: 100%; height: 100%; border: none; border-radius: 6px;"
          loading="lazy"
        ></iframe>
        """.strip()
