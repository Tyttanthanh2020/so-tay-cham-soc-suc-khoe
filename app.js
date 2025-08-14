(() => {
  const { useState, useMemo } = React;
  const e = React.createElement;

  const AGE_GROUPS = [
    { id: "0-5", label: "Trẻ 0–5 tuổi" },
    { id: "6-17", label: "6–17 tuổi" },
    { id: "18-59", label: "Người trưởng thành 18–59" },
    { id: "60+", label: "Người cao tuổi 60+" },
  ];

  const CONDITIONS = [
    { id: "none", label: "Không bệnh mạn tính" },
    { id: "htn", label: "Tăng huyết áp" },
    { id: "dm2", label: "Đái tháo đường typ 2" },
    { id: "dyslipidemia", label: "Rối loạn mỡ máu" },
    { id: "copd_asthma", label: "COPD/hen phế quản" },
    { id: "obesity", label: "Thừa cân/béo phì" },
    { id: "pregnancy", label: "Thai kỳ" },
    { id: "mental", label: "Sức khỏe tinh thần" },
  ];

  const VACCINE_BY_AGE = {
    "0-5": [
      "Tiêm chủng mở rộng đầy đủ theo lịch quốc gia.",
      "Nhắc sởi—rubella, IPV/OPV, DPT-VGB-Hib theo lịch.",
    ],
    "6-17": [
      "Nhắc vắc xin sởi—rubella, bạch hầu—uốn ván—ho gà.",
      "HPV cho trẻ gái/bé trai theo khuyến cáo.",
    ],
    "18-59": [
      "Cúm hằng năm; uốn ván—bạch hầu mỗi 10 năm.",
      "Viêm gan B nếu chưa đủ mũi; COVID-19 theo hướng dẫn hiện hành.",
    ],
    "60+": [
      "Cúm hằng năm; phế cầu (PCV/PPSV) theo chỉ định.",
      "Nhắc uốn ván—bạch hầu; zona (nếu có).",
    ],
  };

  const SCREENING_BY_AGE = {
    "6-17": ["Khám mắt, răng miệng 6–12 tháng/lần.", "Đánh giá tâm lý—hành vi, dinh dưỡng & thể lực."],
    "18-59": [
      "Đo huyết áp mỗi lần khám hoặc ít nhất 6–12 tháng/lần.",
      "Đường huyết lúc đói 1–3 năm/lần tùy nguy cơ.",
      "Lipid máu 3–5 năm/lần; phụ nữ: Pap test/HPV theo hướng dẫn."
    ],
    "60+": [
      "Huyết áp, đường huyết, lipid 6–12 tháng/lần.",
      "Tầm soát suy giảm nhận thức, trầm cảm, nguy cơ té ngã.",
    ],
  };

  const LIFESTYLE_BASE = {
    common: [
      "Ăn cân đối: 1/2 rau—quả; 1/4 đạm (ưu tiên cá, đậu); 1/4 tinh bột nguyên hạt.",
      "Hạn muối <5g/ngày; hạn đường tự do; tránh rượu/bia; không hút thuốc.",
      "Vận động tối thiểu 150 phút/tuần (trẻ em ≥60 phút/ngày).",
      "Ngủ đủ (trẻ: theo lứa tuổi; người lớn: 7–8 giờ/đêm).",
      "Sức khỏe tinh thần: hít thở sâu 5 phút/ngày, kết nối gia đình, hạn chế màn hình.",
    ],
    htn: [
      "Theo dõi huyết áp tại nhà: sáng & tối 5–7 ngày/tuần, ghi sổ.",
      "Giảm muối, ưu tiên DASH; đi bộ nhanh 30 phút/ngày.",
      "Tuân thủ thuốc; không tự ý bỏ thuốc; mang đơn khi tái khám.",
    ],
    dm2: [
      "Theo dõi đường huyết theo hướng dẫn; chú ý hạ đường huyết (run, vã mồ hôi, đói cồn cào).",
      "Chia nhỏ bữa; ưu tiên ngũ cốc nguyên hạt; kiểm soát khẩu phần.",
      "Chăm sóc bàn chân hằng ngày; kiểm tra mắt định kỳ.",
    ],
    dyslipidemia: [
      "Giảm mỡ bão hòa & trans; tăng chất xơ hòa tan (yến mạch, đậu).",
      "Tuân thủ statin nếu được kê; theo dõi men gan, lipid theo hẹn.",
    ],
    copd_asthma: [
      "Tránh khói thuốc, bụi, khói bếp; tập thở chúm môi; tập phục hồi hô hấp.",
      "Dùng thuốc giãn phế quản/corticoid hít đúng kỹ thuật; mang theo khi đi xa.",
    ],
    obesity: [
      "Mục tiêu giảm 5–10% cân nặng trong 3–6 tháng.",
      "Theo dõi kcal; tăng vận động sức bền + kháng lực 2–3 buổi/tuần.",
    ],
    pregnancy: [
      "Bổ sung sắt/axit folic theo chỉ định; khám thai đúng lịch.",
      "Tránh rượu, thuốc lá; ăn chín uống sôi; vận động nhẹ phù hợp.",
    ],
    mental: [
      "Thư giãn 4-7-8; duy trì giao tiếp xã hội.",
      "Nếu buồn bã >2 tuần hoặc có ý nghĩ tự hại → đi khám ngay.",
    ],
  };

  const RED_FLAGS = {
    common: [
      "Đau ngực, khó thở dữ dội, yếu liệt đột ngột, nói khó, co giật.",
      "Sốt cao >48–72 giờ hoặc sốt kèm phát ban lan rộng.",
      "Mất ý thức, chảy máu không cầm, nôn ói/tiêu chảy mất nước nặng.",
    ],
    htn: ["HA ≥180/120 mmHg kèm đau đầu dữ dội/đau ngực/khó thở."],
    dm2: ["Đường huyết >300 mg/dL hoặc <70 mg/dL kèm triệu chứng."],
    copd_asthma: ["Khó thở tăng nhanh, nói từng từ, tím tái, SpO₂ <92%."],
  };

  function Chip({ selected, onClick, children }) {
    return React.createElement(
      "button",
      {
        onClick,
        className: "px-3 py-1 rounded-2xl border text-sm transition shadow-sm hover:shadow " + (selected ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"),
      },
      children
    );
  }

  function Section({ title, children }) {
    return e("div", { className: "bg-white rounded-2xl shadow-sm p-4 md:p-6 border mb-4" },
      e("h3", { className: "text-lg md:text-xl font-semibold mb-2" }, title),
      e("div", { className: "text-gray-700 leading-relaxed" }, children)
    );
  }

  function SimpleLineChart({ data }) {
    // Draw a minimal responsive SVG line chart for sys & dia
    const width = 600, height = 160, padding = 30;
    const xs = data.map((_, i) => i);
    const sys = data.map(d => d.sys);
    const dia = data.map(d => d.dia);
    const minY = 60, maxY = 200;
    function x(i){ return padding + (i * (width - 2*padding)) / Math.max(1, data.length - 1); }
    function y(v){ return height - padding - ( (v - minY) * (height - 2*padding) / (maxY - minY) ); }
    function path(series) {
      return series.map((v, i) => (i===0 ? "M" : "L") + x(i) + " " + y(v)).join(" ");
    }
    const sysPath = path(sys);
    const diaPath = path(dia);
    const labels = data.map(d => d.t || "");
    return e("svg", { viewBox: `0 0 ${width} ${height}`, className: "w-full h-40 border rounded-xl bg-white" },
      // axes
      e("line", { x1: padding, y1: height - padding, x2: width - padding, y2: height - padding, stroke: "#cbd5e1" }),
      e("line", { x1: padding, y1: padding, x2: padding, y2: height - padding, stroke: "#cbd5e1" }),
      // sys
      e("path", { d: sysPath, fill: "none", stroke: "#ef4444", "strokeWidth": 2 }),
      // dia
      e("path", { d: diaPath, fill: "none", stroke: "#3b82f6", "strokeWidth": 2 }),
      // points
      data.map((d,i)=> e("circle", { key: "s"+i, cx: x(i), cy: y(d.sys), r: 2, fill: "#ef4444" })),
      data.map((d,i)=> e("circle", { key: "d"+i, cx: x(i), cy: y(d.dia), r: 2, fill: "#3b82f6" }))
    );
  }

  function App() {
    const [age, setAge] = useState((window.__ZALO__ && window.__ZALO__.params.get("age")) || "18-59");
    const [conds, setConds] = useState(() => {
      try {
        const p = (window.__ZALO__ && window.__ZALO__.params.get("conds")) || "none";
        const arr = p.split(',').map(s=>s.trim()).filter(Boolean);
        return arr.length ? arr : ["none"];
      } catch(e){ return ["none"]; }
    });
    const [height, setHeight] = useState(165);
    const [weight, setWeight] = useState(62);
    const [bpSeries, setBpSeries] = useState([
      { t: "Hôm qua sáng", sys: 134, dia: 84 },
      { t: "Hôm qua tối", sys: 128, dia: 80 },
      { t: "Hôm nay sáng", sys: 130, dia: 82 },
    ]);
    const [newSys, setNewSys] = useState(120);
    const [newDia, setNewDia] = useState(80);
    const [newLabel, setNewLabel] = useState("");

    const bmi = useMemo(() => {
      const m = height / 100;
      return (weight && height) ? (weight / (m * m)) : 0;
    }, [height, weight]);

    const bmiLabel = useMemo(() => {
      if (!bmi) return "";
      if (bmi < 18.5) return "Thiếu cân";
      if (bmi < 23) return "Bình thường (chuẩn châu Á)";
      if (bmi < 25) return "Thừa cân";
      return "Béo phì";
    }, [bmi]);

    function isSelected(id){ return conds.includes(id); }
    function toggleCond(id){
      setConds(prev => {
        if (id === "none") return ["none"];
        const filtered = prev.filter(x => x !== "none");
        return filtered.includes(id) ? filtered.filter(x => x !== id) : [...filtered, id];
      });
    }

    const plan = useMemo(() => {
      const blocks = [];
      const vax = VACCINE_BY_AGE[age] || [];
      const screen = SCREENING_BY_AGE[age] || [];
      const LIFESTYLE_KEYS = Object.keys(LIFESTYLE_BASE).filter(k => k !== "common");
      const lifestyle = [...LIFESTYLE_BASE.common];
      const redflags = [...RED_FLAGS.common];

      conds.forEach(c => {
        if (c === "none") return;
        if (LIFESTYLE_BASE[c]) lifestyle.push(...LIFESTYLE_BASE[c]);
        if (RED_FLAGS[c]) redflags.push(...RED_FLAGS[c]);
      });

      blocks.push({ title: "Thói quen sống & dinh dưỡng", items: lifestyle });
      blocks.push({ title: "Tiêm chủng theo lứa tuổi", items: vax });
      if (screen.length) blocks.push({ title: "Tầm soát định kỳ", items: screen });

      const monitoring = [];
      if (conds.includes("htn")) monitoring.push("Đo HA tại nhà sáng/tối, ghi lại trung bình tuần.");
      if (conds.includes("dm2")) monitoring.push("Theo dõi đường huyết & HbA1c; nhật ký ăn uống—vận động.");
      if (conds.includes("copd_asthma")) monitoring.push("Theo dõi triệu chứng/đỉnh lưu lượng thở nếu có dụng cụ.");
      if (monitoring.length) blocks.push({ title: "Theo dõi tại nhà", items: monitoring });

      blocks.push({ title: "Dụng cụ & sơ cứu tại nhà", items: [
        "Bộ thuốc gia đình: paracetamol, oresol, băng gạc, nhiệt kế, máy đo HA, SpO₂.",
        "Sơ cứu: cầm máu—băng ép; RICE cho bong gân; gọi cấp cứu khi đa chấn thương.",
        "Vệ sinh môi trường: nước sạch, nhà vệ sinh, xử lý rác; loại bỏ lăng quăng mỗi tuần.",
      ]});
      blocks.push({ title: "Dấu hiệu cần đi khám ngay", items: redflags });
      return blocks;
    }, [age, conds]);

    function addBp(){
      if(!newLabel) return;
      const entry = { t: newLabel, sys: Number(newSys), dia: Number(newDia) };
      setBpSeries(s => [...s, entry]);
      setNewLabel("");
    }

    function resetAll() {
      setAge("18-59");
      setConds(["none"]);
      setHeight(165);
      setWeight(62);
      setBpSeries([
        { t: "Hôm qua sáng", sys: 134, dia: 84 },
        { t: "Hôm qua tối", sys: 128, dia: 80 },
        { t: "Hôm nay sáng", sys: 130, dia: 82 },
      ]);
      setNewSys(120); setNewDia(80); setNewLabel("");
    }

    return e("div", { className: "min-h-screen" },
      e("header", { className: "sticky top-0 z-10 bg-white/90 backdrop-blur border-b" },
        e("div", { className: "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" },
          e("div", { className: "flex items-center gap-2" },
            e("img", { src: "icon-192.png", className: "w-6 h-6", alt: "logo" }),
            e("h1", { className: "text-xl md:text-2xl font-bold" }, "Sổ tay điện tử – Sức khỏe gia đình")
          ),
          e("div", { className: "hidden md:block text-sm text-slate-500" }, "Mang tính giáo dục, không thay thế chẩn đoán—điều trị.")
        )
      ),
      e("main", { className: "max-w-6xl mx-auto p-4 md:p-6" },
        e("div", { className: "grid md:grid-cols-3 gap-4 mb-4" },
          e("div", { className: "bg-white rounded-2xl shadow-sm border p-4" },
            e("h2", { className: "font-semibold mb-2" }, "1) Chọn lứa tuổi"),
            e("div", { className: "flex flex-wrap gap-2" },
              AGE_GROUPS.map(g => e(Chip, { key: g.id, selected: age === g.id, onClick: ()=>setAge(g.id) }, g.label))
            )
          ),
          e("div", { className: "bg-white rounded-2xl shadow-sm border p-4 md:col-span-2" },
            e("h2", { className: "font-semibold mb-2" }, "2) Chọn bệnh lý (nếu có)"),
            e("div", { className: "flex flex-wrap gap-2" },
              CONDITIONS.map(c => e(Chip, { key: c.id, selected: conds.includes(c.id), onClick: ()=>toggleCond(c.id) }, c.label))
            ),
            e("p", { className: "mt-2 text-xs text-slate-500" }, "* Chọn \"Không bệnh mạn tính\" sẽ bỏ các lựa chọn khác.")
          )
        ),
        e("div", { className: "grid md:grid-cols-3 gap-4 mb-6" },
          e(Section, { title: "Chia sẻ đường dẫn nhanh" },
            e("p", { className: "text-sm mb-2" }, "Tạo link mở sẵn đúng lứa tuổi & bệnh lý từ menu Zalo."),
            e("button", { className: "px-3 py-2 rounded-xl border", onClick: ()=>{
              const url = new URL(location.href.split('#')[0]);
              url.searchParams.set('age', age);
              const c = conds.join(',');
              url.searchParams.set('conds', c);
              navigator.clipboard && navigator.clipboard.writeText(url.toString());
              alert('Đã copy link vào clipboard:\n' + url.toString());
            }}, "Copy link cấu hình hiện tại")
          ),

          e(Section, { title: "Chỉ số cơ thể (BMI)" },
            e("div", { className: "grid grid-cols-2 gap-3" },
              e("div", null,
                e("label", { className: "text-sm text-slate-600" }, "Chiều cao (cm)"),
                e("input", { type: "number", className: "mt-1 w-full border rounded-xl px-3 py-2", value: height, onChange: ev => setHeight(Number(ev.target.value)) })
              ),
              e("div", null,
                e("label", { className: "text-sm text-slate-600" }, "Cân nặng (kg)"),
                e("input", { type: "number", className: "mt-1 w-full border rounded-xl px-3 py-2", value: weight, onChange: ev => setWeight(Number(ev.target.value)) })
              )
            ),
            e("div", { className: "mt-3 text-sm" },
              e("span", { className: "font-semibold" }, "BMI: ", bmi ? bmi.toFixed(1) : "—"),
              bmi ? e("span", { className: "ml-2 text-slate-600" }, "(", bmiLabel, ")") : null
            )
          ),
          e(Section, { title: "Nhật ký huyết áp" },
            e("div", { className: "grid grid-cols-3 gap-2" },
              e("input", { placeholder: "Nhãn (vd: Hôm nay tối)", className: "border rounded-xl px-3 py-2 col-span-3", value: newLabel, onChange: ev => setNewLabel(ev.target.value) }),
              e("input", { type: "number", placeholder: "Tâm thu", className: "border rounded-xl px-3 py-2", value: newSys, onChange: ev => setNewSys(ev.target.value) }),
              e("input", { type: "number", placeholder: "Tâm trương", className: "border rounded-xl px-3 py-2", value: newDia, onChange: ev => setNewDia(ev.target.value) }),
              e("button", { onClick: addBp, className: "px-3 py-2 rounded-xl bg-blue-600 text-white" }, "Thêm")
            ),
            e("div", { className: "mt-3" }, e(SimpleLineChart, { data: bpSeries }))
          ),
          e(Section, { title: "In/Lưu hướng dẫn" },
            e("p", { className: "text-sm" }, "Bấm nút để in hoặc lưu PDF (Ctrl/Cmd+P)."),
            e("button", { onClick: () => window.print(), className: "mt-2 px-4 py-2 rounded-xl bg-slate-800 text-white" }, "In / Lưu PDF"),
            e("button", { onClick: resetAll, className: "mt-2 ml-2 px-4 py-2 rounded-xl border" }, "Đặt lại")
          )
        ),
        e("div", { className: "space-y-4" },
          plan.map((block, idx) => e("div", { key: block.title, className: "bg-white rounded-2xl shadow-sm p-4 md:p-6 border" },
            e("h3", { className: "text-lg md:text-xl font-semibold mb-2" }, block.title),
            e("ul", { className: "list-disc pl-5 space-y-1" }, block.items.map((it, i) => e("li", { key: i }, it)))
          ))
        ),
        e("div", { className: "mt-6 text-xs text-slate-500" },
          "© ", new Date().getFullYear(), " – Dùng cho truyền thông & giáo dục sức khỏe. Luôn tham khảo bác sĩ gia đình/Trạm Y tế khi có câu hỏi về chẩn đoán/điều trị."
        )
      )
    );
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();