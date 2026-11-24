# Ignite design takeaways

A native, responsive website with editable text and original photos. No embedded PowerPoint, slide screenshots, speaker notes, sign-in, or tracking.

## Edit the website

Use **Edit content** in the website header, or open `content.json` on GitHub and click the pencil button. Change the text, preserve the JSON structure, and commit to `main`. GitHub Pages republishes the website after the commit.

To replace a photo, upload its JPEG, PNG, or WebP file into `assets/`, then update the matching `src` and `alt` in `content.json`. Existing `/media/filename` paths map to `assets/filename`; relative `./assets/filename` paths work too.

`index.html`, `app.js`, and `app.css` control the page structure, native content rendering, and styling. The website is independent of the PowerPoint.

## Visibility

This website and repository are public. Viewing needs no Microsoft or GitHub login; editing requires repository write access. Do not add private documents, credentials, or personal rehearsal notes.

## Preview locally

Run `python3 -m http.server 4180 --bind 127.0.0.1` in this directory, then open `http://127.0.0.1:4180/`.
