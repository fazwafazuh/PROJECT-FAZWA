import { useEffect, useRef, useState } from "react";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";
const SENSITIVITY = 0.8;
const NAV_LINKS = ["Labs", "Studio", "Openings", "Shop"];

/* ---------------------------------------------------------
   A.R.I.A. — small round robot avatar whose eyes follow the
   mouse cursor (left/right/up/down), pinned top-right.
--------------------------------------------------------- */
function AriaBot() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const MAX_OFFSET = 5; // px the pupils are allowed to drift

    function handleMove(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const dist = Math.min(
        Math.hypot(e.clientX - cx, e.clientY - cy) / 260,
        1
      );

      const ox = Math.cos(angle) * MAX_OFFSET * dist;
      const oy = Math.sin(angle) * MAX_OFFSET * dist;
      const transform = `translate(${ox}px, ${oy}px)`;

      if (leftPupilRef.current) leftPupilRef.current.style.transform = transform;
      if (rightPupilRef.current) rightPupilRef.current.style.transform = transform;
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="aria-bot" ref={wrapRef} aria-hidden="true">
      <img src="/robo.jpg" alt="" />
      <div className="pupil left" ref={leftPupilRef} />
      <div className="pupil right" ref={rightPupilRef} />
    </div>
  );
}

/* ---------------------------------------------------------
   Typewriter hook
--------------------------------------------------------- */
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval>;

    const delayTimer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/* ---------------------------------------------------------
   Background video, scrubbed by horizontal mouse movement
--------------------------------------------------------- */
function ScrubVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevX = useRef<number | null>(null);
  const targetTime = useRef(0);
  const seeking = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function requestSeek() {
      if (!video || seeking.current) return;
      if (Math.abs(video.currentTime - targetTime.current) < 0.01) return;
      seeking.current = true;
      video.currentTime = targetTime.current;
    }

    function onSeeked() {
      seeking.current = false;
      if (video && Math.abs(video.currentTime - targetTime.current) > 0.01) {
        requestSeek();
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!video || !video.duration || Number.isNaN(video.duration)) return;
      if (prevX.current === null) {
        prevX.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      let next = targetTime.current + offset;
      next = Math.max(0, Math.min(video.duration, next));
      targetTime.current = next;
      requestSeek();
    }

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 z-0 h-full w-full object-cover"
      style={{ objectPosition: "70% center" }}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
    />
  );
}

/* ---------------------------------------------------------
   Navbar
--------------------------------------------------------- */
function Navbar({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  return (
    <nav className="fixed top-0 z-10 flex w-full items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
      {/* Logo */}
      <div className="flex flex-row items-center gap-3">
        <span
          className="text-[21px] tracking-tight text-black sm:text-[26px]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Mainframe&reg;
        </span>
        <span
          className="select-none text-[25px] text-black sm:text-[30px]"
          style={{ letterSpacing: "-0.02em" }}
        >
          &#10035;&#65038;
        </span>
      </div>

      {/* Desktop nav links */}
      <div className="hidden flex-row text-[23px] text-black md:flex">
        {NAV_LINKS.map((link, i) => (
          <span key={link}>
            <a href="#" className="transition-opacity hover:opacity-60">
              {link}
            </a>
            {i < NAV_LINKS.length - 1 && <span>,&nbsp;</span>}
          </span>
        ))}
      </div>

      {/* Desktop CTA */}
      <a
        href="#contact"
        className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
      >
        Get in touch
      </a>

      {/* Mobile hamburger */}
      <button
        className="flex flex-col gap-[5px] md:hidden"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className="h-[2px] w-6 bg-black transition-all duration-300"
          style={
            menuOpen
              ? { transform: "rotate(45deg) translateY(7px)" }
              : undefined
          }
        />
        <span
          className="h-[2px] w-6 bg-black transition-all duration-300"
          style={menuOpen ? { opacity: 0 } : undefined}
        />
        <span
          className="h-[2px] w-6 bg-black transition-all duration-300"
          style={
            menuOpen
              ? { transform: "rotate(-45deg) translateY(-7px)" }
              : undefined
          }
        />
      </button>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[32px] font-medium text-black"
            onClick={() => setMenuOpen(false)}
          >
            {link}
          </a>
        ))}
        <a
          href="#contact"
          className="text-[32px] font-medium text-black underline underline-offset-2"
          onClick={() => setMenuOpen(false)}
        >
          Get in touch
        </a>
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------
   Pill buttons
--------------------------------------------------------- */
function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const PILL_LABELS = [
  "Pitch us an idea",
  "Come work here",
  "Send a brief hello",
  "See how we operate",
];

function ActionPills({ visible }: { visible: boolean }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText("hello@mainframe.co");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available — silently ignore
    }
  }

  return (
    <div
      className="flex flex-wrap gap-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {PILL_LABELS.map((label) => (
        <button
          key={label}
          className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
        >
          {label}
        </button>
      ))}
      <button
        onClick={handleCopy}
        className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
      >
        <span>
          Reach us:{" "}
          <span className="underline underline-offset-1">hello@mainframe.co</span>
        </span>
        <CopyIcon />
      </button>
      {copied && (
        <span className="mb-[0.4em] ml-2 self-center text-[12px] text-white/80">
          Copied
        </span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   App
--------------------------------------------------------- */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);

  const { displayed, done } = useTypewriter(
    "Glad you stopped in. Good taste tends to find us. Now, what are we building?"
  );

  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <ScrubVideo />
      <AriaBot />
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          <div
            className="pointer-events-none mb-5 select-none sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "#000",
              filter: "blur(4px)",
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe&rsquo;s Adaptive Response Interface Agent
          </div>

          <p
            className="mb-5 text-black sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: "54px",
            }}
          >
            {displayed}
            {!done && (
              <span className="animate-blink ml-[2px] inline-block h-[1.1em] w-[2px] align-middle bg-black" />
            )}
          </p>

          <ActionPills visible={pillsVisible} />
        </div>
      </section>
    </div>
  );
}
