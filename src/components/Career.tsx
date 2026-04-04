import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Student Developer</h4>
                <h5>Personal & Academic Projects</h5>
              </div>
              <h3>2025 – Present</h3>
            </div>
            <p>
              Working on personal and academic development projects including backend
              APIs, web applications, and programming practice. Focused on improving
              coding skills, backend development, and building practical software
              solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
