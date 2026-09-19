import Head from "next/head";
import styled from "styled-components";

const StyledErrorPage = styled.div`
  @keyframes colorful {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
  font-family: "Teko", sans-serif;
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: #141821;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  color: #fba302;
  pointer-events: none;
  .t {
    opacity: 0.5;
    font-size: 9rem;
    font-weight: bold;
    letter-spacing: 1.8rem;
    text-indent: 1.8rem;
    border-bottom: 2px solid #fba302;
    animation: colorful 1.8s infinite linear;
  }
  .s1 {
    opacity: 0.5;
    font-size: 1.8rem;
    letter-spacing: 0.2rem;
    text-indent: 0.2rem;
    margin: 1rem 0;
    animation: colorful 1.8s 0.2s infinite linear;
  }
  .s2 {
    opacity: 0.5;
    background: #fba302;
    padding: 0.8rem;
    color: #00133a;
    font-size: 1rem;
    letter-spacing: 0.06rem;
    text-indent: 0.06rem;
    animation: colorful 1.8s 0.4s infinite linear;
  }
`;

export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta
          key="description"
          name="description"
          content="404 - Page Not Found"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Teko:wght@500&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <StyledErrorPage>
        <div className="t">404</div>
        <div className="s1">The Page Was Not Found</div>
        <div className="s2">The page you were looking for does not exist.</div>
      </StyledErrorPage>
    </>
  );
}
