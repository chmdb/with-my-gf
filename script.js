// ======================================================
// 💌 이메일 전송 API 설정 (Formspree 연동 주소)
// ======================================================
// https://formspree.io/ 회원가입 후 생성한 폼의 API 주소(Endpoint)를 입력하세요.
// 예시: const FORMSPREE_ENDPOINT = 'https://formspree.io/f/abcde1234';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjgqpyvv'; 

// ======================================================
// 🎈 배경에 둥둥 떠다닐 이미지 설정
// ======================================================
// assets 폴더에 있는 이미지 파일명을 적어주세요. 
// 비워두면 기본 하트 아이콘이 둥둥 떠다닙니다!
const FLOATING_IMAGES = [
  'assets/SweetBabyHachiware2.webp'
  // 예: 'assets/photo1.png', 'assets/photo2.jpg' 등 추가 가능
];

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const sectionIntro = document.getElementById('section-intro');
  const sectionLetter = document.getElementById('section-letter');
  const sectionProposal = document.getElementById('section-proposal');
  const sectionCourse = document.getElementById('section-course');
  const sectionCalendar = document.getElementById('section-calendar');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const btnReadLetter = document.getElementById('btn-read-letter');
  const btnCourseNext = document.getElementById('btn-course-next');
  const dateForm = document.getElementById('date-form');
  const dateInput = document.getElementById('date-input');
  const modalSuccess = document.getElementById('modal-success');
  const confirmedDateSpan = document.getElementById('confirmed-date');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const heartBg = document.getElementById('heart-bg');

  // 코스 선택 데이터 저장 변수
  let selectedCourses = [];

  // 0. 구름이(오리지널 구름 캐릭터) & 배경 구름 그리기
  const CLOUD_PATH = 'M30 70 C14 70 10 50 24 44 C22 28 42 20 52 30 C58 12 88 14 90 34 C106 34 110 60 94 70 Z';
  const BUDDY_SVG = `
    <svg viewBox="0 0 120 80" width="100%" height="100%" style="overflow:visible">
      <path d="${CLOUD_PATH}" fill="#fff" stroke="#3A4660" stroke-width="3.4" stroke-linejoin="round"/>
      <ellipse cx="38" cy="38" rx="6" ry="3.2" fill="#EAF6FE" transform="rotate(-25 38 38)"/>
      <ellipse class="eye" cx="51" cy="50" rx="3.4" ry="4" fill="#3A4660"/>
      <ellipse class="eye" cx="71" cy="50" rx="3.4" ry="4" fill="#3A4660"/>
      <ellipse cx="42" cy="58.5" rx="5.6" ry="3.2" fill="#FFB3C6"/>
      <ellipse cx="80" cy="58.5" rx="5.6" ry="3.2" fill="#FFB3C6"/>
      <path d="M57 56 Q61 60.5 65 56" fill="none" stroke="#3A4660" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`;
  const SKY_CLOUD_SVG = `<svg viewBox="0 0 120 80" width="100%" height="100%"><path d="${CLOUD_PATH}" fill="#fff"/></svg>`;

  document.querySelectorAll('.cloud-buddy').forEach(el => { el.innerHTML = BUDDY_SVG; });
  document.querySelectorAll('.sky-cloud').forEach(el => { el.innerHTML = SKY_CLOUD_SVG; });

  // 1. 배경에 천천히 떨어지는 캐릭터 + 파스텔 반짝이
  const GLYPHS = ['♥', '✦', '✧', '♥', '✦'];
  const GLYPH_COLORS = ['#7EC3F0', '#A3D6F7', '#FFFFFF', '#FFB3C6', '#4C9FDA'];

  function createFloatingItem() {
    const item = document.createElement('div');
    item.classList.add('floating-item');

    const useImage = FLOATING_IMAGES.length > 0 && Math.random() < 0.45;
    let size;

    if (useImage) {
      const img = document.createElement('img');
      img.src = FLOATING_IMAGES[Math.floor(Math.random() * FLOATING_IMAGES.length)];
      img.alt = '';
      img.classList.add('floating-img');
      item.appendChild(img);
      size = Math.random() * 14 + 30; // 30 ~ 44px
      item.style.width = `${size}px`;
      item.style.height = `${size}px`;
    } else {
      const glyph = document.createElement('span');
      glyph.classList.add('floating-glyph');
      glyph.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      glyph.style.color = GLYPH_COLORS[Math.floor(Math.random() * GLYPH_COLORS.length)];
      size = Math.random() * 12 + 14; // 14 ~ 26px
      glyph.style.fontSize = `${size}px`;
      item.appendChild(glyph);
    }

    item.style.left = Math.random() * 100 + 'vw';

    // 느긋하게 8s ~ 13s
    const duration = Math.random() * 5 + 8;
    item.style.animationDuration = `${duration}s`;

    heartBg.appendChild(item);
    setTimeout(() => item.remove(), duration * 1000);
  }

  setInterval(createFloatingItem, 900);

  // 1-2. 진행 단계 점 표시
  const progressDots = document.querySelectorAll('#progress .dot');
  function updateProgress(step) {
    progressDots.forEach((dot, i) => {
      dot.classList.toggle('done', i < step);
      dot.classList.toggle('current', i === step);
    });
  }
  updateProgress(0);

  // 2. 화면 전환 함수 (SPA 페이드인/아웃 구현)
  function switchScreen(fromScreen, toScreen) {
    // 1단계: 현재 화면 서서히 사라짐
    fromScreen.style.opacity = '0';
    fromScreen.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      fromScreen.classList.remove('active');
      
      // 2단계: 다음 화면 준비
      toScreen.classList.add('active');
      updateProgress(Number(toScreen.dataset.step || 0));
      window.scrollTo(0, 0);
      // 브라우저 렌더링 동기화를 위한 짧은 지연
      setTimeout(() => {
        toScreen.style.opacity = '1';
        toScreen.style.transform = 'translateY(0)';
      }, 50);
    }, 600); // CSS transition 0.6s에 맞춤
  }

  // 3. 인트로 화면 클릭 시 디지털 손편지 화면으로 이동
  sectionIntro.addEventListener('click', () => {
    switchScreen(sectionIntro, sectionLetter);
  });

  // 3-2. 손편지 완료 클릭 시 데이트 신청 화면으로 이동
  btnReadLetter.addEventListener('click', () => {
    switchScreen(sectionLetter, sectionProposal);
  });

  // 4. [아니오] 버튼 회피 기능 (절대 클릭 불가능하게 도망치기)
  const NO_TEXTS = ['아니…', '진짜…?', '다시 생각해봐 🥺', '안 돼~', '못 누르지롱 😝', '좋아 눌러줘 💕'];
  let escapeCount = 0;

  function escapeButton(e) {
    // 도망칠 때마다 문구가 바뀌고, [좋아] 버튼은 점점 커짐
    escapeCount++;
    btnNo.textContent = NO_TEXTS[Math.min(escapeCount, NO_TEXTS.length - 1)];
    btnYes.style.setProperty('--grow', String(1 + Math.min(escapeCount, 8) * 0.06));

    // 버튼 크기
    const btnWidth = btnNo.offsetWidth;
    const btnHeight = btnNo.offsetHeight;
    
    // 뷰포트 영역 크기
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 화면 테두리에서 여유 마진 30px 두고 계산
    const margin = 30;
    const maxLeft = viewportWidth - btnWidth - margin;
    const maxTop = viewportHeight - btnHeight - margin;
    
    // 랜덤 좌표 생성 (최소 marginpx ~ 최대 max 좌표 사이)
    let randomLeft = Math.max(margin, Math.floor(Math.random() * maxLeft));
    let randomTop = Math.max(margin, Math.floor(Math.random() * maxTop));
    
    // 마우스/터치 좌표가 있는 경우 버튼이 커서 위치 바로 위에 겹치지 않게 조절
    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // 만약 계산된 좌표가 현재 마우스/터치 위치와 너무 가까우면 좌표를 더 밀어내기
    if (clientX && clientY) {
      const distanceX = Math.abs(randomLeft + btnWidth / 2 - clientX);
      const distanceY = Math.abs(randomTop + btnHeight / 2 - clientY);
      
      if (distanceX < 100 && distanceY < 100) {
        // 커서와 가까우면 반대 방향으로 밀어버림
        randomLeft = randomLeft > clientX ? randomLeft + 150 : randomLeft - 150;
        randomTop = randomTop > clientY ? randomTop + 150 : randomTop - 150;
        
        // 다시 바운더리 체크
        randomLeft = Math.max(margin, Math.min(randomLeft, maxLeft));
        randomTop = Math.max(margin, Math.min(randomTop, maxTop));
      }
    }
    
    // 부모 섹션의 transform 때문에 fixed 좌표가 어긋나지 않도록 body로 옮김
    if (btnNo.parentElement !== document.body) {
      document.body.appendChild(btnNo);
    }

    // fixed 포지션을 적용하여 뷰포트 기준 절대 좌표로 이동
    btnNo.classList.add('escaped');
    btnNo.style.zIndex = '50';
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${randomLeft}px`;
    btnNo.style.top = `${randomTop}px`;
    
    // 살짝 튕기는 듯한 귀여운 모션
    btnNo.style.setProperty('--grow', '1.1');
    setTimeout(() => {
      btnNo.style.setProperty('--grow', '1');
    }, 150);
  }

  // 아니오 버튼을 원래 자리(버튼 그룹)로 되돌림
  const btnGroup = btnNo.parentElement;
  function resetNoButton() {
    btnNo.classList.remove('escaped');
    btnNo.style.position = '';
    btnNo.style.left = '';
    btnNo.style.top = '';
    btnNo.style.zIndex = '';
    btnGroup.appendChild(btnNo);
    escapeCount = 0;
    btnNo.textContent = NO_TEXTS[0];
    btnYes.style.removeProperty('--grow');
  }

  // 날짜를 "11월 21일 (토)" 형태로
  function formatDate(value) {
    const d = new Date(value + 'T00:00:00');
    if (isNaN(d)) return value;
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
  }

  // 마우스 진입 및 터치 시작 시 도망가기 이벤트 리스너 등록
  btnNo.addEventListener('mouseenter', escapeButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // 터치 기본 동작 방지 (터치하자마자 도망가도록)
    escapeButton(e);
  });
  
  // 혹시라도 탭 키를 누르거나 클릭하려 하는 예외적인 상황 대비
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    escapeButton(e);
  });

  // 5. [예] 버튼 클릭 시 데이트 코스 선택 화면으로 이동
  btnYes.addEventListener('click', () => {
    resetNoButton();
    switchScreen(sectionProposal, sectionCourse);
  });

  // 5-2. 코스 선택 완료 클릭 시 날짜 선택 화면으로 이동
  btnCourseNext.addEventListener('click', () => {
    switchScreen(sectionCourse, sectionCalendar);
    
    // 달력의 기본 선택일을 '오늘 날짜' 또는 '내일 날짜'로 미리 셋팅
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  });

  // 5-3. 코스 아이템 클릭 시 선택/선택 해제 토글
  const courseItems = document.querySelectorAll('.course-item');
  courseItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected');
      const val = item.getAttribute('data-value');
      if (item.classList.contains('selected')) {
        if (!selectedCourses.includes(val)) {
          selectedCourses.push(val);
        }
      } else {
        selectedCourses = selectedCourses.filter(c => c !== val);
      }
    });
  });

  // 6. 데이터 전송 및 모달 알림 기능 (Formspree API 연동)
  dateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedDate = dateInput.value;
    const dateIdea = document.getElementById('date-idea-input').value;
    const coursesText = selectedCourses.length > 0 ? selectedCourses.join(', ') : '선택 안 함';
    const submitBtn = dateForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerHTML;
    
    // 버튼 로딩 상태 표시
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 전송 중...';

    // 테스트 환경 및 미설정 상태일 때 가상 전송 처리 (데모 작동용)
    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.trim() === '') {
      console.warn("Formspree 엔드포인트가 비어있습니다. 데모 테스트 모드로 성공 처리합니다.");
      
      // 사용자에게 로컬/데모 환경임을 알리면서 정상 작동을 보여주기 위해 0.8초 가상 딜레이 적용
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // 날짜와 코멘트 띄우고 성공 모달 표시
        confirmedDateSpan.textContent = formatDate(selectedDate);
        document.getElementById('confirmed-idea').textContent = dateIdea;
        document.getElementById('confirmed-courses').textContent = coursesText;
        modalSuccess.classList.add('active');
      }, 800);
      return;
    }

    // 실제 Formspree API 호출
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: `💕 데이트 신청 수락 알림 💕`,
          "선택한 코스": coursesText,
          "하고 싶은 데이트": dateIdea,
          "선택한 날짜": selectedDate
        })
      });

      if (response.ok) {
        // 성공 시
        confirmedDateSpan.textContent = formatDate(selectedDate);
        document.getElementById('confirmed-idea').textContent = dateIdea;
        document.getElementById('confirmed-courses').textContent = coursesText;
        modalSuccess.classList.add('active');
      } else {
        // 서버 에러 응답
        alert("이메일 전송에 실패했습니다. Formspree 설정을 확인해주세요! 😢");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요! 😢");
    } finally {
      // 버튼 상태 원복
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // 7. 성공 모달 닫기 버튼 클릭 시 모달 닫고 첫 화면으로 되돌아감
  btnCloseModal.addEventListener('click', () => {
    modalSuccess.classList.remove('active');
    
    // 선택했던 코스 및 스타일 초기화
    selectedCourses = [];
    courseItems.forEach(item => item.classList.remove('selected'));
    
    // 아니오 버튼 위치 초기화
    resetNoButton();

    // 다시 인트로 화면으로 복귀
    switchScreen(sectionCalendar, sectionIntro);
  });
});
