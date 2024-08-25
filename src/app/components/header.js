import Image from "next/image";

const Header = () => {
  return (
    <>
      <header style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>
          {/* AutoBrief Logo */}
          <Image
            src="/Logo.png"
            alt="Capitol Dome"
            width={175}
            height={175}
            quality={100} // optional, set image quality if you want to ensure it's max
            style={{
              display: "block",
              width: "600px",
              height: "600px",
              margin: "-175px auto",
              marginBottom: "-265px",
            }}
          />
          Auto<span className="highlight">Brief</span>
        </h1>
        <p
          className="tagline"
          style={{
            fontSize: "1.25rem",
            color: "#555",
          }}
        >
          For Hill Briefings.
        </p>
      </header>
    </>
  );
};

export { Header };
