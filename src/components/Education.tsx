import "./styles/Education.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Education = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const educationData = [
        {
            title: "B.Tech in Computer Science & Engineering",
            institution: "GLA University, Mathura",
            duration: "2023 – 2027",
            status: "PURSUING",
            icon: "🎓",
            year: "2023"
        },
        {
            title: "Diploma in Engineering",
            institution: "Board of Technical Education",
            duration: "2020 – 2023",
            status: "COMPLETED",
            icon: "📜",
            year: "2020"
        },
        {
            title: "Higher Secondary Education",
            institution: "St. Paul's Senior Sec. School | UP BOARD",
            duration: "2018 – 2020",
            status: "COMPLETED",
            icon: "🏫",
            year: "2018"
        }
    ];

    useGSAP(() => {
        const items = gsap.utils.toArray<HTMLElement>(".education-item");
        
        // Header animation
        gsap.from(".education-header h2", {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".education-header",
                start: "top 80%",
            }
        });

        // Line animation
        gsap.from(".education-line", {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 1.5,
            ease: "none",
            scrollTrigger: {
                trigger: ".education-timeline-wrapper",
                start: "top 70%",
                end: "bottom 80%",
                scrub: 1
            }
        });

        // Items and Dots animation
        items.forEach((item, index) => {
            const card = item.querySelector(".education-card");
            const dot = item.querySelector(".education-dot");
            const year = item.querySelector(".education-year");

            // Card entrance animation

            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });

            gsap.from(dot, {
                scale: 0,
                duration: 0.5,
                ease: "back.out(3)",
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                }
            });

            gsap.from(year, {
                opacity: 0,
                scale: 0.5,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                }
            });
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="education-section section-container" id="education">
            <div className="education-container">
                <hgroup className="education-header">
                    <h2>
                        My <span>Education</span>
                    </h2>
                </hgroup>

                <div className="education-timeline-wrapper">
                    <div className="education-line"></div>

                    {educationData.map((edu, index) => (
                        <div key={`${edu.title}-${index}`} className="education-item left">
                            <div className="education-dot-container">
                                <div className="education-dot"></div>
                                <span className="education-year">{edu.year}</span>
                            </div>

                            <div className="education-card">
                                <div className="card-header">
                                    <span className="edu-icon">{edu.icon}</span>
                                    <span className={`status-badge ${edu.status.toLowerCase()}`}>
                                        {edu.status}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <h3>{edu.title}</h3>
                                    <p className="institution">{edu.institution}</p>
                                </div>
                                <div className="card-footer">
                                    <span className="duration">{edu.duration}</span>
                                    <span className="validated">VALIDATED</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
