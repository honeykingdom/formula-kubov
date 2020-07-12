import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
`;
const AppRoot = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-rows: 192px auto;
  grid-template-columns: auto 340px;
  grid-template-areas:
    'tv-player player'
    'tv-player chat';
`;
const Iframe = styled.iframe`
  border: none;
  width: 100%;
  height: 100%;
`;
const Player = styled(Iframe).attrs({
  allow: 'autoplay',
  allowFullScreen: true,
})`
  grid-area: player;
  z-index: 1;
`;
const Chat = styled(Iframe)`
  grid-area: chat;
  background-color: gray;
  z-index: 1;
`;
const TvPlayer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  grid-area: tv-player;
  background-color: #18181b;
  overflow: hidden;
`;
const TvPlayerIframe = styled(Iframe)`
  width: 990px;

  @media (min-width: 1280px) {
    transform: translate(9px, -113px) scale(1.08);
    height: 616px;
  }
  @media (min-width: 1365px) {
    transform: translate(9px, -105px) scale(1.113);
    height: 644px;
  }
  @media (min-width: 1440px) {
    transform: translate(10px, -89px) scale(1.195);
  }
  @media (min-width: 1600px) {
    transform: translate(12px, -56px) scale(1.368);
  }
  @media (min-width: 1680px) {
    transform: translate(12px, -39px) scale(1.456);
  }
  @media (min-width: 1920px) {
    transform: translate(15px, 12px) scale(1.715);
  }
  @media (min-width: 2540px) {
    transform: translate(20px, 147px) scale(2.412);
  }
`;
const Copyright = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 0;
  color: #fff;
  font-family: sans-serif;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  opacity: 0.6;
`;
const Link = styled.a.attrs({ target: '_blank', rel: 'noreferrer noopener' })`
  text-decoration: none;
  color: #64b5f6;

  &:hover {
    text-decoration: underline;
  }
`;

const playerUrl = `//player.twitch.tv/?channel=melharucos&parent=${window.location.host}`;
const chatUrl = `//www.twitch.tv/embed/melharucos/chat?darkpopout&parent=${window.location.host}`;
const tvPlayerUrl =
  'https://news.sportbox.ru/Vidy_sporta/Avtosport/Formula_1/spbvideo_NI1208692_translation_Gran_pri_Shtirii';

export default function App() {
  return (
    <AppRoot>
      <Player src={playerUrl} />
      <Chat src={chatUrl} />
      <TvPlayer>
        <TvPlayerIframe src={tvPlayerUrl} />
        <Copyright>
          Author: <Link href="//github.com/DmitryScaletta">DmitryScaletta</Link>{' '}
          - Repository:{' '}
          <Link href="https://github.com/honeykingdom/formula-kubov">
            GitHub
          </Link>
        </Copyright>
      </TvPlayer>
      <GlobalStyle />
    </AppRoot>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
