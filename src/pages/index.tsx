import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css, Global } from '@emotion/react';
import type { Options } from 'types';
import getOptions from 'utils/getOptions';

const globalStyles = css`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: sans-serif;
    background-color: #18181b;
  }
`;
const HomeRoot = styled.div`
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
const Player = styled(Iframe)`
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
const TvPlayerIframe = Iframe;
const TvPlayerSportBoxIframe = styled(Iframe)<{ $isPlaylist: boolean }>`
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
const TvPlayerMatchTvIframe = styled(Iframe)`
  width: 990px;

  @media (min-width: 1280px) {
    height: 704px;
    transform: translate(9px, -199px) scale(1.06);
  }
  @media (min-width: 1365px) {
    height: 733px;
    transform: translate(9px, -190px) scale(1.096);
  }
  @media (min-width: 1440px) {
    transform: translate(9px, -178px) scale(1.178);
  }
  @media (min-width: 1600px) {
    transform: translate(9px, -151px) scale(1.352);
  }
  @media (min-width: 1680px) {
    transform: translate(12px, -138px) scale(1.432);
  }
  @media (min-width: 1920px) {
    transform: translate(15px, -97px) scale(1.688);
  }
  @media (min-width: 2540px) {
    transform: translate(20px, 11px) scale(2.377);
  }
`;
const TvPlayerMoreTvIframe = styled(Iframe)`
  width: 1024px;

  @media (min-width: 1280px) {
    height: 709px;
    transform: translateY(-130px);
  }
  @media (min-width: 1365px) {
    height: 756px;
    transform: translateY(-130px);
  }
  @media (min-width: 1440px) {
    transform: translateY(-112px) scale(1.07);
  }
  @media (min-width: 1600px) {
    transform: translateY(-74px) scale(1.23);
  }
  @media (min-width: 1680px) {
    transform: translateY(-55px) scale(1.31);
  }
  @media (min-width: 1920px) {
    transform: translateY(3px) scale(1.54);
  }
  @media (min-width: 2540px) {
    transform: translateY(156px) scale(2.164);
  }
`;
const TvPlayerVitrinaTvIframe = styled(Iframe)`
  width: 1038px;

  @media (min-width: 1280px) {
    height: 659px;
    transform: translateY(-140px);
  }
  @media (min-width: 1365px) {
    height: 707px;
    transform: translateY(-140px);
  }
  @media (min-width: 1440px) {
    height: 712px;
    transform: translateY(-127px) scale(1.06);
  }
  @media (min-width: 1600px) {
    transform: translateY(-93px) scale(1.22);
  }
  @media (min-width: 1680px) {
    transform: translateY(-78px) scale(1.29);
  }
  @media (min-width: 1920px) {
    transform: translateY(-26px) scale(1.53);
  }
  @media (min-width: 2540px) {
    transform: translateY(106px) scale(2.15);
  }
`;
const TvPlayerSmotrimRuIframe = styled(Iframe)`
  width: 1024px;

  @media (min-width: 1440px) {
    transform: scale(1.16);
  }
  @media (min-width: 1600px) {
    transform: translateY(100px) scale(1.33);
  }
  @media (min-width: 1680px) {
    transform: translateY(120px) scale(1.41);
  }
  @media (min-width: 1920px) {
    transform: translateY(250px) scale(1.65);
  }
  @media (min-width: 2540px) {
    transform: translateY(400px) scale(2.34);
  }
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
const Link = styled.a`
  text-decoration: none;
  color: #64b5f6;

  &:hover {
    text-decoration: underline;
  }
`;

const getTwitchChatUrl = (channel: string, hostname: string) =>
  `//www.twitch.tv/embed/${channel}/chat?darkpopout&parent=${hostname}`;

const getTwitchPlayerUrl = (channel: string, hostname: string) =>
  `//player.twitch.tv/?channel=${channel}&parent=${hostname}`;

const Home = () => {
  const [options, setOptions] = useState<Options>(null);

  const {
    hostname,
    tvPlayerUrl,
    tvPlayerType,
    tvPlayerIsPlaylist,
    twitchPlayer,
    twitchChats,
  } = options || {};

  const [activeChat, setActiveChat] = useState('');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const options = await getOptions();

      setOptions(options);
      setActiveChat(options.twitchChats[0]);
      setIsTooltipVisible(options.tvPlayerIsPlaylist);
    })();
  }, []);

  return (
    <HomeRoot>
      <Head>
        <title>Formula Kubov</title>
      </Head>
      {options && (
        <Player
          allow="autoplay"
          allowFullScreen
          src={getTwitchPlayerUrl(twitchPlayer, hostname)}
        />
      )}
      <Chats>
        <ChatTabs>
          {options &&
            twitchChats.map((chat) => (
              <ChatTab
                key={chat}
                $active={chat === activeChat}
                onClick={() => setActiveChat(chat)}
              >
                {chat}
              </ChatTab>
            ))}
        </ChatTabs>
        {options &&
          twitchChats.map((chat) => (
            <Chat
              key={chat}
              src={getTwitchChatUrl(chat, hostname)}
              $active={chat === activeChat}
            />
          ))}
        {isTooltipVisible && (
          <Tooltip>
            CUM 4 под плеером!
            <br />
            Скролл колёсиком мыши!
            <TooltipCloseButton onClick={() => setIsTooltipVisible(false)}>
              ОК
            </TooltipCloseButton>
          </Tooltip>
        )}
      </Chats>
      <TvPlayer>
        {tvPlayerType === 'embed' && <TvPlayerIframe src={tvPlayerUrl} />}
        {tvPlayerType === 'sportbox' && (
          <TvPlayerSportBoxIframe
            src={tvPlayerUrl}
            $isPlaylist={tvPlayerIsPlaylist}
          />
        )}
        {tvPlayerType === 'matchtv' && (
          <TvPlayerMatchTvIframe src={tvPlayerUrl} />
        )}
        {tvPlayerType === 'more.tv' && (
          <TvPlayerMoreTvIframe src={tvPlayerUrl} />
        )}
        {tvPlayerType === 'vitrina.tv' && (
          <TvPlayerVitrinaTvIframe src={tvPlayerUrl} />
        )}
        {tvPlayerType === 'smotrim.ru' && (
          <TvPlayerSmotrimRuIframe src={tvPlayerUrl} />
        )}
      </TvPlayer>
      <Copyright>
        <span>
          Author:&nbsp;
          <Link
            target="_blank"
            rel="noreferrer noopener"
            href="//github.com/DmitryScaletta"
          >
            DmitryScaletta
          </Link>{' '}
          - Repository:&nbsp;
          <Link
            target="_blank"
            rel="noreferrer noopener"
            href="//github.com/honeykingdom/formula-kubov"
          >
            GitHub
          </Link>
        </span>
      </Copyright>
      <Global styles={globalStyles} />
    </HomeRoot>
  );
};

export default Home;
