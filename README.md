# T3/T4 Remote Lounge – Samples Register

GitHub Pages-ready static samples register for the Q Design & Construct T3/T4 Remote Lounge project.

## Included
- 205 sample requirements derived from the project specification review.
- Dashboard KPIs.
- Search and filters by discipline, package, status and priority.
- Full sample detail view.
- Specification document, clause, PDF page and source requirement against each sample.
- Photo gallery structure against each sample.
- CSV export of filtered results.
- Mobile-friendly layout.

## Publish with GitHub Pages
1. Upload this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select branch **main** and folder **/(root)**.
5. Save.

> Note: GitHub Pages visibility/availability for a private repository depends on your GitHub plan and organisation/account settings. If Pages is unavailable while the repo is private, do not make project information public just to enable it.

## Adding a sample photo in GitHub-only mode
For sample `SMP-001`:

1. Create/upload the image at:
   `images/samples/SMP-001/sample-01.jpg`
2. Open `data/samples.json`.
3. Find `"id": "SMP-001"`.
4. Change:
   `"photos": []`
   to:
   `"photos": ["images/samples/SMP-001/sample-01.jpg"]`
5. Commit the change.

Multiple photos:
```json
"photos": [
  "images/samples/SMP-001/sample-01.jpg",
  "images/samples/SMP-001/sample-02.jpg"
]
```

## Updating status / subcontractor / Aconex
Edit the corresponding record in `data/samples.json` and commit it.

## Important limitation of GitHub-only mode
The deployed browser page is read-only. It cannot securely write photos or status changes back to GitHub by itself. The UI is deliberately structured so a database/storage backend can be added later without rebuilding the register.

## Source spreadsheet
`Remote_Lounge_Samples_Register.xlsx` is included in the repository as the original register/reference.
