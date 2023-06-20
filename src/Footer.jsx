import "./Footer.css";

export const Footer = () => {
  const linkedIn = "https://www.linkedin.com/in/ajithkumar-m-2603b5175/";
  const gitHub = "https://github.com/AJITH1509";

  const handleClick = (link) => {
    window.open(link);
  };

  return (
    <div className="footer">
      <p>©️ reserved by Ajith Kumar</p>
      <div className="social">
        <img
          onClick={() => handleClick(linkedIn)}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
          alt="linkedin"
        />
        <label>AjithKumar M</label>
        <img
          onClick={() => handleClick(gitHub)}
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
          alt="github"
        />
        <label>AJITH1509</label>
      </div>
    </div>
  );
};
