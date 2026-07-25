class SandboxedPreviewRenderer:
    """
    Renders generated HTML/JS code inside an isolated iframe container
    with strict Content Security Policy (CSP) and sandbox domain isolation.
    """

    def sanitize_and_wrap(self, raw_html: str) -> str:
        csp_meta = (
            '<meta http-equiv="Content-Security-Policy" '
            'content="default-src \'self\' data: blob:; '
            'style-src \'self\' \'unsafe-inline\'; '
            'script-src \'self\' \'unsafe-inline\'; '
            'img-src * data: blob:; font-src * data:;">'
        )

        if "<head>" in raw_html.lower():
            wrapped_html = raw_html.replace("<head>", f"<head>{csp_meta}", 1)
        elif "<html>" in raw_html.lower():
            wrapped_html = raw_html.replace("<html>", f"<html><head>{csp_meta}</head>", 1)
        else:
            wrapped_html = f"<!DOCTYPE html><html><head>{csp_meta}</head><body>{raw_html}</body></html>"

        # Safely escape double quotes for HTML srcdoc attribute assignment
        attr_safe_srcdoc = wrapped_html.replace('"', '&quot;')

        return f"""
<iframe
  srcdoc="{attr_safe_srcdoc}"
  sandbox="allow-scripts"
  style="width: 100%; height: 100%; border: none; border-radius: 6px;"
  loading="lazy"
></iframe>
""".strip()
