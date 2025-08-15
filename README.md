# Star-Scout

Star-Scout is a Chrome extension that recommends a random trending new GitHub repository every hour, helping you discover interesting open source projects.

## Features

-   Recommends a random trending new repository every hour
-   Displays repository name, description, language, stars, owner avatar, and last updated time
-   Supports one-click to switch to the next recommendation (with cooldown)
-   Clean and modern UI design

## Installation

1. Download or clone this repository.
2. In Chrome, go to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select this folder.
5. Click the Star-Scout icon in the toolbar to start using.

## Project Structure

-   `manifest.json`: Chrome extension configuration
-   `background.js`: Periodically fetches trending new GitHub repositories
-   `popup.html`: Popup UI
-   `popup.js`: Popup interaction logic
-   `style.css`: UI styles
-   `img/`: Icon assets

## Development Notes

-   Uses the GitHub Search API to update the repository pool daily
-   Uses Chrome Storage to save recommendation records and cooldown time
-   Cannot switch to a new recommendation during cooldown to avoid API abuse

## Notes

-   Internet connection is required to get recommendations
-   May encounter GitHub rate limits if too many API requests are made

## License

MIT
