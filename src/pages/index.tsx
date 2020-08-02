import React from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';

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
const TvPlayerIframe = styled(Iframe)<{ $isPlaylist: boolean }>`
  width: 990px;

  ${(p) =>
    p.$isPlaylist
      ? css`
          @media (min-width: 1280px) {
            height: 646px;
            transform: translate(9px, -133px) scale(1.052);
          }
          @media (min-width: 1365px) {
            height: 673px;
            transform: translate(9px, -126px) scale(1.087);
          }
          @media (min-width: 1440px) {
            transform: translate(10px, -112px) scale(1.166);
          }
          @media (min-width: 1600px) {
            transform: translate(11px, -82px) scale(1.336);
          }
          @media (min-width: 1680px) {
            transform: translate(12px, -67px) scale(1.421);
          }
          @media (min-width: 1920px) {
            transform: translate(15px, -21px) scale(1.677);
          }
          @media (min-width: 2540px) {
            transform: translate(20px, 101px) scale(2.354);
          }
        `
      : css`
          @media (min-width: 1280px) {
            height: 616px;
            transform: translate(9px, -113px) scale(1.08);
          }
          @media (min-width: 1365px) {
            height: 644px;
            transform: translate(9px, -105px) scale(1.113);
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
        `};
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

const playerUrl = `//player.twitch.tv/?channel=melharucos&parent=${process.env.GATSBY_HOSTNAME}`;
const chatUrl = `//www.twitch.tv/embed/melharucos/chat?darkpopout&parent=${process.env.GATSBY_HOSTNAME}`;
const isPlaylist = JSON.parse(
  process.env.GATSBY_TV_PLAYER_IS_PLAYLIST || 'false',
);

const App = () => (
  <AppRoot>
    <Player src={playerUrl} />
    <Chat src={chatUrl} />
    <TvPlayer>
      <TvPlayerIframe
        src={process.env.GATSBY_TV_PLAYER_URL}
        $isPlaylist={isPlaylist}
      />
      <Copyright>
        Author: <Link href="//github.com/DmitryScaletta">DmitryScaletta</Link> -
        Repository:{' '}
        <Link href="//github.com/honeykingdom/formula-kubov">GitHub</Link>
      </Copyright>
    </TvPlayer>
    <GlobalStyle />
  </AppRoot>
);

export default App;
