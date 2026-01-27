
from playwright.sync_api import Page, expect, sync_playwright
import os

def test_ui(page: Page):
    # Load the mock HTML file
    cwd = os.getcwd()
    # Assuming running from repo root
    file_path = f"file://{cwd}/verification/mocks/mock_preview.html"
    print(f"Loading {file_path}")
    page.goto(file_path)

    # Check for Win95 Container
    expect(page.locator(".compu-container")).to_be_visible()

    # Check for Title Bar
    expect(page.locator(".title-bar")).to_be_visible()

    # Check for Quick Scan Window
    expect(page.locator(".win95-popup-window").first).to_be_visible()

    # Take a screenshot
    output_path = "/home/jules/verification/smart_repair_verification.png"
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    page.screenshot(path=output_path)
    print(f"Screenshot saved to {output_path}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_ui(page)
        finally:
            browser.close()
