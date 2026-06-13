# Media CSV Notes

## image.csv / video.csv

Both files are **media manifests only**. They do not participate in runtime.

- **Purpose**: historical inventory of COS-hosted media files (filename + URL).
- **Runtime source of truth**: `data.ts` (`PERSONAL_INFO`, `PROJECT_IMAGES`, `PROJECT_VIDEOS`).
- **Format**: two columns — `文件名`, `文件URL`. UTF-8 with BOM (Excel compatibility).
- **URL signature**: most entries carry expired COS query-signature parameters from the upload era; current `data.ts` uses unsigned public-read URLs.

If you need to add new media, edit `data.ts` directly. The CSVs are kept for traceability only.
