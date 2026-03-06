import { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════ TYPES ═══════════════════════════ */
interface EventItem {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    status: 'ongoing' | 'upcoming' | 'completed';
    imgUrl: string;
    tags: string[];
    speaker?: string;
    attendees?: number;
}

/* ═══════════════════════════ DATA ═══════════════════════════ */
const mockEvents: EventItem[] = [
    {
        id: 1,
        title: 'IEEE Tech Symposium 2026',
        date: 'March 15 – 18, 2026',
        time: '10:00 AM – 5:00 PM',
        location: 'Main Auditorium',
        description:
            'A 3-day deep dive into AI, Robotics, and Quantum Computing with industry leaders from Google, Microsoft, and MIT. Featuring hands-on workshops, keynote sessions, and networking lounges.',
        status: 'upcoming',
        imgUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=90',
        tags: ['AI', 'Robotics', 'Quantum Computing'],
        speaker: 'Dr. Sarah Chen',
        attendees: 350,
    },
    {
        id: 2,
        title: 'Web Development Bootcamp',
        date: 'March 1 – 10, 2026',
        time: '9:00 AM – 4:00 PM',
        location: 'Virtual Event',
        description:
            'Intensive hands-on workshop covering full-stack applications with React, Node.js, and cloud deployment strategies for modern web development.',
        status: 'ongoing',
        imgUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=90',
        tags: ['React', 'Node.js', 'Cloud'],
        speaker: 'Prof. James Walker',
        attendees: 200,
    },
    {
        id: 3,
        title: 'Annual IEEE Day Celebration',
        date: 'February 15, 2026',
        time: '11:00 AM – 8:00 PM',
        location: 'Campus Ground',
        description:
            'Celebrating the legacy and future of engineering with keynote speeches, networking sessions, cultural events, and innovation showcases.',
        status: 'completed',
        imgUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=90',
        tags: ['Celebration', 'Networking'],
        attendees: 500,
    },
    {
        id: 4,
        title: 'Hardware Hackathon 24H',
        date: 'April 5 – 6, 2026',
        time: '9:00 AM (24 hours)',
        location: 'Innovation Lab',
        description:
            'Build innovative hardware solutions addressing real-world problems. Mentorship from industry experts and all hardware components provided.',
        status: 'upcoming',
        imgUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1400&q=90',
        tags: ['Hardware', 'IoT', 'Innovation'],
        speaker: 'Eng. Priya Patel',
        attendees: 120,
    },
    {
        id: 5,
        title: 'Advanced Cybersecurity Talk',
        date: 'March 5, 2026',
        time: '2:00 PM – 5:00 PM',
        location: 'Seminar Hall B',
        description:
            'Expert panel discussing network security, ethical hacking, and blockchain security with live penetration testing demonstrations.',
        status: 'ongoing',
        imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=90',
        tags: ['Security', 'Blockchain', 'Ethical Hacking'],
        speaker: 'Mr. Alex Romero',
        attendees: 180,
    },
    {
        id: 6,
        title: 'Machine Learning Study Jam',
        date: 'January 20, 2026',
        time: '10:00 AM – 3:00 PM',
        location: 'Virtual Event',
        description:
            'A beginner-friendly session breaking down complex ML concepts with Python, TensorFlow, and real-world datasets for practical learning.',
        status: 'completed',
        imgUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=90',
        tags: ['ML', 'Python', 'TensorFlow'],
        speaker: 'Dr. Anita Verma',
        attendees: 275,
    },
    {
        id: 7,
        title: 'Cloud Computing Workshop',
        date: 'April 20, 2026',
        time: '10:00 AM – 4:00 PM',
        location: 'Computer Lab 3',
        description:
            'Hands-on workshop on AWS, Azure, and GCP. Learn to deploy, scale, and manage cloud infrastructure from scratch with real projects.',
        status: 'upcoming',
        imgUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=90',
        tags: ['AWS', 'Azure', 'DevOps'],
        speaker: 'Mr. David Kim',
        attendees: 150,
    },
    {
        id: 8,
        title: 'Women in Tech Summit',
        date: 'February 28, 2026',
        time: '9:00 AM – 6:00 PM',
        location: 'Convention Center',
        description:
            'Empowering the next generation of women in STEM with panel discussions, workshops, mentorship opportunities, and career guidance.',
        status: 'completed',
        imgUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1400&q=90',
        tags: ['Women in Tech', 'Leadership'],
        speaker: 'Ms. Rachel Torres',
        attendees: 400,
    },
    {
        id: 9,
        title: 'Open Source Contribution Day',
        date: 'March 22, 2026',
        time: '10:00 AM – 6:00 PM',
        location: 'Maker Space',
        description:
            'Learn how to contribute to open-source projects. Start your journey into collaborative coding with experienced mentors guiding you.',
        status: 'upcoming',
        imgUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=90',
        tags: ['Open Source', 'Git', 'Collaboration'],
        speaker: 'Mr. Liam Zhang',
        attendees: 90,
    },
];

/* ═══════════════════════════ ICONS ═══════════════════════════ */
const CalendarIcon = ({ size = 15 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm-1 3v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5H1z" />
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 3.5a.5.5 0 0 0-1 0V8a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 7.71V3.5z" />
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
    </svg>
);

const LocationIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
);

const UsersIcon = () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
        <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const SparkleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
);

const MicIcon = () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const ShareIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
    </svg>
);

const TagIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
    </svg>
);

/* ═══════════════════════════ UTILITY HOOKS ═══════════════════════════ */

/** Intersection observer hook for scroll-reveal */
function useReveal() {
    const [visible, setVisible] = useState<Set<number>>(new Set());
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        const id = Number(e.target.getAttribute('data-id'));
                        if (!isNaN(id)) setVisible((prev) => new Set(prev).add(id));
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
        );
        refs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [refs.current.length]);

    return { visible, refs };
}

/* ═══════════════════════════ SUB-COMPONENTS ═══════════════════════════ */

/** Status badge */
function StatusBadge({ status }: { status: EventItem['status'] }) {
    const styles = {
        ongoing: 'bg-emerald-500 text-white shadow-[0_0_14px_rgba(34,197,94,0.45)]',
        upcoming: 'bg-[#00629B] text-white shadow-[0_0_14px_rgba(0,98,155,0.3)]',
        completed: 'bg-[#0A2A4A]/75 text-white/80',
    };
    const labels = {
        ongoing: '● Live Now',
        upcoming: '◎ Coming Soon',
        completed: '✓ Completed',
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider backdrop-blur-md ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

/** Speaker chip */
function SpeakerChip({ name }: { name: string }) {
    const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2);
    return (
        <div className="flex items-center gap-2 py-1.5 px-2.5 bg-[#F5F7FA] rounded-lg border border-[#E1E5EA]/50">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0A2A4A] to-[#00629B] flex items-center justify-center text-[10px] font-bold text-[#FFC72C] shrink-0">
                {initials}
            </div>
            <div className="min-w-0">
                <div className="text-[11.5px] font-semibold text-[#0A2A4A] truncate">{name}</div>
                <div className="text-[9.5px] text-[#888] flex items-center gap-1"><MicIcon /> Speaker</div>
            </div>
        </div>
    );
}

/** Meta row (date / time / location) */
function MetaRow({ icon, text, bold }: { icon: React.ReactNode; text: string; bold?: boolean }) {
    return (
        <div className="flex items-center gap-2 text-[12px] text-[#666]">
            <span className="text-[#00629B]/50 shrink-0">{icon}</span>
            <span className={bold ? 'font-semibold text-[#444]' : ''}>{text}</span>
        </div>
    );
}

/* ═══════════════════════════ EVENT DETAIL MODAL ═══════════════════════════ */

const eventHighlights: Record<number, string[]> = {
    1: ['Keynote sessions by industry leaders from Google & MIT', 'Hands-on workshops on AI, Robotics, and Quantum Computing', 'Networking lounge with recruiters from top tech companies', 'Certificate of participation for all attendees'],
    2: ['Build & deploy a full-stack app by end of bootcamp', 'Daily code reviews by senior engineers', 'Access to exclusive course materials & resources', 'Community Slack channel for peer collaboration'],
    3: ['Cultural performances and tech showcases', 'Panel discussions with IEEE global leaders', 'Awards ceremony for outstanding contributors', 'Photography & videography coverage'],
    4: ['24-hour non-stop innovation challenge', 'All hardware components & tools provided', 'Expert mentors available throughout the event', 'Cash prizes & internship opportunities for winners'],
    5: ['Live penetration testing demonstrations', 'Blockchain security deep-dive session', 'Interactive Q&A with cybersecurity experts', 'Free cybersecurity toolkit for participants'],
    6: ['Beginner-to-intermediate ML pipeline walkthrough', 'Hands-on with TensorFlow and real datasets', 'Take-home projects with mentor feedback', 'Certificate of completion from IEEE'],
    7: ['Multi-cloud architecture design patterns', 'Deploying containerized apps on Kubernetes', 'Infrastructure-as-code with Terraform', 'Free cloud credits for all workshop attendees'],
    8: ['Inspiring talks from women leaders in tech', 'Mentorship matchmaking sessions', 'Resume review and career coaching booths', 'Scholarship announcements for women in STEM'],
    9: ['Guided contribution to real open-source projects', 'Git, GitHub, and PR workflow workshops', 'Swag and recognition for top contributors', 'Join a global open-source community'],
};

function EventDetailModal({
    event,
    onClose,
}: {
    event: EventItem;
    onClose: () => void;
}) {
    const [closing, setClosing] = useState(false);
    const highlights = eventHighlights[event.id] || [
        'Expert-led sessions with industry professionals',
        'Hands-on learning with real-world tools',
        'Networking opportunities with peers and mentors',
        'Certificate of participation provided',
    ];

    const handleClose = () => {
        setClosing(true);
        document.body.classList.remove('modal-open');
        setTimeout(onClose, 300);
    };

    useEffect(() => {
        document.body.classList.add('modal-open');
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.classList.remove('modal-open');
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const statusColors = {
        ongoing: { bg: 'bg-emerald-500', text: 'text-white', label: '● Live Now' },
        upcoming: { bg: 'bg-[#00629B]', text: 'text-white', label: '◎ Coming Soon' },
        completed: { bg: 'bg-[#0A2A4A]/70', text: 'text-white/80', label: '✓ Completed' },
    };
    const sc = statusColors[event.status];

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-start justify-center modal-backdrop ${closing ? 'closing' : ''}`}
            onClick={handleClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#0A2A4A]/60 backdrop-blur-sm" />

            {/* Modal Panel */}
            <div
                className={`relative z-10 w-full max-w-3xl mx-4 my-6 md:my-10 bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto modal-panel ${closing ? 'closing' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Hero Image Section ── */}
                <div className="relative h-56 md:h-72 overflow-hidden modal-hero">
                    <img
                        src={event.imgUrl}
                        alt={event.title}
                        className="w-full h-full object-cover modal-hero-img"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A4A] via-[#0A2A4A]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A4A]/50 to-transparent" />

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="close-btn absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/30 z-20"
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>

                    {/* Title overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                        <div className="modal-item flex flex-wrap items-center gap-2 mb-3" style={{ animationDelay: '0.1s' }}>
                            <span className={`px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${sc.bg} ${sc.text}`}>
                                {sc.label}
                            </span>
                            {event.tags.map((tag) => (
                                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-[10.5px] font-medium border border-white/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h2 className="modal-item text-2xl md:text-3xl lg:text-4xl font-extrabold font-display text-white leading-tight tracking-tight" style={{ animationDelay: '0.18s' }}>
                            {event.title}
                        </h2>
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFC72C]/15 to-transparent pointer-events-none" />
                </div>

                {/* ── Content Body ── */}
                <div className="p-6 md:p-8">

                    {/* Info Grid */}
                    <div className="modal-item grid grid-cols-2 md:grid-cols-4 gap-3 mb-8" style={{ animationDelay: '0.25s' }}>
                        {[
                            { icon: <CalendarIcon size={16} />, label: 'Date', value: event.date },
                            { icon: <ClockIcon />, label: 'Time', value: event.time },
                            { icon: <LocationIcon />, label: 'Venue', value: event.location },
                            { icon: <UsersIcon />, label: 'Attendees', value: event.attendees ? `${event.attendees}+` : 'Open' },
                        ].map((item, i) => (
                            <div key={i} className="info-card flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-[#F5F7FA] border border-[#E1E5EA]/50">
                                <span className="text-[#00629B] mb-1.5">{item.icon}</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#999] font-semibold mb-0.5">{item.label}</span>
                                <span className="text-[13px] font-bold text-[#0A2A4A] leading-snug">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* About Section */}
                    <div className="modal-item mb-8" style={{ animationDelay: '0.32s' }}>
                        <h3 className="text-lg font-bold text-[#0A2A4A] font-display mb-3 flex items-center gap-2">
                            <span className="w-1 h-5 bg-gradient-to-b from-[#FFC72C] to-[#FFD95A] rounded-full" />
                            About This Event
                        </h3>
                        <p className="text-[#555] text-[14.5px] leading-[1.75] font-light">
                            {event.description}
                        </p>
                    </div>

                    {/* Highlights */}
                    <div className="modal-item mb-8" style={{ animationDelay: '0.4s' }}>
                        <h3 className="text-lg font-bold text-[#0A2A4A] font-display mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-gradient-to-b from-[#FFC72C] to-[#FFD95A] rounded-full" />
                            Event Highlights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {highlights.map((item, i) => (
                                <div key={i} className="highlight-item text-[13.5px] text-[#555] leading-relaxed py-1">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Speaker Section */}
                    {event.speaker && (
                        <div className="modal-item mb-8" style={{ animationDelay: '0.48s' }}>
                            <h3 className="text-lg font-bold text-[#0A2A4A] font-display mb-3 flex items-center gap-2">
                                <span className="w-1 h-5 bg-gradient-to-b from-[#FFC72C] to-[#FFD95A] rounded-full" />
                                Featured Speaker
                            </h3>
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F5F7FA] to-white rounded-xl border border-[#E1E5EA]/50">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A2A4A] to-[#00629B] flex items-center justify-center text-lg font-bold text-[#FFC72C] shrink-0 shadow-blue">
                                    {event.speaker.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <div className="text-[15px] font-bold text-[#0A2A4A]">{event.speaker}</div>
                                    <div className="text-[12px] text-[#888] flex items-center gap-1.5 mt-0.5">
                                        <MicIcon /> Keynote Speaker
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tags row */}
                    <div className="modal-item flex flex-wrap items-center gap-2 mb-8" style={{ animationDelay: '0.52s' }}>
                        <span className="text-[#999] mr-1"><TagIcon /></span>
                        {event.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-[#00629B]/[0.06] text-[#00629B] text-[12px] font-semibold">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="modal-item flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#E1E5EA]/60" style={{ animationDelay: '0.58s' }}>
                        {event.status !== 'completed' ? (
                            <button className="btn-ripple group/btn flex-1 bg-[#0A2A4A] hover:bg-[#00629B] text-white font-bold py-3.5 px-6 rounded-xl text-[14px] transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-blue">
                                {event.status === 'ongoing' ? 'Join Now' : 'Register Now'}
                                <span className="transition-transform duration-300 group-hover/btn:translate-x-1"><ArrowRightIcon /></span>
                            </button>
                        ) : (
                            <button className="flex-1 bg-[#F5F7FA] text-[#999] font-bold py-3.5 px-6 rounded-xl text-[14px] cursor-not-allowed border border-[#E1E5EA]/50">
                                Event Has Ended
                            </button>
                        )}
                        <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#E1E5EA]/80 text-[#00629B] font-semibold text-[14px] hover:bg-[#00629B]/[0.05] hover:border-[#00629B]/25 transition-all duration-300">
                            <ShareIcon /> Share Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════ FEATURED EVENT HERO ═══════════════════════════ */
function FeaturedEventHero({ event, onDetails }: { event: EventItem; onDetails: (e: EventItem) => void }) {
    return (
        <div
            onClick={() => onDetails(event)}
            className="relative rounded-2xl overflow-hidden mb-14 group featured-glow cursor-pointer"
        >
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src={event.imgUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 img-overlay-pattern" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A4A]/90 via-[#0A2A4A]/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-6 p-8 md:p-12 min-h-[320px] md:min-h-[360px]">
                <div className="flex-1 max-w-2xl">
                    {/* Badge row */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC72C] text-[#0A2A4A] text-[10.5px] font-bold uppercase tracking-wider">
                            <SparkleIcon /> Featured Event
                        </span>
                        <StatusBadge status={event.status} />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white leading-[1.1] mb-4 tracking-tight">
                        {event.title}
                    </h2>

                    {/* Description */}
                    <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-lg mb-6 font-light">
                        {event.description}
                    </p>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                        <div className="flex items-center gap-2 text-white/60 text-[12.5px]">
                            <CalendarIcon size={13} />
                            <span className="font-medium text-white/80">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-[12.5px]">
                            <ClockIcon />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-[12.5px]">
                            <LocationIcon />
                            <span>{event.location}</span>
                        </div>
                        {event.attendees && (
                            <div className="flex items-center gap-2 text-white/60 text-[12.5px]">
                                <UsersIcon />
                                <span>{event.attendees}+ attendees</span>
                            </div>
                        )}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex gap-3">
                        <button className="btn-ripple group/btn px-7 py-3 bg-[#FFC72C] hover:bg-[#FFD95A] text-[#0A2A4A] font-bold rounded-xl text-[13px] transition-all duration-300 hover:shadow-gold flex items-center gap-2">
                            {event.status === 'ongoing' ? 'Join Now' : 'Register Now'}
                            <span className="transition-transform duration-300 group-hover/btn:translate-x-1"><ArrowRightIcon /></span>
                        </button>
                        <button
                            onClick={() => onDetails(event)}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-[13px] border border-white/15 transition-all duration-300 backdrop-blur-md"
                        >
                            View Details
                        </button>
                    </div>
                </div>

                {/* Tags on the right side */}
                <div className="hidden lg:flex flex-col gap-2 items-end">
                    {event.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-[11px] font-medium border border-white/10">
                            {tag}
                        </span>
                    ))}
                    {event.speaker && (
                        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                            <div className="w-7 h-7 rounded-full bg-[#FFC72C] flex items-center justify-center text-[11px] font-bold text-[#0A2A4A]">
                                {event.speaker.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold text-white">{event.speaker}</div>
                                <div className="text-[9px] text-white/50">Keynote Speaker</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#FFC72C]/10 to-transparent pointer-events-none" />
        </div>
    );
}

/* ═══════════════════════════ EVENT CARD ═══════════════════════════ */
function EventCard({
    event,
    visible,
    delay,
    onDetails,
}: {
    event: EventItem;
    visible: boolean;
    delay: number;
    onDetails: (e: EventItem) => void;
}) {
    return (
        <div
            onClick={() => onDetails(event)}
            className={`group gradient-border bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-700 cursor-pointer
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        hover:shadow-card-hover hover:-translate-y-2
      `}
            style={{
                transitionDelay: `${delay}s`,
                boxShadow: '0 1px 2px rgba(10,42,74,0.03), 0 4px 12px rgba(10,42,74,0.04)',
            }}
        >
            {/* ── Image ── */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={event.imgUrl}
                    alt={event.title}
                    className="w-full h-full object-cover zoom-img"
                    loading="lazy"
                />
                {/* Dark gradient overlay always visible at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A4A]/50 via-transparent to-transparent" />

                {/* Hover overlay */}
                <div
                    className="absolute inset-0 bg-[#0A2A4A]/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer z-[5]"
                    onClick={() => onDetails(event)}
                >
                    <span className="px-5 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-[12px] font-semibold border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-300 flex items-center gap-2">
                        View Details <ArrowRightIcon />
                    </span>
                </div>

                {/* Status */}
                <div className="absolute top-3 right-3 z-10">
                    <StatusBadge status={event.status} />
                </div>

                {/* Attendees count */}
                {event.attendees && (
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md text-[10.5px] font-semibold text-[#0A2A4A] shadow-sm">
                        <UsersIcon /> {event.attendees}+
                    </div>
                )}
            </div>

            {/* ── Body ── */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {event.tags.map((tag) => (
                        <span
                            key={tag}
                            className="tag-chip px-2 py-0.5 rounded-md bg-[#00629B]/[0.06] text-[#00629B] text-[10.5px] font-semibold cursor-default"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-[16.5px] font-bold text-[#0A2A4A] leading-snug mb-2 font-display group-hover:text-[#00629B] transition-colors duration-300 line-clamp-2">
                    {event.title}
                </h3>

                {/* Meta */}
                <div className="space-y-1 mb-2.5">
                    <MetaRow icon={<CalendarIcon size={13} />} text={event.date} bold />
                    <MetaRow icon={<ClockIcon />} text={event.time} />
                    <MetaRow icon={<LocationIcon />} text={event.location} />
                </div>

                {/* Description */}
                <p className="text-[#666] text-[12.5px] leading-relaxed mb-3 flex-1 line-clamp-2">
                    {event.description}
                </p>

                {/* Speaker */}
                {event.speaker && (
                    <div className="mb-3">
                        <SpeakerChip name={event.speaker} />
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-[#E1E5EA]/50">
                    {event.status !== 'completed' ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDetails(event); }}
                            className="btn-ripple group/btn flex-1 bg-[#0A2A4A] hover:bg-[#00629B] text-white font-semibold py-2.5 px-4 rounded-xl text-[12.5px] transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-blue"
                        >
                            {event.status === 'ongoing' ? 'Join Now' : 'Register'}
                            <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5"><ArrowRightIcon /></span>
                        </button>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDetails(event); }}
                            className="flex-1 bg-[#F5F7FA] text-[#999] font-semibold py-2.5 px-4 rounded-xl text-[12.5px] cursor-not-allowed border border-[#E1E5EA]/50 hover:bg-[#E1E5EA]/30 transition-all duration-300"
                        >
                            Event Ended
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDetails(event); }}
                        className="px-4 py-2.5 rounded-xl border border-[#E1E5EA]/80 text-[#00629B] font-semibold text-[12.5px] hover:bg-[#00629B]/[0.05] hover:border-[#00629B]/25 transition-all duration-300"
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */
export default function EventPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const { visible, refs } = useReveal();

    const openDetails = useCallback((event: EventItem) => {
        setSelectedEvent(event);
    }, []);

    const closeDetails = useCallback(() => {
        setSelectedEvent(null);
    }, []);

    const filteredEvents = mockEvents.filter((event) => {
        const matchesTab = activeTab === 'all' || event.status === activeTab;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            q === '' ||
            event.title.toLowerCase().includes(q) ||
            event.tags.some((t) => t.toLowerCase().includes(q)) ||
            event.location.toLowerCase().includes(q);
        return matchesTab && matchesSearch;
    });

    const getTabCount = useCallback(
        (status: string) => (status === 'all' ? mockEvents.length : mockEvents.filter((e) => e.status === status).length),
        []
    );

    // Featured event = first ongoing or upcoming
    const featuredEvent = mockEvents.find((e) => e.status === 'ongoing' || e.status === 'upcoming');
    // Remaining cards (exclude featured from filtered list)
    const cardEvents = filteredEvents.filter((e) => e.id !== featuredEvent?.id);

    const tabs = [
        { id: 'all' as const, label: 'All Events', icon: '✦' },
        { id: 'ongoing' as const, label: 'Ongoing', icon: '●' },
        { id: 'upcoming' as const, label: 'Upcoming', icon: '◎' },
        { id: 'completed' as const, label: 'Completed', icon: '✓' },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-[#333] font-sans antialiased relative">
            {/* ── Background decoration ── */}
            <div className="fixed inset-0 pointer-events-none z-0 mesh-bg" />
            <div className="fixed inset-0 pointer-events-none z-0 dot-pattern opacity-60" />

            {/* ── Decorative blobs ── */}
            <div className="fixed -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#00629B]/[0.03] blur-3xl pointer-events-none animate-morph" />
            <div className="fixed -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#FFC72C]/[0.04] blur-3xl pointer-events-none animate-morph" style={{ animationDelay: '-4s' }} />

            {/* ══════════════════ CONTENT WRAPPER ══════════════════ */}
            <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 lg:px-14 py-12 md:py-16">

                {/* ── Section Header ── */}
                <div className="text-center mb-10 animate-fade-in">


                    <h1 className="text-[#0A2A4A] text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight tracking-tight mb-4">
                        Events & Activities
                    </h1>

                    {/* Animated gold line */}
                    <div className="flex justify-center mb-5">
                        <div className="w-16 h-1 bg-gradient-to-r from-[#FFC72C] to-[#FFD95A] rounded-full animated-line" />
                    </div>

                    <p className="text-[#666] text-base md:text-[17px] max-w-lg mx-auto leading-relaxed font-light">
                        Workshops, hackathons, talks, and networking events — handpicked to accelerate your tech journey.
                    </p>
                </div>

                {/* ── Search + Filter bar ── */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    {/* Search */}
                    <div className="relative w-full lg:max-w-xs">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00629B]/40">
                            <SearchIcon />
                        </span>
                        <input
                            id="event-search"
                            type="text"
                            placeholder="Search events, tags…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-[#E1E5EA]/80 text-[#333] text-[13px] font-medium placeholder:text-[#aaa] focus:outline-none focus:border-[#00629B]/40 focus:ring-2 focus:ring-[#00629B]/8 transition-all duration-200 shadow-sm"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-1 p-1 bg-white/70 backdrop-blur-md rounded-xl border border-[#E1E5EA]/70 shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                id={`tab-${tab.id}`}
                                className={`relative px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-all duration-300 flex items-center gap-1.5 ${activeTab === tab.id
                                    ? 'text-white bg-[#0A2A4A] shadow-md shadow-[#0A2A4A]/20'
                                    : 'text-[#666] hover:text-[#0A2A4A] hover:bg-[#F5F7FA]'
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={`text-[10px] ${activeTab === tab.id ? 'text-[#FFC72C]' : 'text-[#bbb]'}`}>
                                    {tab.icon}
                                </span>
                                <span>{tab.label}</span>
                                <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-0.5 ${activeTab === tab.id ? 'bg-white/15 text-white/70' : 'bg-[#E1E5EA]/50 text-[#aaa]'
                                        }`}
                                >
                                    {getTabCount(tab.id)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Featured Event ── */}
                {featuredEvent && activeTab === 'all' && searchQuery === '' && (
                    <div className="animate-scale-in">
                        <FeaturedEventHero event={featuredEvent} onDetails={openDetails} />
                    </div>
                )}

                {/* ── Events Grid ── */}
                {(activeTab === 'all' && searchQuery === '' ? cardEvents : filteredEvents).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                        {(activeTab === 'all' && searchQuery === '' ? cardEvents : filteredEvents).map((event, idx) => (
                            <div
                                key={event.id}
                                ref={(el) => { refs.current[idx] = el; }}
                                data-id={event.id}
                            >
                                <EventCard event={event} visible={visible.has(event.id)} delay={idx * 0.06} onDetails={openDetails} />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ── Empty state ── */
                    <div className="text-center py-20 px-6 bg-white/70 backdrop-blur-md rounded-2xl border border-[#E1E5EA]/60 animate-scale-in">
                        <div className="w-16 h-16 mx-auto mb-5 bg-[#0A2A4A] rounded-2xl flex items-center justify-center shadow-blue rotate-6">
                            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#FFC72C]">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>
                        <h3 className="text-[#0A2A4A] text-xl font-bold mb-2 font-display">No Events Found</h3>
                        <p className="text-[#888] text-sm max-w-sm mx-auto leading-relaxed">
                            {searchQuery
                                ? <>No results for "<span className="font-semibold text-[#00629B]">{searchQuery}</span>". Try different keywords.</>
                                : <>No <span className="font-semibold text-[#00629B]">{activeTab}</span> events right now. Check back soon!</>
                            }
                        </p>
                        <button
                            className="mt-5 px-5 py-2 bg-[#0A2A4A] text-white font-semibold rounded-xl text-[13px] hover:bg-[#00629B] transition-colors shadow-blue/30"
                            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                        >
                            View All Events
                        </button>
                    </div>
                )}

                {/* ── CTA Banner ── */}
                <section className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-hero text-white">
                    {/* Pattern */}
                    <div className="absolute inset-0 hero-lines pointer-events-none" />
                    <div className="absolute inset-0 hero-mesh pointer-events-none opacity-50" />
                    {/* Decorative circles */}
                    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border border-white/[0.06] pointer-events-none" />
                    <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-white/[0.04] pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#FFC72C]/[0.08] blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 md:p-12">
                        <div className="flex-1 max-w-xl">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-[10.5px] font-bold uppercase tracking-wider text-white/70 mb-4">
                                <SparkleIcon /> Get Involved
                            </div>
                            <h3 className="text-2xl md:text-3xl font-extrabold font-display mb-3 leading-snug tracking-tight">
                                Want to Host Your Own Event?
                            </h3>
                            <p className="text-white/60 text-sm md:text-[15px] leading-relaxed max-w-md">
                                Propose your event idea and we'll help you bring it to life with full support, resources, and promotion across the IEEE network.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <button className="btn-ripple group/cta px-7 py-3 bg-[#FFC72C] hover:bg-[#FFD95A] text-[#0A2A4A] font-bold rounded-xl text-[13px] transition-all duration-300 hover:shadow-gold flex items-center gap-2">
                                Propose Event
                                <span className="transition-transform duration-300 group-hover/cta:translate-x-1"><ArrowRightIcon /></span>
                            </button>
                            <button className="px-7 py-3 bg-white/[0.08] hover:bg-white/[0.15] text-white font-semibold rounded-xl text-[13px] border border-white/15 transition-all duration-300 backdrop-blur-md">
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* ── Event Detail Modal ── */}
            {selectedEvent && (
                <EventDetailModal event={selectedEvent} onClose={closeDetails} />
            )}
        </div>
    );
}