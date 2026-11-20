# 💌 데이트 신청 사이트

인트로 → 손편지 → 데이트 신청(도망가는 "아니오" 버튼) → 코스 선택 → 날짜 선택 → Formspree로 답장 메일 전송.

## 수정할 곳

- **편지 내용**: `index.html`의 `section-letter` 부분
- **답장 받을 메일**: `script.js` 맨 위 `FORMSPREE_ENDPOINT`
- **떠다니는 이미지**: `script.js`의 `FLOATING_IMAGES` (이미지는 `assets/` 폴더에)
- CSS/JS를 고친 뒤에는 `index.html`의 `?v=6` 숫자를 하나 올리면 상대방 폰에서 캐시 없이 바로 반영됩니다.

## GitHub Pages 배포

1. GitHub에서 새 저장소 만들기 (Public, README 추가 안 함)
2. 이 폴더에서:
   ```
   git remote add origin https://github.com/<아이디>/<저장소이름>.git
   git push -u origin main
   ```
3. 저장소 **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**
4. 1~2분 후 `https://<아이디>.github.io/<저장소이름>/` 에서 접속

## 로컬 미리보기

```
python -m http.server 8765
```
→ http://localhost:8765
