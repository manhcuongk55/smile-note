---
description: Quy trình quản lý thay đổi Git — branch, version, tag
---

# Git Change Management Workflow

// turbo-all

## Quy trình tạo feature mới

### 1. Tạo feature branch
```bash
git checkout -b feature/<tên-tính-năng>
```
Naming convention: `feature/move-in-wizard`, `fix/api-500`, `chore/update-deps`

### 2. Commit theo convention
```
<type>: <mô tả ngắn>

- Chi tiết thay đổi 1
- Chi tiết thay đổi 2
```
Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`

### 3. Push branch và tạo PR
```bash
git push origin feature/<tên-tính-năng>
```

### 4. Review & Merge vào main
```bash
git checkout main
git merge feature/<tên-tính-năng>
git push origin main
```

### 5. Tag version sau khi merge
```bash
git tag -a v<major>.<minor>.<patch> -m "Release v<major>.<minor>.<patch>: <mô tả>"
git push origin v<major>.<minor>.<patch>
```
Ví dụ: `v1.1.0` — feature mới, `v1.0.1` — bugfix

### 6. Dọn branch cũ
```bash
git branch -d feature/<tên-tính-năng>
git push origin --delete feature/<tên-tính-năng>
```

## Versioning Rules (Semantic Versioning)
- **MAJOR** (v2.0.0): Breaking changes, redesign lớn
- **MINOR** (v1.1.0): Feature mới, không phá code cũ
- **PATCH** (v1.0.1): Bugfix, hotfix nhỏ

## Deploy
```bash
# Deploy sau khi merge vào main
npx vercel deploy --prod
```
