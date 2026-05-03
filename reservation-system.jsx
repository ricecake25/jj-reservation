import { useState, useCallback } from "react";

// ─── 전주대학교 단과대학 & 건물 데이터 ───
const COLLEGES = [
  { id: "humanities", name: "인문콘텐츠대학", icon: "📚", building: "진리관", color: "#7C3AED" },
  { id: "social", name: "사회과학대학", icon: "⚖️", building: "평화관", color: "#2563EB" },
  { id: "business", name: "경영대학", icon: "💼", building: "자유관", color: "#0891B2" },
  { id: "medical", name: "의과학대학", icon: "🏥", building: "천잠관", color: "#059669" },
  { id: "engineering", name: "공과대학", icon: "⚙️", building: "공학1관", color: "#D97706" },
  { id: "software", name: "소프트웨어융합대학", icon: "💻", building: "공학2관", color: "#7C3AED" },
  { id: "culture", name: "문화융합대학", icon: "🎨", building: "예술관", color: "#DB2777" },
  { id: "tourism", name: "문화관광대학", icon: "🌏", building: "지역혁신관", color: "#EA580C" },
  { id: "education", name: "사범대학", icon: "🎓", building: "진리관", color: "#4F46E5" },
  { id: "future", name: "미래융합대학", icon: "🚀", building: "자유관", color: "#0D9488" },
  { id: "superstar", name: "수퍼스타칼리지", icon: "⭐", building: "스타센터", color: "#E11D48" },
  { id: "common", name: "공용시설", icon: "🏫", building: "캠퍼스 전체", color: "#475569" },
];

const FACILITIES = [
  // 인문콘텐츠대학 - 진리관
  { id: 1, collegeId: "humanities", name: "진리관 대강의실", capacity: 120, location: "진리관 B101", description: "대형 강의, 특강, 학술대회", type: "강의실" },
  { id: 2, collegeId: "humanities", name: "웹툰 창작실", capacity: 30, location: "진리관 305", description: "웹툰만화콘텐츠학과 실습실", type: "실습실" },
  { id: 3, collegeId: "humanities", name: "어학실습실", capacity: 40, location: "진리관 207", description: "영어·일본어·중국어 어학 실습", type: "실습실" },

  // 사회과학대학 - 평화관
  { id: 4, collegeId: "social", name: "모의법정실", capacity: 50, location: "평화관 201", description: "법학과 모의재판, 법률 세미나", type: "실습실" },
  { id: 5, collegeId: "social", name: "평화관 세미나실", capacity: 25, location: "평화관 305", description: "소규모 세미나, 그룹 스터디", type: "세미나실" },
  { id: 6, collegeId: "social", name: "상담실습실", capacity: 15, location: "평화관 402", description: "상담심리학과 실습, 면담", type: "실습실" },

  // 경영대학 - 자유관
  { id: 7, collegeId: "business", name: "경영 시뮬레이션실", capacity: 35, location: "자유관 301", description: "경영 시뮬레이션, 모의 투자", type: "실습실" },
  { id: 8, collegeId: "business", name: "자유관 회의실", capacity: 20, location: "자유관 105", description: "회의, 면접, 프레젠테이션", type: "회의실" },

  // 의과학대학 - 천잠관
  { id: 9, collegeId: "medical", name: "간호실습실", capacity: 30, location: "천잠관 201", description: "간호학과 시뮬레이션 실습", type: "실습실" },
  { id: 10, collegeId: "medical", name: "물리치료실습실", capacity: 25, location: "천잠관 301", description: "물리치료학과 실기 실습", type: "실습실" },
  { id: 11, collegeId: "medical", name: "방사선실습실", capacity: 20, location: "천잠관 B102", description: "방사선학과 장비 실습", type: "실습실" },
  { id: 12, collegeId: "medical", name: "식품분석실험실", capacity: 20, location: "천잠관 405", description: "식품영양학과 실험, 분석", type: "실험실" },

  // 공과대학 - 공학1관
  { id: 13, collegeId: "engineering", name: "CAD/CAM 실습실", capacity: 35, location: "공학1관 302", description: "기계공학 설계·제도 실습", type: "실습실" },
  { id: 14, collegeId: "engineering", name: "전기전자실험실", capacity: 30, location: "공학1관 401", description: "전기전자공학 회로 실험", type: "실험실" },
  { id: 15, collegeId: "engineering", name: "건축설계실", capacity: 40, location: "공학1관 501", description: "건축학과 설계 스튜디오", type: "실습실" },
  { id: 16, collegeId: "engineering", name: "공학1관 대강의실", capacity: 100, location: "공학1관 B101", description: "대형 강의, 학술 행사", type: "강의실" },

  // 소프트웨어융합대학 - 공학2관
  { id: 17, collegeId: "software", name: "AI 실습실", capacity: 40, location: "공학2관 301", description: "인공지능학과 딥러닝 실습", type: "실습실" },
  { id: 18, collegeId: "software", name: "SW 개발실", capacity: 35, location: "공학2관 402", description: "컴퓨터공학 프로젝트 개발", type: "실습실" },
  { id: 19, collegeId: "software", name: "데이터분석실", capacity: 30, location: "공학2관 303", description: "데이터사이언스 분석 실습", type: "실습실" },

  // 문화융합대학 - 예술관
  { id: 20, collegeId: "culture", name: "공연연습실", capacity: 50, location: "예술관 B101", description: "공연예술학과 연습, 리허설", type: "연습실" },
  { id: 21, collegeId: "culture", name: "영상편집실", capacity: 25, location: "예술관 305", description: "영화방송학과 편집·후반작업", type: "실습실" },
  { id: 22, collegeId: "culture", name: "디자인 스튜디오", capacity: 30, location: "예술관 401", description: "산업/시각디자인 작업실", type: "실습실" },
  { id: 23, collegeId: "culture", name: "게임개발실", capacity: 30, location: "예술관 203", description: "게임콘텐츠학과 개발 실습", type: "실습실" },

  // 문화관광대학 - 지역혁신관
  { id: 24, collegeId: "tourism", name: "조리실습실", capacity: 30, location: "지역혁신관 101", description: "외식산업/한식조리 실습", type: "실습실" },
  { id: 25, collegeId: "tourism", name: "호텔서비스실습실", capacity: 25, location: "지역혁신관 201", description: "호텔경영 서비스 실습", type: "실습실" },
  { id: 26, collegeId: "tourism", name: "패션디자인실", capacity: 20, location: "지역혁신관 301", description: "패션산업학과 디자인 작업", type: "실습실" },

  // 사범대학 - 진리관
  { id: 27, collegeId: "education", name: "교육공학실", capacity: 35, location: "진리관 401", description: "교육학과 수업 시연, 교육공학 실습", type: "실습실" },
  { id: 28, collegeId: "education", name: "과학교육실험실", capacity: 25, location: "진리관 503", description: "과학교육과 실험 실습", type: "실험실" },

  // 공용시설
  { id: 29, collegeId: "common", name: "스타센터 대강당", capacity: 500, location: "스타센터 1층", description: "학교 행사, 강연, 공연", type: "강당" },
  { id: 30, collegeId: "common", name: "스타센터 컨벤션홀", capacity: 200, location: "스타센터 3층", description: "컨벤션, 세미나, 전시회", type: "컨벤션" },
  { id: 31, collegeId: "common", name: "체육관", capacity: 300, location: "체육관동 1층", description: "체육 행사, 대회, 체육 수업", type: "체육시설" },
  { id: 32, collegeId: "common", name: "대운동장", capacity: 1000, location: "야외", description: "체육대회, 축제, 야외행사", type: "체육시설" },
  { id: 33, collegeId: "common", name: "도서관 그룹스터디룸", capacity: 8, location: "스타센터 4층", description: "소규모 그룹 학습, 토론", type: "스터디룸" },
  { id: 34, collegeId: "common", name: "도서관 세미나실", capacity: 30, location: "스타센터 5층", description: "세미나, 학술 발표, 워크숍", type: "세미나실" },
];

const TIME_SLOTS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

const STATUS_MAP = {
  pending: { label: "대기중", color: "#F59E0B", bg: "#FEF3C7", icon: "⏳" },
  approved: { label: "승인", color: "#10B981", bg: "#D1FAE5", icon: "✅" },
  rejected: { label: "거절", color: "#EF4444", bg: "#FEE2E2", icon: "❌" },
};

const TYPE_ICONS = {
  "강의실": "🏛️", "실습실": "🔧", "실험실": "🔬", "세미나실": "📋",
  "회의실": "🤝", "연습실": "🎭", "강당": "🏟️", "컨벤션": "🎪",
  "체육시설": "🏀", "스터디룸": "📖",
};

const INITIAL_RESERVATIONS = [
  { id: 1, facilityId: 29, date: "2026-05-04", startTime: "09:00", endTime: "12:00", applicant: "김민수", department: "학생회", phone: "010-1234-5678", purpose: "신입생 환영 행사", people: 300, status: "pending", createdAt: "2026-05-01" },
  { id: 2, facilityId: 31, date: "2026-05-05", startTime: "14:00", endTime: "17:00", applicant: "이수진", department: "생활체육학과", phone: "010-2345-6789", purpose: "교내 농구 대회", people: 80, status: "approved", createdAt: "2026-05-01" },
  { id: 3, facilityId: 20, date: "2026-05-06", startTime: "15:00", endTime: "18:00", applicant: "박지영", department: "공연예술학과", phone: "010-3456-7890", purpose: "축제 공연 리허설", people: 25, status: "pending", createdAt: "2026-05-02" },
  { id: 4, facilityId: 17, date: "2026-05-04", startTime: "10:00", endTime: "12:00", applicant: "정현우", department: "인공지능학과", phone: "010-4567-8901", purpose: "AI 프로젝트 발표회", people: 35, status: "approved", createdAt: "2026-05-02" },
  { id: 5, facilityId: 13, date: "2026-05-07", startTime: "13:00", endTime: "16:00", applicant: "최영호", department: "기계공학과", phone: "010-5678-9012", purpose: "캡스톤 디자인 작업", people: 20, status: "rejected", createdAt: "2026-05-03" },
  { id: 6, facilityId: 24, date: "2026-05-05", startTime: "09:00", endTime: "12:00", applicant: "한소연", department: "한식조리학과", phone: "010-6789-0123", purpose: "전주비빔밥 조리 실습", people: 28, status: "pending", createdAt: "2026-05-03" },
  { id: 7, facilityId: 9, date: "2026-05-08", startTime: "13:00", endTime: "17:00", applicant: "윤서준", department: "간호학과 3학년", phone: "010-7890-1234", purpose: "기본간호학 시뮬레이션", people: 30, status: "approved", createdAt: "2026-05-03" },
];

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function getDaysInMonth(y,m) { return new Date(y,m+1,0).getDate(); }
function getFirstDay(y,m) { return new Date(y,m,1).getDay(); }
const WEEKDAYS = ["일","월","화","수","목","금","토"];

// ─── Calendar ───
function Calendar({ selectedDate, onSelect, reservations }) {
  const [vd, setVd] = useState(new Date(selectedDate));
  const y = vd.getFullYear(), m = vd.getMonth();
  const days = getDaysInMonth(y,m), first = getFirstDay(y,m);
  const today = formatDate(new Date());
  const cells = [...Array(first).fill(null), ...Array.from({length:days},(_,i)=>i+1)];

  const getCount = (day) => {
    if(!day) return 0;
    const ds = `${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return reservations.filter(r=>r.date===ds).length;
  };

  return (
    <div style={{ background:"var(--card)", borderRadius:16, padding:20, border:"1px solid var(--border)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <button onClick={()=>setVd(new Date(y,m-1,1))} style={navBtn}>◂</button>
        <span style={{ fontWeight:800, fontSize:15, color:"var(--text)", fontFamily:"'Noto Sans KR'" }}>{y}년 {m+1}월</span>
        <button onClick={()=>setVd(new Date(y,m+1,1))} style={navBtn}>▸</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
        {WEEKDAYS.map((w,i)=>(<div key={w} style={{ textAlign:"center", fontSize:11, fontWeight:600, color:i===0?"#EF4444":i===6?"#3B82F6":"var(--muted)", padding:"4px 0" }}>{w}</div>))}
        {cells.map((day,i) => {
          const ds = day ? `${y}-${String(m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}` : "";
          const sel = ds===selectedDate, td = ds===today, cnt = getCount(day), ci = i%7;
          return (
            <div key={i} onClick={()=>day&&onSelect(ds)} style={{
              textAlign:"center", padding:"6px 2px", borderRadius:10, cursor:day?"pointer":"default",
              background:sel?"#1E3A5F":td?"#EFF6FF":"transparent",
              color:sel?"#fff":ci===0?"#EF4444":ci===6?"#3B82F6":"var(--text)",
              fontSize:13, fontWeight:sel||td?700:400, transition:"all .15s", position:"relative",
            }}>
              {day||""}
              {cnt>0 && <div style={{ position:"absolute", bottom:1, left:"50%", transform:"translateX(-50%)", width:Math.min(cnt*6,18), height:4, borderRadius:2, background:sel?"rgba(255,255,255,0.6)":"#3B82F6", transition:"width .2s" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:12, marginTop:12, justifyContent:"center" }}>
        {Object.entries(STATUS_MAP).map(([k,v])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"var(--muted)" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:v.color }} />{v.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reservation Modal ───
function ReservationModal({ facility, college, date, onClose, onSubmit, reservations }) {
  const [form, setForm] = useState({ applicant:"", department:"", phone:"", purpose:"", people:"", startTime:"09:00", endTime:"10:00" });
  const taken = reservations.filter(r=>r.facilityId===facility.id&&r.date===date&&r.status!=="rejected")
    .flatMap(r=>{ const s=[]; let a=TIME_SLOTS.indexOf(r.startTime),b=TIME_SLOTS.indexOf(r.endTime); for(let i=a;i<b;i++) s.push(TIME_SLOTS[i]); return s; });

  const submit = () => {
    if(!form.applicant||!form.department||!form.phone||!form.purpose||!form.people){ alert("모든 항목을 입력해 주세요."); return; }
    if(TIME_SLOTS.indexOf(form.startTime)>=TIME_SLOTS.indexOf(form.endTime)){ alert("종료 시간을 시작 시간 이후로 설정해 주세요."); return; }
    const sel=[]; let a=TIME_SLOTS.indexOf(form.startTime),b=TIME_SLOTS.indexOf(form.endTime);
    for(let i=a;i<b;i++) sel.push(TIME_SLOTS[i]);
    if(sel.some(s=>taken.includes(s))){ alert("이미 예약된 시간대가 포함되어 있습니다."); return; }
    if(parseInt(form.people)>facility.capacity){ alert(`최대 수용 인원(${facility.capacity}명)을 초과합니다.`); return; }
    onSubmit({ facilityId:facility.id, date, ...form, people:parseInt(form.people), status:"pending", createdAt:formatDate(new Date()) });
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ margin:0, fontSize:17, fontWeight:800, color:"var(--text)", fontFamily:"'Noto Sans KR'" }}>
            {TYPE_ICONS[facility.type]||"📋"} 시설 예약 신청
          </h3>
          <button onClick={onClose} style={{...navBtn, fontSize:18}}>✕</button>
        </div>

        <div style={{ background:`linear-gradient(135deg, ${college.color}11, ${college.color}08)`, border:`1px solid ${college.color}33`, borderRadius:12, padding:14, marginBottom:16 }}>
          <div style={{ fontWeight:700, fontSize:15, color:college.color, marginBottom:6 }}>{facility.name}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, fontSize:12, color:"var(--muted)" }}>
            <span>📅 {date}</span><span>📍 {facility.location}</span><span>👥 최대 {facility.capacity}명</span>
          </div>
          <div style={{ marginTop:6, fontSize:11, color:college.color, fontWeight:600 }}>{college.icon} {college.name}</div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
          <div><label style={lbl}>신청자명 *</label><input style={inp} placeholder="이름" value={form.applicant} onChange={e=>setForm({...form,applicant:e.target.value})} /></div>
          <div><label style={lbl}>소속 (학과/부서) *</label><input style={inp} placeholder="예: 컴퓨터공학과" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} /></div>
          <div><label style={lbl}>연락처 *</label><input style={inp} placeholder="010-0000-0000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
          <div><label style={lbl}>이용 인원 *</label><input style={inp} type="number" placeholder="인원 수" value={form.people} onChange={e=>setForm({...form,people:e.target.value})} /></div>
        </div>
        <label style={lbl}>사용 목적 *</label>
        <textarea style={{...inp,minHeight:55,resize:"vertical",marginBottom:10}} placeholder="시설 사용 목적" value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:8 }}>
          <div>
            <label style={lbl}>시작 시간</label>
            <select style={inp} value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})}>
              {TIME_SLOTS.slice(0,-1).map(t=>(<option key={t} value={t} disabled={taken.includes(t)}>{t}{taken.includes(t)?" (예약됨)":""}</option>))}
            </select>
          </div>
          <div>
            <label style={lbl}>종료 시간</label>
            <select style={inp} value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})}>
              {TIME_SLOTS.slice(1).map(t=>(<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
        </div>
        {taken.length>0 && <div style={{ fontSize:11, color:"#F59E0B", marginBottom:10 }}>⚠️ 예약된 시간: {taken.join(", ")}</div>}
        <button onClick={submit} style={{...primaryBtn, background:`linear-gradient(135deg, ${college.color}, ${college.color}CC)`}}>예약 신청하기</button>
      </div>
    </div>
  );
}

// ─── Admin Detail ───
function DetailModal({ res, onClose, onApprove, onReject }) {
  if(!res) return null;
  const fac = FACILITIES.find(f=>f.id===res.facilityId);
  const col = COLLEGES.find(c=>c.id===fac?.collegeId);
  const s = STATUS_MAP[res.status];
  const rows = [["시설명",fac?.name],["소속 대학",col?.name],["위치",fac?.location],["예약 날짜",res.date],["시간",`${res.startTime} ~ ${res.endTime}`],["신청자",res.applicant],["소속",res.department],["연락처",res.phone],["인원",`${res.people}명`],["목적",res.purpose]];
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ margin:0, fontSize:17, fontWeight:800, color:"var(--text)", fontFamily:"'Noto Sans KR'" }}>예약 상세</h3>
          <button onClick={onClose} style={{...navBtn,fontSize:18}}>✕</button>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:14 }}>
          <span style={{...badge, background:s.bg, color:s.color}}>{s.icon} {s.label}</span>
          <span style={{ fontSize:12, color:"var(--muted)" }}>신청일: {res.createdAt}</span>
        </div>
        <div style={{ background:"var(--bg)", borderRadius:12, padding:14, marginBottom:14 }}>
          {rows.map(([l,v])=>(<div key={l} style={{ display:"flex", padding:"7px 0", borderBottom:"1px solid var(--border)" }}>
            <span style={{ width:80, fontSize:12, fontWeight:600, color:"var(--muted)", flexShrink:0 }}>{l}</span>
            <span style={{ fontSize:12, color:"var(--text)", fontWeight:500 }}>{v}</span>
          </div>))}
        </div>
        {res.status==="pending" && (
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>onApprove(res.id)} style={{...primaryBtn, flex:1, background:"linear-gradient(135deg,#10B981,#34D399)"}}>✓ 승인</button>
            <button onClick={()=>onReject(res.id)} style={{...primaryBtn, flex:1, background:"linear-gradient(135deg,#EF4444,#F87171)"}}>✕ 거절</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ───
export default function App() {
  const [mode, setMode] = useState("user");
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [adminFilter, setAdminFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [userTab, setUserTab] = useState("book");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((m)=>{ setToast(m); setTimeout(()=>setToast(null),3000); },[]);
  const pendingCount = reservations.filter(r=>r.status==="pending").length;

  const handleSubmit = (data) => {
    setReservations(p=>[...p,{id:Date.now(),...data}]);
    setShowModal(false);
    showToast("예약이 신청되었습니다! 관리자 승인을 기다려 주세요.");
  };
  const handleApprove = (id) => { setReservations(p=>p.map(r=>r.id===id?{...r,status:"approved"}:r)); setDetail(null); showToast("예약이 승인되었습니다."); };
  const handleReject = (id) => { setReservations(p=>p.map(r=>r.id===id?{...r,status:"rejected"}:r)); setDetail(null); showToast("예약이 거절되었습니다."); };

  const filteredFacilities = FACILITIES.filter(f=>selectedCollege==="all"||f.collegeId===selectedCollege);
  const filteredRes = reservations.filter(r=>{
    if(adminFilter!=="all"&&r.status!==adminFilter) return false;
    const fac = FACILITIES.find(f=>f.id===r.facilityId);
    if(search && !r.applicant.includes(search) && !r.department.includes(search) && !(fac?.name||"").includes(search)) return false;
    return true;
  });
  const dateRes = reservations.filter(r=>r.date===selectedDate);

  return (
    <div style={{
      fontFamily:"'Noto Sans KR','Pretendard',sans-serif", minHeight:"100vh",
      background:"var(--bg)", color:"var(--text)",
      "--bg":"#F0F4F8", "--card":"#FFFFFF", "--text":"#1E293B", "--muted":"#64748B", "--border":"#E2E8F0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>

      {/* Header */}
      <header style={{ background:"linear-gradient(135deg,#0F172A 0%,#1E3A5F 40%,#2563EB 100%)", padding:"0 20px", position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 24px rgba(15,23,42,0.4)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", height:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:22 }}>🏫</span>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:15, letterSpacing:"-0.5px", lineHeight:1.2 }}>전주대학교</div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:10, fontWeight:500 }}>시설 예약 시스템</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:3, background:"rgba(255,255,255,0.1)", borderRadius:10, padding:3 }}>
            {[{k:"user",l:"이용자",i:"👤"},{k:"admin",l:"관리자",i:"⚙️"}].map(m=>(
              <button key={m.k} onClick={()=>setMode(m.k)} style={{
                padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                fontFamily:"'Noto Sans KR'", background:mode===m.k?"#fff":"transparent",
                color:mode===m.k?"#1E3A5F":"rgba(255,255,255,0.7)", transition:"all .2s",
                display:"flex", alignItems:"center", gap:4,
              }}>
                {m.i} {m.l}
                {m.k==="admin"&&pendingCount>0&&<span style={{ background:"#EF4444", color:"#fff", fontSize:9, fontWeight:700, borderRadius:10, padding:"1px 5px" }}>{pendingCount}</span>}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"20px 16px" }}>
        {/* ═══ USER ═══ */}
        {mode==="user" && (<>
          <div style={{ display:"flex", gap:4, marginBottom:16, background:"var(--card)", borderRadius:10, padding:3, border:"1px solid var(--border)", width:"fit-content" }}>
            {[{k:"book",l:"시설 예약",i:"🏢"},{k:"my",l:"내 예약",i:"📋"}].map(t=>(
              <button key={t.k} onClick={()=>setUserTab(t.k)} style={{
                padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                fontFamily:"'Noto Sans KR'", background:userTab===t.k?"#1E3A5F":"transparent",
                color:userTab===t.k?"#fff":"var(--muted)", transition:"all .2s",
              }}>{t.i} {t.l}</button>
            ))}
          </div>

          {userTab==="book" && (<>
            {/* College Filter */}
            <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
              <button onClick={()=>setSelectedCollege("all")} style={{
                padding:"6px 14px", borderRadius:20, border:"2px solid", fontSize:11, fontWeight:700, cursor:"pointer",
                fontFamily:"'Noto Sans KR'", whiteSpace:"nowrap",
                borderColor:selectedCollege==="all"?"#1E3A5F":"var(--border)",
                background:selectedCollege==="all"?"#1E3A5F":"var(--card)",
                color:selectedCollege==="all"?"#fff":"var(--muted)",
              }}>🏫 전체</button>
              {COLLEGES.map(c=>(
                <button key={c.id} onClick={()=>setSelectedCollege(c.id)} style={{
                  padding:"6px 14px", borderRadius:20, border:"2px solid", fontSize:11, fontWeight:700, cursor:"pointer",
                  fontFamily:"'Noto Sans KR'", whiteSpace:"nowrap",
                  borderColor:selectedCollege===c.id?c.color:"var(--border)",
                  background:selectedCollege===c.id?c.color:"var(--card)",
                  color:selectedCollege===c.id?"#fff":"var(--muted)",
                }}>{c.icon} {c.name.replace("대학","").replace("칼리지","")}</button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:16, alignItems:"start" }}>
              {/* Sidebar */}
              <div>
                <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} reservations={reservations} />
                <div style={{ marginTop:14, background:"var(--card)", borderRadius:14, padding:14, border:"1px solid var(--border)" }}>
                  <h4 style={{ margin:"0 0 8px", fontSize:13, fontWeight:700 }}>📌 {selectedDate} 예약현황</h4>
                  {dateRes.length===0 ? <p style={{ fontSize:11, color:"var(--muted)", margin:0 }}>예약 없음</p>
                    : dateRes.map(r=>{
                      const f=FACILITIES.find(x=>x.id===r.facilityId);
                      const c=COLLEGES.find(x=>x.id===f?.collegeId);
                      const st=STATUS_MAP[r.status];
                      return (<div key={r.id} style={{ padding:"6px 0", borderBottom:"1px solid var(--border)", fontSize:11 }}>
                        <div style={{ fontWeight:600, color:"var(--text)" }}>{f?.name}</div>
                        <div style={{ color:"var(--muted)" }}>{r.startTime}~{r.endTime} · {r.applicant}</div>
                        <div style={{ display:"flex", gap:6, marginTop:3, alignItems:"center" }}>
                          <span style={{...badge, background:st.bg, color:st.color, fontSize:9, padding:"1px 7px"}}>{st.label}</span>
                          <span style={{ fontSize:10, color:c?.color }}>{c?.icon} {c?.name}</span>
                        </div>
                      </div>);
                    })}
                </div>
              </div>

              {/* Facility Grid */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <h2 style={{ margin:0, fontSize:18, fontWeight:800, letterSpacing:"-0.5px" }}>
                    {selectedCollege==="all" ? "전체 시설" : COLLEGES.find(c=>c.id===selectedCollege)?.name + " 시설"}
                    <span style={{ fontSize:13, fontWeight:500, color:"var(--muted)", marginLeft:8 }}>{filteredFacilities.length}개</span>
                  </h2>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:12 }}>
                  {filteredFacilities.map(f=>{
                    const c = COLLEGES.find(x=>x.id===f.collegeId);
                    const cnt = reservations.filter(r=>r.facilityId===f.id&&r.date===selectedDate&&r.status!=="rejected").length;
                    return (
                      <div key={f.id} onClick={()=>{setSelectedFacility(f);setShowModal(true);}}
                        style={{ background:"var(--card)", borderRadius:14, padding:16, border:"1px solid var(--border)",
                          cursor:"pointer", transition:"all .2s", boxShadow:"0 2px 8px rgba(0,0,0,0.03)",
                          borderTop:`3px solid ${c.color}`,
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)";}}
                        onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.03)";}}
                      >
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                          <span style={{ fontSize:26 }}>{TYPE_ICONS[f.type]||"📋"}</span>
                          <span style={{ fontSize:9, fontWeight:700, color:c.color, background:c.color+"15", padding:"2px 8px", borderRadius:10 }}>{c.name.replace("대학","").replace("칼리지","")}</span>
                        </div>
                        <div style={{ fontWeight:700, fontSize:14, color:"var(--text)", marginBottom:3 }}>{f.name}</div>
                        <div style={{ fontSize:11, color:"var(--muted)", marginBottom:6 }}>{f.description}</div>
                        <div style={{ display:"flex", gap:8, fontSize:10, color:"var(--muted)" }}>
                          <span>📍 {f.location}</span><span>👥 {f.capacity}명</span>
                        </div>
                        {cnt>0 && <div style={{ marginTop:8, fontSize:10, color:"#F59E0B", fontWeight:600 }}>⏰ {selectedDate} {cnt}건 예약</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>)}

          {userTab==="my" && (
            <div style={{ background:"var(--card)", borderRadius:14, padding:18, border:"1px solid var(--border)" }}>
              <h3 style={{ margin:"0 0 14px", fontSize:16, fontWeight:800 }}>내 예약 현황</h3>
              {reservations.map(r=>{
                const f=FACILITIES.find(x=>x.id===r.facilityId);
                const c=COLLEGES.find(x=>x.id===f?.collegeId);
                const st=STATUS_MAP[r.status];
                return (
                  <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", borderRadius:12, background:"var(--bg)", border:"1px solid var(--border)", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:42, height:42, borderRadius:10, background:c?.color+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{TYPE_ICONS[f?.type]||"📋"}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13 }}>{f?.name} <span style={{ fontSize:10, color:c?.color, fontWeight:600 }}>({c?.name})</span></div>
                        <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{r.date} · {r.startTime}~{r.endTime} · {r.purpose}</div>
                      </div>
                    </div>
                    <span style={{...badge, background:st.bg, color:st.color}}>{st.icon} {st.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>)}

        {/* ═══ ADMIN ═══ */}
        {mode==="admin" && (<>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
            {[
              {l:"전체",v:reservations.length,i:"📊",c:"#2563EB",b:"#EFF6FF"},
              {l:"승인 대기",v:reservations.filter(r=>r.status==="pending").length,i:"⏳",c:"#F59E0B",b:"#FEF3C7"},
              {l:"승인 완료",v:reservations.filter(r=>r.status==="approved").length,i:"✅",c:"#10B981",b:"#D1FAE5"},
              {l:"거절",v:reservations.filter(r=>r.status==="rejected").length,i:"❌",c:"#EF4444",b:"#FEE2E2"},
            ].map(s=>(
              <div key={s.l} style={{ background:"var(--card)", borderRadius:14, padding:"16px 14px", border:"1px solid var(--border)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:11, color:"var(--muted)", fontWeight:500, marginBottom:3 }}>{s.l}</div>
                    <div style={{ fontSize:26, fontWeight:800, color:s.c }}>{s.v}</div>
                  </div>
                  <div style={{ width:40, height:40, borderRadius:10, background:s.b, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{s.i}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16, alignItems:"start" }}>
            <div style={{ background:"var(--card)", borderRadius:14, padding:18, border:"1px solid var(--border)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
                <h3 style={{ margin:0, fontSize:16, fontWeight:800 }}>예약 관리</h3>
                <div style={{ display:"flex", gap:4 }}>
                  {[{k:"all",l:"전체"},{k:"pending",l:"대기"},{k:"approved",l:"승인"},{k:"rejected",l:"거절"}].map(f=>(
                    <button key={f.k} onClick={()=>setAdminFilter(f.k)} style={{
                      padding:"4px 10px", borderRadius:7, border:"1px solid",
                      borderColor:adminFilter===f.k?"#1E3A5F":"var(--border)",
                      background:adminFilter===f.k?"#1E3A5F":"transparent",
                      color:adminFilter===f.k?"#fff":"var(--muted)",
                      fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Noto Sans KR'",
                    }}>{f.l}</button>
                  ))}
                </div>
              </div>
              <input style={{...inp, marginBottom:12}} placeholder="🔍 신청자, 시설명, 소속 검색..." value={search} onChange={e=>setSearch(e.target.value)} />
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {filteredRes.length===0 && <p style={{ textAlign:"center", color:"var(--muted)", padding:16, fontSize:13 }}>해당 예약 없음</p>}
                {filteredRes.map(r=>{
                  const f=FACILITIES.find(x=>x.id===r.facilityId);
                  const c=COLLEGES.find(x=>x.id===f?.collegeId);
                  const st=STATUS_MAP[r.status];
                  return (
                    <div key={r.id} onClick={()=>setDetail(r)} style={{
                      display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", borderRadius:10,
                      background:r.status==="pending"?"#FFFBEB":"var(--bg)", border:r.status==="pending"?"1px solid #FDE68A":"1px solid var(--border)",
                      cursor:"pointer", transition:"all .15s",
                    }} onMouseEnter={e=>{e.currentTarget.style.transform="translateX(3px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ color:c?.color }}>{c?.icon}</span> {f?.name} — {r.applicant}
                          <span style={{ fontWeight:400, color:"var(--muted)", fontSize:11 }}>({r.department})</span>
                        </div>
                        <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{r.date} · {r.startTime}~{r.endTime} · {r.purpose}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                        <span style={{...badge, background:st.bg, color:st.color, fontSize:10}}>{st.icon} {st.label}</span>
                        {r.status==="pending" && (<div style={{ display:"flex", gap:3 }}>
                          <button onClick={e=>{e.stopPropagation();handleApprove(r.id);}} style={smBtn} title="승인">✓</button>
                          <button onClick={e=>{e.stopPropagation();handleReject(r.id);}} style={{...smBtn,background:"#FEE2E2",color:"#EF4444",border:"1px solid #FEE2E2"}} title="거절">✕</button>
                        </div>)}
                        <span style={{ fontSize:13, color:"var(--muted)" }}>›</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} reservations={reservations} />
          </div>
        </>)}
      </div>

      {showModal && selectedFacility && (
        <ReservationModal facility={selectedFacility} college={COLLEGES.find(c=>c.id===selectedFacility.collegeId)} date={selectedDate} onClose={()=>setShowModal(false)} onSubmit={handleSubmit} reservations={reservations} />
      )}
      {detail && <DetailModal res={detail} onClose={()=>setDetail(null)} onApprove={handleApprove} onReject={handleReject} />}

      {toast && (
        <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", background:"#0F172A", color:"#fff", padding:"10px 22px", borderRadius:12, fontSize:13, fontWeight:600, boxShadow:"0 8px 32px rgba(0,0,0,0.25)", zIndex:1000, animation:"su .3s ease", fontFamily:"'Noto Sans KR'" }}>{toast}</div>
      )}

      <style>{`
        @keyframes su { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        *{box-sizing:border-box}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#2563EB !important;box-shadow:0 0 0 3px rgba(37,99,235,0.1)}
        ::-webkit-scrollbar{width:5px;height:5px} ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
      `}</style>
    </div>
  );
}

// ─── Styles ───
const navBtn = { background:"none", border:"none", cursor:"pointer", fontSize:15, color:"var(--muted)", padding:"4px 8px", borderRadius:6 };
const lbl = { display:"block", fontSize:11, fontWeight:600, color:"var(--muted)", marginBottom:3 };
const inp = { width:"100%", padding:"9px 11px", borderRadius:9, border:"1px solid var(--border)", fontSize:12, fontFamily:"'Noto Sans KR'", color:"var(--text)", background:"var(--bg)", transition:"all .15s" };
const primaryBtn = { width:"100%", padding:"11px", borderRadius:11, border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Noto Sans KR'", transition:"all .2s", boxShadow:"0 4px 12px rgba(0,0,0,0.15)" };
const badge = { display:"inline-block", padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:700 };
const overlay = { position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200 };
const modal = { background:"#fff", borderRadius:18, padding:22, width:"90%", maxWidth:500, maxHeight:"85vh", overflow:"auto", boxShadow:"0 24px 48px rgba(0,0,0,0.15)" };
const smBtn = { width:26, height:26, borderRadius:7, border:"1px solid #D1FAE5", background:"#D1FAE5", color:"#10B981", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" };
