import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/bankingApi.js";
import Logo from "../components/brand/Logo.jsx";
import Footer from "../components/layout/Footer.jsx";
import ThemeToggle from "../components/layout/ThemeToggle.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { usePageNavigate } from "../hooks/usePageNavigate.js";
import bankYardImage from "../../images/bank image yard.jpg";
import bankImage from "../../images/bank image.jpg";
import bankHeroImage from "../../images/bank.jpg";
import bankNightOneImage from "../../images/bank night 1.jpg";
import bankNightTwoImage from "../../images/night bank 2.jpg";
import bankNightThreeImage from "../../images/night bank 3.jpg";

const lightLandingImages = [bankYardImage, bankImage, bankHeroImage];
const darkLandingImages = [
  bankNightOneImage,
  bankNightTwoImage,
  bankNightThreeImage,
];

export default function LogonPage() {
  const navigate = usePageNavigate();
  const { theme } = useTheme();
  const { selectUser } = useUser();
  const landingImages =
    theme === "dark" ? darkLandingImages : lightLandingImages;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const {
    data: users = [],
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentIndex) =>
        (currentIndex + 1) % landingImages.length,
      );
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [landingImages.length]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [theme]);

  function handleUserSelection(user) {
    const [name, ...surnameParts] = user.name.split(" ");

    selectUser({
      id: user.id,
      name,
      surname: surnameParts.join(" "),
      fullName: user.name,
    });
    navigate("/frontpage");
  }

  return (
    <div className="app-shell logon-app-shell">
      <header className="site-header logon-header">
        <Logo />
        <div className="logon-header-actions">
          <ThemeToggle />
        </div>
      </header>

      <main className="logon-landing-shell">
        <div className="landing-image-cycle" aria-hidden="true">
          {landingImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt=""
              className={index === activeImageIndex ? "is-active" : ""}
            />
          ))}
        </div>

        <section className="logon-panel" aria-labelledby="logon-title">
          <div className="widget-header">
            <div>
              <p className="section-label">Select profile</p>
              <h1 id="logon-title" className="panel-title">
                Log on
              </h1>
            </div>
          </div>

          {isLoading && <p className="state-message">Loading users...</p>}
          {isError && (
            <p className="state-message state-message-error">
              Users are unavailable right now.
            </p>
          )}
          {isSuccess && (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    className="user-option"
                    type="button"
                    onClick={() => handleUserSelection(user)}
                  >
                    <span className="user-avatar" aria-hidden="true">
                      {user.name.slice(0, 1)}
                    </span>
                    <span>{user.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
