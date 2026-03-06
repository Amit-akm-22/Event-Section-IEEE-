import { useState, useEffect, useRef } from 'react';

/* ───────── Types ───────── */
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

/* ───────── Data ───────── */
const mockEvents: EventItem[] = [
    {
        id: 1,
        title: 'IEEE Tech Symposium 2026',
        date: 'March 15 – 18, 2026',
        time: '10:00 AM – 5:00 PM',
        location: 'Main Auditorium',
        description:
            'A 3-day deep dive into AI, Robotics, and Quantum Computing with industry leaders from Google, Microsoft, and MIT.',
        status: 'upcoming',
        imgUrl:
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=90',
        tags: ['AI', 'Robotics', 'Quantum'],
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
            'Intensive hands-on workshop covering full-stack applications with React, Node.js, and cloud deployment strategies.',
        status: 'ongoing',
        imgUrl:
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=90',
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
            'Celebrating the legacy and future of engineering with keynote speeches, networking sessions, and cultural events.',
        status: 'completed',
        imgUrl:
            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=90',
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
            'Build innovative hardware solutions addressing real-world problems. Mentorship from experts and components provided.',
        status: 'upcoming',
        imgUrl:
            'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=90',
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
            'Expert panel discussing network security, ethical hacking, and blockchain security with live demonstrations.',
        status: 'ongoing',
        imgUrl:
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=90',
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
            'A beginner-friendly session breaking down complex ML concepts with Python, TensorFlow, and real-world datasets.',
        status: 'completed',
        imgUrl:
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=90',
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
            'Hands-on workshop on AWS, Azure, and GCP. Learn to deploy, scale, and manage cloud infrastructure from scratch.',
        status: 'upcoming',
        imgUrl:
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=90',
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
            'Empowering the next generation of women in STEM with panel discussions, workshops, and mentorship opportunities.',
        status: 'completed',
        imgUrl:
            'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1200&q=90',
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
            'Learn how to contribute to open-source projects. Start your journey into collaborative coding with experienced mentors.',
        status: 'upcoming',
        imgUrl:
            'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=90',
        tags: ['Open Source', 'Git', 'Collaboration'],
        speaker: 'Mr. Liam Zhang',
        attendees: 90,
    },
];

/* ───────── Icon Components ───────── */
const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
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
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
        <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    </svg>
);

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="transition-transform duration-300 group-hover/btn:translate-x-1">
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

/* ───────── Main Component ───────── */
export default function EventPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const filteredEvents = mockEvents.filter((event) => {
        const matchesTab = activeTab === 'all' || event.status === activeTab;
        const matchesSearch =
            searchQuery === '' ||
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const getTabCount = (status: string) => {
        if (status === 'all') return mockEvents.length;
        return mockEvents.filter((e) => e.status === status).length;
    };

    /* Scroll-reveal for cards */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = Number(entry.target.getAttribute('data-id'));
                        setVisibleCards((prev) => new Set(prev).add(id));
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        cardRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [filteredEvents]);

    const statusConfig = {
        ongoing: {
            label: '● Live Now',
            bg: 'bg-emerald-500',
            text: 'text-white',
            glow: 'shadow-[0_0_16px_rgba(34,197,94,0.4)]',
        },
        upcoming: {
            label: 'Coming Soon',
            bg: 'bg-[#00629B]',
            text: 'text-white',
            glow: 'shadow-[0_0_16px_rgba(0,98,155,0.3)]',
        },
        completed: {
            label: 'Completed',
            bg: 'bg-[#0A2A4A]/70',
            text: 'text-white/80',
            glow: '',
        },
    };

    const tabs = [
        { id: 'all' as const, label: 'All Events', icon: '✦' },
        { id: 'ongoing' as const, label: 'Ongoing', icon: '●' },
        { id: 'upcoming' as const, label: 'Upcoming', icon: '◎' },
        { id: 'completed' as const, label: 'Completed', icon: '✓' },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FA] text-[#333333] font-sans antialiased selection:bg-[#00629B]/20 selection:text-[#0A2A4A]">


            {/* ══════════════════════════ MAIN CONTENT ══════════════════════════ */}
            <main className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-16 pb-24">
                {/* Section header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 text-[#00629B] font-semibold uppercase tracking-[0.15em] text-xs mb-4 px-4 py-1.5 bg-[#00629B]/[0.06] rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00629B]" />
                        What's happening
                    </span>
                    <h2 className="text-[#0A2A4A] text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-tight">
                        Events & Activities
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#FFC72C] to-[#FFD95A] rounded-full mx-auto mt-4" />
                    <p className="text-[#555] text-base md:text-lg max-w-xl mx-auto mt-5 leading-relaxed font-light">
                        Browse through our comprehensive calendar of technical events, workshops, and networking opportunities.
                    </p>
                </div>

                {/* ─── Search & Filter Bar ─── */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-10">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00629B]/50">
                            <SearchIcon />
                        </span>
                        <input
                            id="event-search"
                            type="text"
                            placeholder="Search events or tags…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#E1E5EA] text-[#333] text-sm font-medium placeholder:text-[#999] focus:outline-none focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/10 transition-all duration-200 shadow-sm"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-white rounded-xl border border-[#E1E5EA] shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                id={`tab-${tab.id}`}
                                className={`relative px-4 md:px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-300 flex items-center gap-1.5 ${activeTab === tab.id
                                    ? 'text-white bg-[#0A2A4A] shadow-md'
                                    : 'text-[#555] hover:text-[#0A2A4A] hover:bg-[#F5F7FA]'
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={`text-[11px] ${activeTab === tab.id ? 'text-[#FFC72C]' : 'text-[#999]'}`}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                                <span
                                    className={`ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-white/15 text-white/80' : 'bg-[#E1E5EA]/60 text-[#999]'
                                        }`}
                                >
                                    {getTabCount(tab.id)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── Events Grid ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                    {filteredEvents.map((event, idx) => {
                        const cfg = statusConfig[event.status];
                        return (
                            <div
                                key={event.id}
                                ref={(el) => { cardRefs.current[idx] = el; }}
                                data-id={event.id}
                                className={`group bg-white rounded-2xl overflow-hidden border border-[#E1E5EA]/70 flex flex-col transition-all duration-500 cursor-pointer
                  ${visibleCards.has(event.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                  hover:shadow-card-hover hover:-translate-y-1.5
                `}
                                style={{
                                    transitionDelay: `${idx * 0.07}s`,
                                    boxShadow: '0 1px 3px rgba(10,42,74,0.04), 0 4px 12px rgba(10,42,74,0.05)',
                                }}
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={event.imgUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A4A]/80 via-[#0A2A4A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                                        <span className="text-white font-medium text-sm flex items-center gap-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                            View Details <ArrowIcon />
                                        </span>
                                    </div>

                                    {/* Status badge */}
                                    <span
                                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text} ${cfg.glow} backdrop-blur-md`}
                                    >
                                        {cfg.label}
                                    </span>

                                    {/* Attendees badge */}
                                    {event.attendees && (
                                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#0A2A4A]">
                                            <UsersIcon /> {event.attendees}+
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {event.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2.5 py-0.5 rounded-md bg-[#00629B]/[0.06] text-[#00629B] text-[11px] font-semibold"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-[#0A2A4A] leading-snug mb-2 font-display group-hover:text-[#00629B] transition-colors duration-300 line-clamp-2">
                                        {event.title}
                                    </h3>

                                    {/* Meta info */}
                                    <div className="space-y-1.5 mb-3">
                                        <div className="flex items-center gap-2 text-[12.5px] text-[#666]">
                                            <span className="text-[#00629B]/60"><CalendarIcon /></span>
                                            <span className="font-medium">{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[12.5px] text-[#666]">
                                            <span className="text-[#00629B]/60"><ClockIcon /></span>
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[12.5px] text-[#666]">
                                            <span className="text-[#00629B]/60"><LocationIcon /></span>
                                            <span>{event.location}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-[#555] text-[13px] leading-relaxed mb-4 flex-1 line-clamp-2">
                                        {event.description}
                                    </p>

                                    {/* Speaker if present */}
                                    {event.speaker && (
                                        <div className="flex items-center gap-2.5 mb-4 py-2 px-3 bg-[#F5F7FA] rounded-lg">
                                            <div className="w-7 h-7 rounded-full bg-[#0A2A4A] flex items-center justify-center text-[11px] font-bold text-[#FFC72C]">
                                                {event.speaker.split(' ').map(w => w[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-semibold text-[#0A2A4A]">{event.speaker}</div>
                                                <div className="text-[10px] text-[#999]">Speaker</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex gap-2.5 mt-auto pt-4 border-t border-[#E1E5EA]/60">
                                        {event.status !== 'completed' ? (
                                            <button className="group/btn flex-1 bg-[#0A2A4A] hover:bg-[#00629B] text-white font-semibold py-2.5 px-4 rounded-lg text-[13px] transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-blue">
                                                {event.status === 'ongoing' ? 'Join Now' : 'Register'}
                                                <ArrowIcon />
                                            </button>
                                        ) : (
                                            <button className="flex-1 bg-[#E1E5EA]/50 text-[#999] font-semibold py-2.5 px-4 rounded-lg text-[13px] cursor-not-allowed">
                                                Event Ended
                                            </button>
                                        )}
                                        <button className="px-4 py-2.5 rounded-lg border border-[#E1E5EA] text-[#00629B] font-semibold text-[13px] hover:bg-[#00629B]/[0.06] hover:border-[#00629B]/30 transition-all duration-300">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Empty State ─── */}
                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 px-8 bg-white rounded-2xl shadow-card border border-[#E1E5EA]/70 mt-8 animate-scale-in">
                        <div className="w-20 h-20 mx-auto mb-6 bg-[#0A2A4A] rounded-2xl flex items-center justify-center shadow-blue">
                            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#FFC72C]">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>
                        <h3 className="text-[#0A2A4A] text-2xl font-bold mb-3 font-display">No Events Found</h3>
                        <p className="text-[#777] text-base max-w-md mx-auto leading-relaxed">
                            {searchQuery
                                ? <>No events match "<span className="font-semibold text-[#00629B]">{searchQuery}</span>". Try a different search term.</>
                                : <>There are no <span className="font-semibold text-[#00629B]">{activeTab}</span> events at the moment. Check back soon!</>
                            }
                        </p>
                        <button
                            className="mt-6 px-6 py-2.5 bg-[#0A2A4A] text-white font-semibold rounded-lg text-sm hover:bg-[#00629B] transition-colors"
                            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
                        >
                            View All Events
                        </button>
                    </div>
                )}

                {/* ─── CTA Section ─── */}
                <section className="mt-20 relative overflow-hidden rounded-2xl bg-gradient-1 text-white p-10 md:p-14">
                    {/* Background pattern */}
                    <div className="absolute inset-0 line-pattern pointer-events-none opacity-50" />
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FFC72C]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#00629B]/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="flex-1 max-w-xl">
                            <h3 className="text-2xl md:text-3xl font-extrabold font-display mb-3 leading-snug">
                                Want to Host Your Own Event?
                            </h3>
                            <p className="text-white/70 text-base leading-relaxed">
                                Be a part of our vibrant IEEE community. Propose your event idea and we'll help you bring it to life with full support and resources.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="group/cta px-8 py-3.5 bg-[#FFC72C] hover:bg-[#FFD95A] text-[#0A2A4A] font-bold rounded-xl text-sm transition-all duration-300 hover:shadow-gold flex items-center gap-2">
                                Propose Event
                                <ArrowIcon />
                            </button>
                            <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 transition-all duration-300 backdrop-blur-md">
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}