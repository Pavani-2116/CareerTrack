# CareerTrack — Job Application Tracker

A responsive job-search dashboard built with **HTML5, CSS3, and vanilla JavaScript**. CareerTrack helps users organize applications, track hiring stages, and remember follow-ups.

## Features

- Add, edit, and delete job applications
- Track Applied, Assessment, Interview, Offer, and Rejected stages
- Search by company or job title
- Filter by status and sort by application date
- Dashboard statistics and progress indicators
- Follow-up date tracking
- Personal job-search checklist
- Persistent data using browser `localStorage`
- Responsive desktop, tablet, and mobile layouts
- Accessible form labels, keyboard-friendly dialog, and reduced-motion support

## Tech stack

- HTML5 semantic markup
- CSS3 (responsive layouts, custom properties, transitions)
- Vanilla JavaScript ES modules
- Browser LocalStorage API

## Run locally

Because the app uses JavaScript modules, serve the folder through a local web server.

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Start the **Live Server** extension from `index.html`.
4. Open the local URL shown by Live Server.

You can also use another static local development server.

## Project structure

```text
CareerTrack/
├── assets/
│   └── images/
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── docs/
│   └── screenshots/
├── js/
│   ├── main.js
│   ├── app.js
│   ├── storage.js
│   ├── applications.js
│   ├── dashboard.js
│   ├── notifications.js
│   └── utils.js
├── index.html
├── README.md
├── LICENSE
└── .gitignore
```

## Data and privacy

Application records and checklist state are stored locally in the current browser. They are not synced across devices and there is no server-side database or account system. Avoid entering sensitive personal information.

## Future improvements

- Export and import application data as JSON or CSV
- Add a visual hiring pipeline board
- Add automated tests
- Add optional backend synchronization

## Screenshots

Add screenshots of the running app to `docs/screenshots/` and embed them here once captured.

## License

Released under the MIT License. See `LICENSE`.
