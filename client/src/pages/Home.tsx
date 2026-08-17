/**
 * خريطة ريحانة الذهبية: واجهة سفر تحريرية عربية، زمردية وذهبية، تركز على مسار واضح من الإلهام إلى حجز واتساب.
 */
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowUpLeft,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  Clock3,
  Globe2,
  Hotel,
  Instagram,
  Landmark,
  Luggage,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plane,
  PlaneTakeoff,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Ticket,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BookingType = "flight" | "hotel" | "package" | "umrah";

const CONTACT = {
  whatsapp: "249900000000",
  phone: "+249 90 000 0000",
  email: "info@rayhana-travel.com",
  city: "الخرطوم، السودان",
};

const NAV_ITEMS = [
  ["الخدمات", "#services"],
  ["ابدأ الحجز", "#booking"],
  ["الوجهات", "#destinations"],
  ["عن ريحانة", "#about"],
  ["تواصل", "#contact"],
];

const SERVICES = [
  { icon: Plane, title: "تذاكر طيران", text: "خيارات مرنة لرحلات الذهاب والعودة بحسب الموعد والميزانية.", label: "طيران" },
  { icon: Hotel, title: "إقامات وفنادق", text: "ترشيحات إقامة مدروسة تجمع الموقع المريح والتجربة المناسبة.", label: "إقامة" },
  { icon: Landmark, title: "تأشيرات وسفر", text: "مساعدة منظمة في تجهيز مسار السفر والمستندات المطلوبة.", label: "تأشيرات" },
  { icon: Sparkles, title: "باقات مصممة لك", text: "رحلات عائلية وتجارب خاصة تُبنى حول ما تحبه أنت.", label: "باقات" },
];

const DESTINATIONS = [
  {
    city: "مكة والمدينة",
    country: "المملكة العربية السعودية",
    note: "برنامج عمرة بهدوء وترتيب واضح من البداية.",
    image: "/manus-storage/rehana-umrah-destination_19a63535.jpg",
    tag: "عمرة وروحانية",
  },
  {
    city: "إسطنبول وطرابزون",
    country: "تركيا",
    note: "مدن نابضة وطبيعة خضراء وبرامج مناسبة للعائلة.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1400&q=85",
    tag: "مدينة وطبيعة",
  },
  {
    city: "دبي وأبوظبي",
    country: "الإمارات العربية المتحدة",
    note: "إقامة مرنة وتجارب حضرية وتسوق بأسلوبك.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85",
    tag: "تجربة حضرية",
  },
  {
    city: "القاهرة والغردقة",
    country: "مصر",
    note: "بين التاريخ والبحر، نرتب لك إجازة على مقاسك.",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1400&q=85",
    tag: "تاريخ وشاطئ",
  },
  {
    city: "رحلتك إلى العالم",
    country: "وجهات حسب الطلب",
    note: "أخبرنا بالموعد والميزانية، ونبدأ بترتيب الاحتمالات.",
    image: "/manus-storage/rehana-world-journey_db25ed72.jpg",
    tag: "مسارات خاصة",
  },
];

const BOOKING_TABS: { id: BookingType; label: string; icon: typeof Plane }[] = [
  { id: "flight", label: "طيران", icon: Plane },
  { id: "hotel", label: "فنادق", icon: Hotel },
  { id: "package", label: "باقة", icon: Luggage },
  { id: "umrah", label: "عمرة", icon: Landmark },
];

function openWhatsApp(message: string) {
  const url = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  window.dispatchEvent(new CustomEvent("rehana:whatsapp-opened"));
}

function scrollToBooking(type?: BookingType) {
  if (type) {
    window.dispatchEvent(new CustomEvent("rehana:set-booking-type", { detail: type }));
  }
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow: string; title: string; description?: string; light?: boolean }) {
  return (
    <div className={light ? "max-w-2xl" : "max-w-2xl"}>
      <div className={light ? "section-kicker text-[#D9AE50]" : "section-kicker"}>{eyebrow}</div>
      <h2 className={`mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl ${light ? "text-white" : "text-[#063e37]"}`}>{title}</h2>
      {description ? <p className={`mt-4 max-w-xl text-base leading-8 ${light ? "text-white/70" : "text-[#52625e]"}`}>{description}</p> : null}
    </div>
  );
}

function RouteRibbon({ index, from, to }: { index: string; from: string; to: string }) {
  return <div className="route-ribbon mx-auto max-w-7xl px-5 lg:px-8" aria-hidden="true"><span className="route-stamp">{index}</span><span className="route-node route-node-start" /><span className="route-label route-label-start">{from}</span><span className="route-node route-node-end" /><span className="route-label route-label-end">{to}</span></div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>("flight");
  const [selectedDestination, setSelectedDestination] = useState<(typeof DESTINATIONS)[number] | null>(null);
  const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    const onSetBookingType = (event: Event) => setBookingType((event as CustomEvent<BookingType>).detail);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("rehana:set-booking-type", onSetBookingType);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("rehana:set-booking-type", onSetBookingType);
    };
  }, []);

  useEffect(() => {
    const onWhatsAppOpened = () => {
      setNotification({ title: "واتساب جاهز", body: "جهزنا لك الرسالة. أكمل الإرسال وسيتابع فريق ريحانة طلبك." });
      window.setTimeout(() => setNotification(null), 4200);
    };
    window.addEventListener("rehana:whatsapp-opened", onWhatsAppOpened);
    return () => window.removeEventListener("rehana:whatsapp-opened", onWhatsAppOpened);
  }, []);

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const lines = ["السلام عليكم، أريد طلب حجز من ريحانة للسفر والسياحة."];

    if (bookingType === "flight") {
      lines.push("الخدمة: تذاكر طيران", `من: ${values.get("from")}`, `إلى: ${values.get("to")}`, `المغادرة: ${values.get("depart")}`, `العودة: ${values.get("return") || "غير محددة"}`, `البالغون: ${values.get("adults")}`, `الأطفال: ${values.get("children")}`);
    }
    if (bookingType === "hotel") {
      lines.push("الخدمة: حجز فندق", `الوجهة أو الفندق: ${values.get("destination")}`, `الوصول: ${values.get("checkin")}`, `المغادرة: ${values.get("checkout")}`, `الغرف: ${values.get("rooms")}`, `الضيوف: ${values.get("guests")}`);
    }
    if (bookingType === "package") {
      lines.push("الخدمة: باقة سياحية", `الوجهة: ${values.get("packageDestination")}`, `المدة: ${values.get("duration")}`, `تاريخ السفر: ${values.get("packageDate")}`, `عدد المسافرين: ${values.get("travelers")}`);
    }
    if (bookingType === "umrah") {
      lines.push("الخدمة: برنامج عمرة", `المدة: ${values.get("umrahDuration")}`, `نوع الغرفة: ${values.get("roomType")}`, `تاريخ السفر: ${values.get("umrahDate")}`, `عدد المسافرين: ${values.get("umrahTravelers")}`);
    }
    openWhatsApp(lines.join("\n"));
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    openWhatsApp([
      "السلام عليكم، أريد التواصل مع ريحانة للسفر والسياحة.",
      `الاسم: ${values.get("name")}`,
      `الهاتف: ${values.get("phone")}`,
      `الخدمة: ${values.get("service")}`,
      `الرسالة: ${values.get("message")}`,
    ].join("\n"));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffdf8] text-[#19352f]" dir="rtl">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-[#075B50]/10 bg-[#fffdf8]/94 py-2 shadow-[0_10px_34px_rgba(7,91,80,.08)] backdrop-blur-xl" : "py-5"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#home" className="group flex items-center gap-3" aria-label="العودة إلى الرئيسية">
            <img src="/manus-storage/rehana-new-logo-original_0f88c17c.png" alt="شعار ريحانة للسفر والسياحة" className="h-16 w-16 object-contain mix-blend-screen transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="التنقل الرئيسي">
            {NAV_ITEMS.map(([label, href]) => <a key={href} href={href} className={`nav-link text-sm font-bold ${scrolled ? "text-[#30524a]" : "text-white/90"}`}>{label}</a>)}
          </nav>

          <div className="hidden lg:block">
            <Button onClick={() => scrollToBooking()} className="action-gold h-11 rounded-full px-6 font-bold text-[#1b3a33] shadow-[0_12px_28px_rgba(212,168,67,.26)]">ابدأ رحلتك <ArrowUpLeft className="size-4" /></Button>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} className={`lg:hidden ${scrolled ? "text-[#075B50]" : "text-white"}`} aria-label="فتح القائمة">
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen ? (
          <div className="mx-4 mt-3 rounded-2xl border border-[#d5b260]/25 bg-[#073f36]/98 p-4 shadow-2xl lg:hidden">
            {NAV_ITEMS.map(([label, href]) => <a key={href} onClick={() => setMenuOpen(false)} href={href} className="block border-b border-white/10 py-3 text-sm font-bold text-white last:border-0">{label}</a>)}
            <Button onClick={() => { setMenuOpen(false); scrollToBooking(); }} className="action-gold mt-3 w-full rounded-xl text-[#17372f]">ابدأ الحجز</Button>
          </div>
        ) : null}
      </header>

      <main>
        <section id="home" className="relative min-h-[740px] overflow-hidden bg-[#073f36] pt-28 lg:min-h-[810px]">
          <img src="/manus-storage/rehana-hero-travel_2bb5eab2.jpg" alt="مسافر سوداني يطل على رحلة طيران وقت الغروب" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,61,53,.96)_0%,rgba(7,61,53,.78)_44%,rgba(7,61,53,.34)_72%,rgba(7,61,53,.12)_100%)]" />
          <div className="hero-halo absolute -right-44 top-24 h-[540px] w-[540px] rounded-full border border-[#e2bb64]/25" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fffdf8] to-transparent" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-24 pt-28 lg:grid-cols-[.96fr_1.04fr] lg:items-end lg:px-8 lg:pt-40">
            <div className="max-w-xl">
              <div className="travel-pill mb-7 inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#dfb85d]" /> رتّب رحلتك بثقة</div>
              <h1 className="font-display text-5xl font-extrabold leading-[1.15] text-white sm:text-6xl xl:text-7xl">
                العالم واسع،<br />
                <span className="text-[#e2bd69]">وخطوتك الأولى</span><br />
                تبدأ من هنا.
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-9 text-white/75">من تذكرة الطيران إلى الإقامة والتأشيرة، نرتّب لك مساراً واضحاً يناسب وقتك ووجهتك وميزانيتك.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button onClick={() => scrollToBooking()} className="action-gold h-13 rounded-full px-7 text-base font-extrabold text-[#17372f] shadow-[0_16px_32px_rgba(212,168,67,.28)]">اطلب عرض رحلتك <PlaneTakeoff className="size-5" /></Button>
                <Button onClick={() => openWhatsApp("السلام عليكم، أريد الاستفسار عن خدمات ريحانة للسفر والسياحة.")} variant="outline" className="h-13 rounded-full border-white/25 bg-white/5 px-7 text-base font-bold text-white backdrop-blur hover:bg-white/15 hover:text-white">تحدث معنا <MessageCircle className="size-5" /></Button>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6 text-sm text-white/75">
                <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#e2bd69]" /> خيارات مدروسة</span>
                <span className="flex items-center gap-2"><MessageCircle className="size-4 text-[#e2bd69]" /> متابعة عبر واتساب</span>
                <span className="flex items-center gap-2"><Route className="size-4 text-[#e2bd69]" /> برامج مرنة</span>
              </div>
            </div>
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </section>

        <section className="relative z-10 -mt-10 px-5 lg:-mt-14 lg:px-8">
          <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-[#e6d5a5] bg-[#fffdf8] shadow-[0_25px_70px_rgba(6,62,55,.16)] md:grid-cols-3">
            {[{ icon: Ticket, title: "شاركنا وجهتك", text: "أخبرنا بالمدينة والموعد." }, { icon: Route, title: "نقترح لك المسار", text: "خيارات مرنة ومفهومة." }, { icon: MessageCircle, title: "نؤكد على واتساب", text: "متابعة شخصية خطوة بخطوة." }].map((item, index) => {
              const Icon = item.icon;
              return <div key={item.title} className={`flex gap-4 p-6 ${index !== 2 ? "border-b border-[#e9e2cf] md:border-b-0 md:border-l" : ""}`}>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#075B50]/8 text-[#075B50]"><Icon className="size-5" /></div>
                <div><span className="text-xs font-bold text-[#b4862d]">0{index + 1}</span><h2 className="mt-1 font-display text-lg font-extrabold text-[#173b33]">{item.title}</h2><p className="mt-1 text-sm text-[#66736f]">{item.text}</p></div>
              </div>;
            })}
          </div>
        </section>

        <RouteRibbon index="01" from="الخرطوم" to="ابدأ الخطة" />

        <section id="services" className="relative mx-auto max-w-7xl px-5 py-28 lg:px-8">
          <div className="paper-grid absolute inset-x-5 top-10 bottom-10 rounded-[38px] lg:inset-x-8" aria-hidden="true" />
          <div className="relative grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <SectionHeading eyebrow="خدمات ريحانة" title="كل تفاصيل السفر، في مسار واحد." description="خدماتنا مصممة لتقليل الحيرة، وإعطائك خيارات عملية قبل أن تأخذ قرار الحجز." />
            <div className="grid gap-4 sm:auto-rows-[170px] sm:grid-cols-2">
              {SERVICES.map((service, index) => {
                const Icon = service.icon;
                return <button key={service.title} onClick={() => scrollToBooking(index === 0 ? "flight" : index === 1 ? "hotel" : index === 3 ? "package" : "flight")} className={`group border-t border-[#075B50]/18 bg-[#fffdf8]/85 p-5 text-right transition hover:-translate-y-1 hover:border-[#d3a642] hover:bg-white hover:shadow-xl ${index === 0 ? "sm:row-span-2 sm:pt-8" : index === 2 ? "sm:-translate-y-5" : ""}`}>
                  <div className="flex items-start justify-between"><span className="text-xs font-bold tracking-wide text-[#b4862d]">{service.label}</span><Icon className="size-5 text-[#075B50] transition-transform group-hover:-translate-x-1" /></div>
                  <h3 className="mt-9 font-display text-xl font-extrabold text-[#173b33]">{service.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#5e6c68]">{service.text}</p>
                </button>;
              })}
            </div>
          </div>
        </section>

        <RouteRibbon index="02" from="خدمات ريحانة" to="تفاصيل الرحلة" />

        <section id="booking" className="relative overflow-hidden bg-[#073f36] py-28 text-white">
          <div className="absolute -left-24 top-20 size-72 rounded-full bg-[#e2bd69]/10 blur-3xl" />
          <div className="absolute -right-20 bottom-4 size-64 rounded-full border border-[#e2bd69]/20" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
              <div>
                <SectionHeading light eyebrow="طلب سريع" title="دع تفاصيل السفر علينا." description="اختر نوع الطلب، أضف المعلومات الأساسية، ثم نجهز رسالة واتساب واضحة ليبدأ الفريق معك." />
                <div className="mt-10 space-y-5 text-sm text-white/70">
                  <div className="flex items-center gap-3"><span className="flex size-7 items-center justify-center rounded-full border border-[#d9ae50]/40 text-xs text-[#e2bd69]">1</span> نختصر البيانات الضرورية فقط.</div>
                  <div className="flex items-center gap-3"><span className="flex size-7 items-center justify-center rounded-full border border-[#d9ae50]/40 text-xs text-[#e2bd69]">2</span> تفتح الرسالة مباشرة في واتساب.</div>
                  <div className="flex items-center gap-3"><span className="flex size-7 items-center justify-center rounded-full border border-[#d9ae50]/40 text-xs text-[#e2bd69]">3</span> نتابع معك الاختيار والتأكيد.</div>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/15 bg-[#fffdf8] p-5 text-[#173b33] shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-8">
                <div className="flex flex-wrap gap-2 border-b border-[#e9e1ce] pb-5">
                  {BOOKING_TABS.map((tab) => { const Icon = tab.icon; const active = bookingType === tab.id; return <button type="button" onClick={() => setBookingType(tab.id)} key={tab.id} className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${active ? "bg-[#075B50] text-white shadow-lg" : "bg-[#f6f0e1] text-[#46635b] hover:bg-[#ebdfbd]"}`}><Icon className="size-4" />{tab.label}</button>; })}
                </div>
                <form onSubmit={submitBooking} className="mt-7">
                  {bookingType === "flight" ? <div className="grid gap-4 sm:grid-cols-2"><Field label="من" name="from" placeholder="الخرطوم" required /><Field label="إلى" name="to" placeholder="جدة أو القاهرة" required /><Field label="تاريخ المغادرة" name="depart" type="date" required /><Field label="تاريخ العودة" name="return" type="date" /><SelectField label="عدد البالغين" name="adults" options={["1", "2", "3", "4", "5+"]} /><SelectField label="عدد الأطفال" name="children" options={["0", "1", "2", "3+"]} /></div> : null}
                  {bookingType === "hotel" ? <div className="grid gap-4 sm:grid-cols-2"><Field label="المدينة أو الفندق" name="destination" placeholder="مثال: دبي أو فندق محدد" required /><SelectField label="عدد الضيوف" name="guests" options={["1", "2", "3", "4+"]} /><Field label="تاريخ الوصول" name="checkin" type="date" required /><Field label="تاريخ المغادرة" name="checkout" type="date" required /><SelectField label="عدد الغرف" name="rooms" options={["1", "2", "3", "4+"]} /></div> : null}
                  {bookingType === "package" ? <div className="grid gap-4 sm:grid-cols-2"><SelectField label="الوجهة" name="packageDestination" options={["مصر", "السعودية", "تركيا", "الإمارات", "ماليزيا", "وجهة أخرى"]} /><SelectField label="مدة الرحلة" name="duration" options={["3 أيام", "5 أيام", "7 أيام", "10 أيام", "14 يوماً"]} /><Field label="تاريخ السفر" name="packageDate" type="date" required /><SelectField label="عدد المسافرين" name="travelers" options={["1", "2", "3", "4", "5+"]} /></div> : null}
                  {bookingType === "umrah" ? <div className="grid gap-4 sm:grid-cols-2"><SelectField label="مدة العمرة" name="umrahDuration" options={["5 أيام", "7 أيام", "10 أيام", "15 يوماً"]} /><SelectField label="نوع الغرفة" name="roomType" options={["مزدوجة", "ثلاثية", "رباعية"]} /><Field label="تاريخ السفر" name="umrahDate" type="date" required /><SelectField label="عدد المسافرين" name="umrahTravelers" options={["1", "2", "3", "4+"]} /></div> : null}
                  <Button type="submit" className="action-gold mt-7 h-13 w-full rounded-xl font-extrabold text-[#17372f]">أرسل الطلب عبر واتساب <Send className="size-4" /></Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <RouteRibbon index="03" from="تم استلام طلبك" to="اختر وجهتك" />

        <section id="destinations" className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><SectionHeading eyebrow="وجهات مختارة" title="أماكن تترك أثرها في الرحلة." description="هذه بداية فقط. أخبرنا بالوجهة التي في بالك ونرتب لك خياراتها." /><Button onClick={() => openWhatsApp("السلام عليكم، أريد الاستفسار عن وجهة سفر غير موجودة في الموقع.")} variant="outline" className="h-11 rounded-full border-[#075B50]/25 px-5 font-bold text-[#075B50] hover:bg-[#075B50] hover:text-white">اطلب وجهة أخرى <ArrowUpLeft className="size-4" /></Button></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            {DESTINATIONS.map((destination, index) => <button key={destination.city} onClick={() => setSelectedDestination(destination)} className={`destination-card group relative overflow-hidden text-right ${index === 0 ? "min-h-[390px] lg:col-span-5" : index === 1 ? "min-h-[390px] lg:col-span-4 lg:translate-y-10" : index === 2 ? "min-h-[390px] lg:col-span-3 lg:-translate-y-8" : index === 3 ? "min-h-[280px] lg:col-span-6 lg:translate-y-6" : "min-h-[280px] lg:col-span-6 lg:-translate-y-4"}`}>
              <img src={destination.image} alt={destination.city} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#042f2b]/95 via-[#042f2b]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white"><span className="inline-flex rounded-full border border-[#e2bd69]/40 bg-[#073f36]/70 px-3 py-1 text-xs font-bold text-[#efd588] backdrop-blur">{destination.tag}</span><h3 className="mt-4 font-display text-2xl font-extrabold">{destination.city}</h3><p className="mt-1 text-sm text-white/68">{destination.country}</p><div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#efd588]">اكتشفها مع ريحانة <ChevronLeft className="size-4" /></div></div>
            </button>)}
          </div>
        </section>

        <RouteRibbon index="04" from="ختم وجهة" to="ترتيب التجربة" />

        <section id="about" className="bg-[#f3eddd] py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8">
            <div className="relative min-h-[500px]">
              <img src="/manus-storage/rehana-world-journey_db25ed72.jpg" alt="رحلة طيران عالمية" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063e37]/75 via-transparent to-transparent" />
              <div className="absolute bottom-7 right-7 max-w-xs border-r-2 border-[#d7ae52] pr-4 text-white"><p className="text-xs font-bold tracking-[.15em] text-[#e2bd69]">خريطة ريحانة الذهبية</p><p className="mt-2 font-display text-2xl font-extrabold leading-tight">نحوّل تفاصيل السفر إلى مسار واضح.</p></div>
            </div>
            <div className="lg:pr-8"><SectionHeading eyebrow="عن ريحانة" title="لأن الرحلة الجيدة تبدأ قبل الطائرة." description="نحن وكالة سفر وسياحة نعمل على ترتيب تجربة سفر متماسكة: خيارات الطيران، الإقامة، البرامج، والتواصل المستمر في مكان واحد." /><div className="mt-9 grid gap-6 sm:grid-cols-2"><div className="border-t-2 border-[#d4a843] pt-4"><p className="font-display text-xl font-extrabold text-[#075B50]">وضوح في الخيارات</p><p className="mt-2 text-sm leading-7 text-[#61706b]">نشرح لك الخيارات بدلاً من إغراقك بالتفاصيل.</p></div><div className="border-t-2 border-[#d4a843] pt-4"><p className="font-display text-xl font-extrabold text-[#075B50]">قرب في التواصل</p><p className="mt-2 text-sm leading-7 text-[#61706b]">واتساب مباشر لمتابعة السؤال من بدايته للنهاية.</p></div></div><Button onClick={() => openWhatsApp("السلام عليكم، أريد معرفة المزيد عن وكالة ريحانة للسفر والسياحة.")} variant="outline" className="mt-10 h-12 rounded-full border-[#075B50] px-6 font-bold text-[#075B50] hover:bg-[#075B50] hover:text-white">تعرف على خدماتنا <ArrowUpLeft className="size-4" /></Button></div>
          </div>
        </section>

        <RouteRibbon index="05" from="دليل ريحانة" to="تواصل معنا" />

        <section className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.76fr_1.24fr]">
            <SectionHeading eyebrow="أسئلة شائعة" title="إجابات قبل أن تبدأ." description="إن بقي لديك أي سؤال، تواصل معنا وسنساعدك على واتساب." />
            <div className="divide-y divide-[#075B50]/12 border-y border-[#075B50]/12">
              {[['كيف أطلب عرض سعر؟', 'اختر نوع الطلب من نموذج الحجز، وأدخل التفاصيل الأساسية، ثم أرسل الرسالة مباشرة إلى واتساب ريحانة.'], ['هل يمكن طلب وجهة غير معروضة؟', 'نعم. أرسل المدينة أو الدولة وتاريخ السفر التقريبي، وسنرتب لك الخيارات المتاحة.'], ['هل الأسعار المعروضة نهائية؟', 'يتم تأكيد السعر النهائي بعد مراجعة التوفر الفعلي للطيران والفندق وتفاصيل السفر.']].map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-extrabold text-[#173b33]">{question}<ChevronDown className="size-5 text-[#b4862d] transition group-open:rotate-180" /></summary><p className="max-w-2xl pt-3 text-sm leading-7 text-[#60706b]">{answer}</p></details>)}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#073f36] py-24 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.82fr_1.18fr] lg:px-8">
            <div><SectionHeading light eyebrow="تواصل معنا" title="هل أصبحت وجهتك في بالك؟" description="أرسل تفاصيل أولية، أو ابدأ محادثة مباشرة. نرتب الخطوة التالية معك." /><div className="mt-10 space-y-5 text-sm text-white/70"><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-white"><Phone className="size-5 text-[#e2bd69]" />{CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:text-white"><MessageCircle className="size-5 text-[#e2bd69]" />{CONTACT.email}</a><p className="flex items-center gap-3"><MapPin className="size-5 text-[#e2bd69]" />{CONTACT.city}</p></div><Button onClick={() => openWhatsApp("السلام عليكم، أريد الاستفسار عن خدمات ريحانة للسفر والسياحة.")} className="mt-9 h-12 rounded-full bg-[#25D366] px-6 font-bold text-white hover:bg-[#21bd5b]">تواصل عبر واتساب <MessageCircle className="size-5" /></Button></div>
            <form onSubmit={submitContact} className="bg-white p-6 text-[#173b33] shadow-[0_24px_65px_rgba(0,0,0,.2)] sm:p-8"><h3 className="font-display text-2xl font-extrabold text-[#075B50]">أرسل استفسارك</h3><p className="mt-2 text-sm text-[#63716d]">نحوّل رسالتك إلى واتساب لتتابعها مع الفريق.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><Field label="الاسم" name="name" placeholder="اسمك الكامل" required /><Field label="رقم الهاتف" name="phone" placeholder="09xxxxxxxx" required /></div><div className="mt-4"><SelectField label="الخدمة" name="service" options={["تذاكر طيران", "فنادق", "باقة سياحية", "عمرة", "تأشيرة", "استفسار عام"]} /></div><label className="mt-4 block text-sm font-bold text-[#3c514b]">رسالتك<textarea name="message" required placeholder="اكتب وجهتك أو تفاصيل طلبك..." className="input-field mt-2 min-h-32 resize-none" /></label><Button type="submit" className="action-gold mt-6 h-13 w-full rounded-xl font-extrabold text-[#17372f]">إرسال الرسالة عبر واتساب <Send className="size-4" /></Button></form>
          </div>
        </section>
      </main>

      <footer className="bg-[#042f2b] pb-7 pt-12 text-white/65">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.2fr_.7fr_.7fr] lg:px-8"><div><a href="#home" className="inline-flex items-center gap-3"><img src="/manus-storage/rehana-official-logo_ccf119aa.png" alt="شعار ريحانة للسفر والسياحة" className="h-16 w-16 rounded-xl bg-white p-1.5 object-contain" /><span className="font-display text-lg font-extrabold text-white">رحلتك تبدأ من هنا.</span></a><p className="mt-5 max-w-sm text-sm leading-7">تخطيط سفر واضح، بلمسة سودانية قريبة وتجربة عالمية مرتبة.</p></div><div><h4 className="font-display text-lg font-extrabold text-white">روابط سريعة</h4><div className="mt-4 space-y-2 text-sm"><a href="#booking" className="block hover:text-[#e2bd69]">ابدأ الحجز</a><a href="#destinations" className="block hover:text-[#e2bd69]">الوجهات</a><a href="#services" className="block hover:text-[#e2bd69]">الخدمات</a></div></div><div><h4 className="font-display text-lg font-extrabold text-white">ابقَ قريباً</h4><div className="mt-4 flex gap-3"><a href="#contact" className="footer-icon" aria-label="واتساب"><MessageCircle className="size-4" /></a><a href="#contact" className="footer-icon" aria-label="إنستغرام"><Instagram className="size-4" /></a><a href={`mailto:${CONTACT.email}`} className="footer-icon" aria-label="بريد إلكتروني"><Send className="size-4" /></a></div></div></div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© {new Date().getFullYear()} ريحانة للسفر والسياحة. جميع الحقوق محفوظة.</span><span>رحلتك تبدأ من هنا.</span></div>
      </footer>

      <Button onClick={() => openWhatsApp("السلام عليكم، أريد الاستفسار عن خدمات ريحانة للسفر والسياحة.")} className="fixed bottom-5 left-5 z-40 size-14 rounded-full bg-[#25D366] p-0 text-white shadow-[0_12px_28px_rgba(37,211,102,.35)] hover:bg-[#21bd5b]" aria-label="التواصل عبر واتساب"><MessageCircle className="size-6" /></Button>
      {notification ? <aside role="status" aria-live="polite" className="notification-card fixed bottom-5 right-5 z-[70] w-[min(92vw,370px)] overflow-hidden border border-[#d5b260]/45 bg-[#fffdf8] shadow-[0_22px_55px_rgba(4,47,43,.22)]"><div className="flex items-start gap-3 p-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#075B50] text-[#ecd181]"><BadgeCheck className="size-5" /></span><div className="min-w-0 flex-1"><p className="font-display text-sm font-extrabold text-[#075B50]">{notification.title}</p><p className="mt-1 text-xs leading-6 text-[#62716c]">{notification.body}</p></div><button onClick={() => setNotification(null)} className="rounded-full p-1 text-[#6b7773] transition hover:bg-[#075B50]/8 hover:text-[#075B50]" aria-label="إغلاق الإشعار"><X className="size-4" /></button></div><span className="notification-progress block h-1 bg-[#d4a843]" /></aside> : null}

      <Dialog open={Boolean(selectedDestination)} onOpenChange={(open) => !open && setSelectedDestination(null)}>
        <DialogContent dir="rtl" className="max-w-xl overflow-hidden border-0 bg-[#fffdf8] p-0 text-right">
          {selectedDestination ? <><img src={selectedDestination.image} alt={selectedDestination.city} className="h-56 w-full object-cover" /><DialogHeader className="p-7 pb-0 text-right"><span className="text-xs font-bold text-[#b4862d]">{selectedDestination.country}</span><DialogTitle className="font-display text-3xl font-extrabold text-[#075B50]">{selectedDestination.city}</DialogTitle><DialogDescription className="pt-2 text-sm leading-7 text-[#5e6d68]">{selectedDestination.note} تواصل معنا لنرتّب تفاصيل الطيران والإقامة والبرنامج المناسب.</DialogDescription></DialogHeader><DialogFooter className="p-7"><Button onClick={() => openWhatsApp(`السلام عليكم، أريد طلب برنامج سفر إلى ${selectedDestination.city} في ${selectedDestination.country}.`)} className="w-full rounded-xl bg-[#25D366] font-bold text-white hover:bg-[#21bd5b]">اطلب هذه الوجهة عبر واتساب <MessageCircle className="size-4" /></Button></DialogFooter></> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, name, placeholder, type = "text", required = false }: { label: string; name: string; placeholder?: string; type?: string; required?: boolean }) {
  return <label className="block text-sm font-bold text-[#3c514b]">{label}<input name={name} type={type} placeholder={placeholder} required={required} className="input-field mt-2" /></label>;
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <label className="block text-sm font-bold text-[#3c514b]">{label}<select name={name} className="input-field mt-2">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
