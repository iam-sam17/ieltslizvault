#!/usr/bin/env python3
"""
IELTS Liz Vault — Universal Cross-Platform Local Launcher
Auto-detects free ports, starts local HTTP server, and opens default web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

DEFAULT_PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    os.chdir(DIRECTORY)
    port = DEFAULT_PORT
    
    # Auto-find available port if default is occupied
    while port < 9000:
        try:
            with socketserver.TCPServer(("", port), QuietHandler) as httpd:
                url = f"http://localhost:{port}/index.html"
                print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                print("  🌟 IELTS Liz Vault — Local Server Online")
                print(f"  🔗 URL: {url}")
                print("  🛑 Press CTRL+C to stop the server.")
                print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
                
                # Automatically launch default browser
                webbrowser.open(url)
                httpd.serve_forever()
                break
        except OSError:
            port += 1

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\n\n[✓] Server gracefully stopped. Goodbye! 👋\n")
        sys.exit(0)
