import Head from 'next/head';
import React, { useState } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: sans-serif;
    background-color: #18181b;
  }
`;
const AppRoot = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-rows: 192px auto 48px;
  grid-template-columns: auto 340px;
  grid-template-areas:
    'tv-player player'
    'tv-player chat'
    'copyright chat';
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
const Chats = styled.div`
  grid-area: chat;
  position: relative;
`;
const ChatTabs = styled.div`
  display: flex;
  flex-grow: 1;
  border-bottom: 1px solid #303032;
`;
const ChatTab = styled.div<{ $active: boolean }>`
  flex-grow: 1;
  flex-basis: 0;
  color: ${(p) => (p.$active ? '#d3d3d3' : '#898395')};
  background-color: ${(p) => (p.$active ? '#1f1925' : '#0e0c13')};
  font-size: 12px;
  font-weight: bold;
  line-height: 19px;
  text-align: center;
  cursor: pointer;

  &:not(:last-child) {
    border-right: 1px solid #303032;
  }

  &:hover {
    background-color: #1f1925;
  }
`;
const Chat = styled(Iframe)<{ $active: boolean }>`
  display: ${(p) => (p.$active ? 'block' : 'none')};
  background-color: gray;
  height: calc(100% - 20px);
  z-index: 1;
`;
const Tooltip = styled.div`
  position: absolute;
  top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  padding: 3px 20px;
  font-size: 18px;
  color: #fff;
  background-color: #18181b;
`;
const TooltipCloseButton = styled.button`
  margin-left: 16px;
  cursor: pointer;
`;
const TvPlayer = styled.div`
  grid-area: tv-player;
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
`;
const TvPlayerIframe = styled(Iframe)<{ $isPlaylist: boolean }>`
  width: 990px;

  ${(p) =>
    p.$isPlaylist
      ? css`
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
        `
      : css`
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
        `};
`;
const Copyright = styled.div`
  grid-area: copyright;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: sans-serif;
  border-top: 1px solid #303032;
  opacity: 0.6;
`;
const Link = styled.a.attrs({ target: '_blank', rel: 'noreferrer noopener' })`
  text-decoration: none;
  color: #64b5f6;

  &:hover {
    text-decoration: underline;
  }
`;

const getChatUrl = (channel: string) =>
  `//www.twitch.tv/embed/${channel}/chat?darkpopout&parent=${process.env.NEXT_PUBLIC_HOSTNAME}`;

const playerUrl = `//player.twitch.tv/?channel=melharucos&parent=${process.env.NEXT_PUBLIC_HOSTNAME}`;
const chats = ['melharucos', 'lasqa'];
const isPlaylist = process.env.NEXT_PUBLIC_TV_PLAYER_IS_PLAYLIST === 'true';

const App = () => {
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(isPlaylist);

  return (
    <AppRoot>
      <Head>
        <title>Formula Kubov</title>
      </Head>
      <Player src={playerUrl} />
      <Chats>
        <ChatTabs>
          {chats.map((chat) => (
            <ChatTab
              key={chat}
              $active={chat === activeChat}
              onClick={() => setActiveChat(chat)}
            >
              {chat}
            </ChatTab>
          ))}
        </ChatTabs>
        {chats.map((chat) => (
          <Chat
            key={chat}
            src={getChatUrl(chat)}
            $active={chat === activeChat}
          />
        ))}
        {isTooltipVisible && (
          <Tooltip>
            CUM 4 под плеером!<br />Скролл колёсиком мыши!
            <TooltipCloseButton onClick={() => setIsTooltipVisible(false)}>
              ОК
            </TooltipCloseButton>
          </Tooltip>
        )}
      </Chats>
      <TvPlayer>
        <TvPlayerIframe
          src={process.env.NEXT_PUBLIC_TV_PLAYER_URL}
          $isPlaylist={isPlaylist}
        />
      </TvPlayer>
      <Copyright>
        <span>
          Author:&nbsp;
          <Link href="//github.com/DmitryScaletta">DmitryScaletta</Link> -
          Repository:&nbsp;
          <Link href="//github.com/honeykingdom/formula-kubov">GitHub</Link>
        </span>
      </Copyright>
      <GlobalStyle />
    </AppRoot>
  );
};

export default App;
