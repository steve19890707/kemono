import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getData } from "../../common-lib/lib";
import { storageItemRemove } from "../../lib/toolFuntions";
import axios from "axios";
import noop from "lodash.noop";

export const envHost = () => {
  const host = window.location.host;
  if (!!~host.indexOf(":") || !!~host.indexOf("-dev")) {
    return "https://rd3-dev-demo.com";
  } else if (!!~host.indexOf("-qa")) {
    return "https://rd3-qa-demo.com";
  } else if (!!~host.indexOf("demo.games")) {
    return "https://demo.games.com";
  } else return "https://www.demo.com";
};

const mockFetchResponse = (result = {}) =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        error_msg: "SUCCESS",
        result,
      }),
  });

const mockList = [];
const mockNewsList = [
  {
    "id": 1361,
    "title": "CQ9 at SBC 2026: See You in Lisbon",
    "date": "2026-09-17",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/WP2wuLI9.png",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cosmoadmin",
    "created_at": "2026-09-17T05:50:43-04:00",
    "updated_at": "2026-09-17T05:50:43-04:00"
  },
  {
    "id": 949,
    "title": "Jump High Wins CasinoFreak Editor's Choice – June 2026",
    "date": "2026-06-26",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/A0jMoZe8.png",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cosmoadmin",
    "created_at": "2026-06-26T06:00:44-04:00",
    "updated_at": "2026-06-26T06:00:44-04:00"
  },
  {
    "id": 942,
    "title": "CQ9 to Showcase at iGB Live 2026 London",
    "date": "2026-06-08",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/KbrybR9O.png",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cosmoadmin",
    "created_at": "2026-06-08T05:15:52-04:00",
    "updated_at": "2026-06-08T05:15:52-04:00"
  },
  {
    "id": 935,
    "title": "CQ9 Gaming Partners with Chipy to Expand International Player Reach",
    "date": "2026-05-26",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/adZlTJIo.png",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cosmoadmin",
    "created_at": "2026-05-25T23:26:26-04:00",
    "updated_at": "2026-06-08T05:50:17-04:00"
  },
  {
    "id": 928,
    "title": "CQ9 Unveils Its New Brand Identity at ICE 2026",
    "date": "2025-12-24",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/SIhZs08x.png",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cqnine",
    "created_at": "2025-12-24T04:22:47-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 921,
    "title": "CQ9 Debuts at SBC Summit with Groundbreaking Entertainment Showcase",
    "date": "2025-08-20",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/8xspPtrp.png",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cosmoadmin",
    "created_at": "2025-08-20T02:41:28-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 907,
    "title": "CQ9 to Unveil New Live Marble Run Game at iGB LiVE 2025",
    "date": "2025-06-10",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/G75HV4P3.jpg",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cosmoadmin",
    "created_at": "2025-06-10T02:19:30-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 844,
    "title": "CQ9 Debuts at ICE Barcelona 2025: Join Us for the Grand Event",
    "date": "2025-01-03",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/SiELwk7p.jpg",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cqnine",
    "created_at": "2025-01-03T05:59:06-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 554,
    "title": "CQ9 Welcomes You at iGB Live 2024!",
    "date": "2024-07-09",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/yt8K1kEx.jpg",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cqnine",
    "created_at": "2024-07-09T02:40:22-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 539,
    "title": "CQ9’s Track Racing Game Shines at BiS SiGMA",
    "date": "2024-05-09",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/t03xFISE.jpg",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cqnine",
    "created_at": "2024-05-08T23:45:27-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 534,
    "title": "BiS Sigma Americas 2024 coming soon",
    "date": "2024-04-15",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/b4mLddFi.jpg",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cqnine",
    "created_at": "2024-04-15T04:46:04-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 18,
    "title": "Gaming Unleashed: A Brand-New Fusion of Adventure and Technology",
    "date": "2024-01-17",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/fOrfz2sw.jpg",
    "sort": 0,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:18:36-04:00",
    "updated_at": "2026-05-19T22:50:01-04:00"
  },
  {
    "id": 19,
    "title": "CQ9 wishes you all a Merry Christmas!",
    "date": "2023-12-21",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/vTmSubNo.jpg",
    "sort": 1,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:23:33-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 21,
    "title": "CQ9 Proves the Diversity of the Thriving Gaming Industry at SiGMA Europe Expo",
    "date": "2023-12-06",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/bRfc5Ha9.png",
    "sort": 2,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:29:22-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 23,
    "title": "CQ9 Welcomes You at iGB Live 2023!",
    "date": "2023-06-13",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/E2HPYkON.jpg",
    "sort": 3,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:35:10-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 25,
    "title": "Great Event Ushering in New Peak of the Industry - ICE London 2023",
    "date": "2022-11-25",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/DeTbLi57.jpg",
    "sort": 4,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:37:40-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 27,
    "title": "CQ9’s Debut at iGB Live Was Warmly Received!",
    "date": "2022-07-27",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/gB7YPTUz.jpg",
    "sort": 5,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:39:23-04:00",
    "updated_at": "2026-05-19T22:46:16-04:00"
  },
  {
    "id": 29,
    "title": "CQ9 Gaming to Collaborate with Gamblorium",
    "date": "2022-07-27",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/6aOPWV2k.jpg",
    "sort": 6,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cosmoadmin",
    "created_at": "2024-02-26T04:41:56-04:00",
    "updated_at": "2026-05-21T05:16:32-04:00"
  },
  {
    "id": 31,
    "title": "Get in to the Game",
    "date": "2022-05-23",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/GqilMBcy.jpg",
    "sort": 7,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:44:15-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 33,
    "title": "CQ9 Gaming and Gamblorium: new collaboration alert",
    "date": "2022-02-08",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/flRkNKEq.jpg",
    "sort": 8,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:46:35-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 35,
    "title": "SlotJava and CQ9 Gaming enter a partnership!",
    "date": "2021-09-02",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/R4gdtWg2.jpg",
    "sort": 9,
    "home": true,
    "top": true,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:48:33-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  },
  {
    "id": 36,
    "title": "CQ9 Gaming and CasinoHEX Sweden have teamed up in a new partnership",
    "date": "2021-08-03",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/ucAhxWFO.jpg",
    "sort": 10,
    "home": true,
    "top": false,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "cosmoadmin",
    "created_at": "2024-02-26T04:50:16-04:00",
    "updated_at": "2026-05-20T03:19:24-04:00"
  },
  {
    "id": 38,
    "title": "Brand-new upgraded CQ9 website",
    "date": "2020-10-01",
    "category_id": 46,
    "cover_img": "/mock/newscover-en/cd1urKNn.jpg",
    "sort": 11,
    "home": false,
    "top": false,
    "lang": "",
    "status": 2,
    "start_time": "",
    "end_time": "",
    "edited_by": "steve",
    "created_at": "2024-02-26T04:51:56-04:00",
    "updated_at": "2026-02-05T23:44:23-04:00"
  }
];

const mockPartnersList = [
  {
    "content": "{\"main\":{\"icon\":{\"src\":\"/mock/partners/partnersicon-en-WZQIz8Ja.jpg\",\"alt\":\"合作夥伴,Gamblorium,Slotjava,CQ9, slot, fishing, live, sportsbook, igaming, 數字營銷,老虎機,博彩,線上老虎機,魚機,真人發牌,荷官\",\"status\":false},\"descriptions\":{\"text1\":\"As a pioneer in the gaming industry, CQ9 leverages cutting-edge technology and agile R\\u0026D to deliver high-quality, competitive gaming content. Guided by the principle of \\\"co-creation and shared value,\\\" we forge deep strategic alliances with top industry partners. Through resource integration and technical collaboration, we accelerate our products' global expansion and enhance brand influence locally. We firmly believe that stability, trust, and consensus are the foundation of long-term partnerships. In an era of booming digital entertainment, CQ9 invites partners with global vision and industry insight to join us in unlocking the boundless potential of the gaming industry.\",\"text2\":\"\",\"text3\":\"\"},\"src\":{\"mobile\":\"/mock/partners/partnersmain-en-mobile-MJoefZ5N.png\",\"pc\":\"/mock/partners/partnersmain-en-pc-DntTdnRE.png\"},\"title\":\"\",\"caption\":\"Global Reach, Shared Success\"},\"customer\":[{\"index\":0,\"link\":\"https://gamblizard.com/no/\",\"src\":\"/mock/partners/partners-customer-cn-ADohHibr.png\"},{\"link\":\"https://machinessouscasino.com/\",\"src\":\"/mock/partners/partners-customer-cn-l5OgM7oc.png\",\"index\":1},{\"link\":\"https://zamsino.casino/\",\"src\":\"/mock/partners/partners-customer-cn-4Jw5z9Bl.png\",\"index\":2},{\"link\":\"https://tiradas.gratis \",\"src\":\"/mock/partners/partners-customer-cn-vLUcteKG.png\",\"index\":3},{\"link\":\"https://toroslots.com \",\"src\":\"/mock/partners/partners-customer-cn-UtRje0Na.png\",\"index\":4},{\"index\":5,\"link\":\"https://zaslots.com \",\"src\":\"/mock/partners/partners-customer-cn-QE7z8v3U.png\"},{\"link\":\"https://kasynobezdepozytu.com \",\"src\":\"/mock/partners/partners-customer-cn-8gj9TI9v.png\",\"index\":6},{\"index\":7,\"link\":\"https://bonusbezdepozytu.org \",\"src\":\"/mock/partners/partners-customer-cn-5v0ZdEPH.png\"},{\"index\":8,\"link\":\"https://nzfreespins.com \",\"src\":\"/mock/partners/partners-customer-cn-uw4dKnVv.png\"},{\"link\":\"https://kiwislots.nz \",\"src\":\"/mock/partners/partners-customer-cn-ZQg5JrId.png\",\"index\":9},{\"link\":\"https://bonuszonderstorting.com \",\"src\":\"/mock/partners/partners-customer-cn-n3kfzQlr.png\",\"index\":10},{\"index\":11,\"link\":\"https://leeuwslots.com \",\"src\":\"/mock/partners/partners-customer-cn-zZmI3uNk.png\"},{\"link\":\"https://zamsino.com \",\"src\":\"/mock/partners/partners-customer-cn-XavdnCxF.png\",\"index\":12},{\"src\":\"/mock/partners/partners-customer-cn-uA9mNrTq.png\",\"index\":13,\"link\":\"https://nyukinfuyobonasu.com \"},{\"link\":\"https://zamsino-it.com \",\"src\":\"/mock/partners/partners-customer-cn-mseVswTE.png\",\"index\":14},{\"link\":\"https://bonussenzadeposito.org \",\"src\":\"/mock/partners/partners-customer-cn-7I4pvEU2.png\",\"index\":15},{\"link\":\"https://grazieslot.com/\",\"src\":\"/mock/partners/partners-customer-cn-hL16EfTs.png\",\"index\":16},{\"link\":\"https://iefreespins.com \",\"src\":\"/mock/partners/partners-customer-cn-oO2r3HEf.png\",\"index\":17},{\"link\":\"https://hareslots.com \",\"src\":\"/mock/partners/partners-customer-cn-mu8iY3FA.png\",\"index\":18},{\"link\":\"https://freespinsnodeposit.in \",\"src\":\"/mock/partners/partners-customer-cn-vt49PEzo.png\",\"index\":19},{\"link\":\"https://bengalslots.com \",\"src\":\"/mock/partners/partners-customer-cn-Gvg8SvQg.png\",\"index\":20},{\"link\":\"https://adlerslots.com \",\"src\":\"/mock/partners/partners-customer-cn-XIaBGF1f.png\",\"index\":21},{\"link\":\"https://nodepositboni.com \",\"src\":\"/mock/partners/partners-customer-cn-XfDzPxaJ.png\",\"index\":22},{\"link\":\"https://karhuslots.com \",\"src\":\"/mock/partners/partners-customer-cn-yTcvXDjP.png\",\"index\":23},{\"link\":\"https://bonusbezvkladu.com \",\"src\":\"/mock/partners/partners-customer-cn-IB84JaRP.png\",\"index\":24},{\"link\":\"https://cafreespins.com \",\"src\":\"/mock/partners/partners-customer-cn-5yRL5pcE.png\",\"index\":25},{\"src\":\"/mock/partners/partners-customer-cn-G21ZUf1p.png\",\"index\":26,\"link\":\"https://beaverslots.com \"},{\"link\":\"https://rodadasgratissemdeposito.com \",\"src\":\"/mock/partners/partners-customer-cn-GcEmXsKD.png\",\"index\":27},{\"link\":\"https://zamsino.com/br/bonus-de-cassino-sem-deposito/\",\"src\":\"/mock/partners/partners-customer-cn-glH7yUxT.png\",\"index\":28},{\"link\":\"https://crikeyslots.com \",\"src\":\"/mock/partners/partners-customer-cn-xDP2RAAj.png\",\"index\":29},{\"link\":\"https://krashchyybonus.com\",\"src\":\"/mock/partners/partners-customer-cn-t2UVlsdm.png\",\"index\":30},{\"link\":\"https://battrebonus.com\",\"src\":\"/mock/partners/partners-customer-cn-9ZuNKogv.png\",\"index\":31},{\"link\":\"https://bonosparatodos.com\",\"src\":\"/mock/partners/partners-customer-cn-2sjtbREf.png\",\"index\":32},{\"link\":\"https://beterebonus.com\",\"src\":\"/mock/partners/partners-customer-cn-oXuS7Y6T.png\",\"index\":33},{\"link\":\"https://betterbonus.com\",\"src\":\"/mock/partners/partners-customer-cn-nD0SXgfD.png\",\"index\":34},{\"link\":\"https://bonuspertutti.com\",\"src\":\"/mock/partners/partners-customer-cn-gaFo2Sef.png\",\"index\":35},{\"link\":\"https://jobbbonus.com\",\"src\":\"/mock/partners/partners-customer-cn-jQOEmaHp.png\",\"index\":36},{\"src\":\"/mock/partners/partners-customer-cn-DKCJOETB.png\",\"index\":37,\"link\":\"https://bessereboni.com\"},{\"link\":\"https://bonuspourtous.com\",\"src\":\"/mock/partners/partners-customer-cn-tRveBmWe.png\",\"index\":38},{\"link\":\"https://parempibonus.com\",\"src\":\"/mock/partners/partners-customer-cn-PgjFugUD.png\",\"index\":39},{\"link\":\"https://bedrebonus.com\",\"src\":\"/mock/partners/partners-customer-cn-yWsLdIzn.png\",\"index\":40},{\"link\":\"https://bonusparatodos.com\",\"src\":\"/mock/partners/partners-customer-cn-T3FO1Ybf.png\",\"index\":41},{\"link\":\"https://latestcasinobonuses.bet/\",\"src\":\"/mock/partners/partners-customer-cn-JJ6nZxa1.png\",\"index\":42},{\"link\":\"https://slotsrank.com/cq9-gaming/\",\"src\":\"/mock/partners/partners-customer-cn-rQ9Pv5JQ.png\",\"index\":43},{\"src\":\"/mock/partners/partners-customer-cn-cradrk40.png\",\"index\":44,\"link\":\"https://www.livebet.com/\"},{\"link\":\"https://casino.ru/cq9-gaming/\",\"src\":\"/mock/partners/partners-customer-cn-RkCyIJJC.png\",\"index\":45},{\"index\":46,\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-hWYzFk1a.png\"},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-eImHT034.png\",\"index\":47},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-THuOI5iZ.png\",\"index\":48},{\"index\":49,\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-VeRIRpTa.png\"},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-inG8UPpl.png\",\"index\":50},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-YoQJUAWc.png\",\"index\":51},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-xC67P2XP.png\",\"index\":52},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-VdMNU34t.png\",\"index\":53},{\"src\":\"/mock/partners/partners-customer-cn-9SO3X28v.png\",\"index\":54,\"link\":\"\"},{\"index\":55,\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-QSCAVYtz.png\"},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-LzNIrjnZ.png\",\"index\":56},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-OjpGThed.png\",\"index\":57},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-4CkGmVpy.png\",\"index\":58},{\"index\":59,\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-buwnfnEQ.png\"},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-1irxTlkg.png\",\"index\":60},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-vYpdidlf.png\",\"index\":61},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-0IKsHbIe.png\",\"index\":62},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-kNK0l2LH.png\",\"index\":63},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-lJavBuGQ.png\",\"index\":64},{\"index\":65,\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-FZ2RGW9e.png\"},{\"src\":\"/mock/partners/partners-customer-cn-IkwwFqKW.png\",\"index\":66,\"link\":\"\"},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-7PrM1l4d.png\",\"index\":67},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-qElNSdIC.png\",\"index\":68},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-liWfUQ8V.png\",\"index\":69},{\"index\":70,\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-QrwRUVXH.png\"},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-Crcko6bW.png\",\"index\":71},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-tC4GYH8w.png\",\"index\":72},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-XpZxskar.png\",\"index\":73},{\"src\":\"/mock/partners/partners-customer-cn-gsL2Osqt.png\",\"index\":74,\"link\":\"\"},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-Y4SpQe0P.png\",\"index\":75},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-1cCoFYQO.png\",\"index\":76},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-f85Tyy4O.png\",\"index\":77},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-PObZcRlw.png\",\"index\":78},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-FNrTv3uj.png\",\"index\":79},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-AlUZzs4B.png\",\"index\":80},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-gDvS2jLW.png\",\"index\":81},{\"link\":\"\",\"src\":\"/mock/partners/partners-customer-cn-AqN2BCqY.png\",\"index\":82}]}",
    "edited_by": "cqnine",
    "created_at": "2024-01-25T10:40:12-04:00",
    "updated_at": "2026-09-17T22:02:34-04:00"
  }
];

const mockEventList = [
  {
    "id": 83,
    "title": "iGB Live 2026",
    "sort": 0,
    "status": true
  },
  {
    "id": 76,
    "title": "ICE Barcelona 2026",
    "sort": 1,
    "status": true
  },
  {
    "id": 69,
    "title": "SBC Summit 2025",
    "sort": 2,
    "status": true
  },
  {
    "id": 62,
    "title": "iGB Live 2025",
    "sort": 3,
    "status": true
  },
  {
    "id": 59,
    "title": "ICE Barcelona 2025 ",
    "sort": 4,
    "status": true
  },
  {
    "id": 47,
    "title": "iGB Live 2024",
    "sort": 5,
    "status": true
  },
  {
    "id": 30,
    "title": "BiS SiGMA Américas 2024",
    "sort": 6,
    "status": true
  },
  {
    "id": 25,
    "title": "ICE London 2024",
    "sort": 7,
    "status": true
  },
  {
    "id": 9,
    "title": "iGB Live 2023",
    "sort": 8,
    "status": true
  },
  {
    "id": 10,
    "title": "ICE London 2023",
    "sort": 9,
    "status": true
  },
  {
    "id": 11,
    "title": "iGB Live 2022",
    "sort": 10,
    "status": true
  },
  {
    "id": 12,
    "title": "PAGE 2019",
    "sort": 11,
    "status": true
  }
];

const mockCategoryList = [
  { id: 46, name: "Brand News", status: true },
  { id: 47, name: "Games", status: true },
  { id: 48, name: "Awards", status: false },
  { id: 49, name: "Technology", status: true },
  { id: 50, name: "Asia News", status: true },
  { id: 51, name: "Industry News", status: true },
];

const mockAdminUserInfo = {
  id: 27,
  account: "steve",
  login_at: "",
  login_ip: "0.0.0.0",
  level: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  email: "",
  status: true,
};

const apidomains = (env = "", suffix = "", lang = "", id = "", unique = "") => {
  return `${env}/api/backend${suffix}${lang && `?lang=${lang}`}${
    id && `${lang ? `&` : `?`}id=${id}`
  }${unique && unique}`;
};

const apiGetRequestHeaderOption = (authorization = "") => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  return {
    method: "GET",
    headers: new Headers({
      "Content-Type": "text/json",
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    }),
  };
};

const apiPostRequestHeaderOption = (param = {}, authorization = "") => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  return {
    method: "POST",
    headers: new Headers({
      "Content-Type": "text/json",
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    }),
    body: JSON.stringify(param),
  };
};

const apiPutRequestHeaderOption = (param = {}, authorization = "") => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  return {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "text/json",
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    }),
    body: JSON.stringify(param),
  };
};

const apiDeleteRequestHeaderOption = (param = {}, authorization = "") => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  return {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "text/json",
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    }),
    body: JSON.stringify(param),
  };
};

// common manners
export const apiUpdateAction = ({
  type = "fetch",
  promise = new Promise(),
  success = noop,
  unsuccessfully = noop,
}) => {
  return promise
    .then((response) => {
      return type === "fetch" ? response.json() : getData(response, ["data"]);
    })
    .then((response) => {
      const error_msg = getData(response, ["error_msg"]);
      if (error_msg !== "SUCCESS") {
        console.error(`<ERROR ${error_msg}>`);
        const confrim = confirm(error_msg);
        if (confrim || !confrim) {
          unsuccessfully();
        }
      } else {
        success(response);
      }
    })
    .catch((error) => {
      console.error(`<ERROR ${error}>`);
      const confrim = confirm(error);
      if (confrim || !confrim) {
        unsuccessfully();
      }
    });
};

// post
export const apiPostLogin = (param = { account: "", pwd: "" }) => {
  // return fetch(
  //   apidomains(envHost(), "/login"),
  //   apiPostRequestHeaderOption(param),
  // );
  return mockFetchResponse("local-preview-token");
};

export const apiPostAccountRegister = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/admin/register"),
    apiPostRequestHeaderOption(param, authorization),
  );
};

export const apiPostServiceCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/service/create"),
    apiPostRequestHeaderOption(param, authorization),
  );
};

export const apiPostCategoryCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/category/create"),
    apiPostRequestHeaderOption(param, authorization),
  );
};

export const apiPostTopnewsCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/create"),
    apiPostRequestHeaderOption(param, authorization),
  );
};

export const apiPostNewsCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/news/create"),
    apiPostRequestHeaderOption(param, authorization),
  );
};

export const apiPostEventCreate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/event/create"),
    apiPostRequestHeaderOption(param, authorization),
  );
};

export const apiPostContactUsReply = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/contactus/reply"),
    apiPostRequestHeaderOption(param, authorization),
  );
};

export const apiPostMediaUpload = (
  formData = new FormData(),
  authorization = "",
  type = "img",
  setDataOnProgress = noop,
) => {
  const localAuthorization = localStorage.getItem("authorization") || "";
  const config = {
    headers: {
      Authorization: `Bearer ${
        authorization ? authorization : localAuthorization
      }`,
    },
    onUploadProgress: (progressEvent) => {
      if (type === "video") {
        setDataOnProgress(
          Math.ceil((progressEvent.loaded / progressEvent.total) * 100),
        );
      }
    },
  };
  return axios.post(apidomains(envHost(), "/upload/"), formData, config);
};

// put
export const apiPutEditAdmin = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/admin/edit_admin"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutHomePageUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/homepage/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutHeaderUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/header/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutAboutUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/about/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutServiceSort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/service/sort"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutContactusUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/contactus/set_update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutServiceUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/service/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutPartnersList = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/partners/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutCategorySort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/category/sort"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutCategoryUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/category/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutTopnewsSort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/sort"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutTopnewsUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutNewsSort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/news/sort"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutNewsUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/news/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutEventSort = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/event/sort"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

export const apiPutEventUpdate = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/event/update"),
    apiPutRequestHeaderOption(param, authorization),
  );
};

// delete
export const apiDeleteAdminUser = (id = "", authorization = "") => {
  return fetch(
    apidomains(envHost(), `/admin/delete_admin/${id}`),
    apiDeleteRequestHeaderOption({}, authorization),
  );
};

export const apiDeleteServiceData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/service/delete"),
    apiDeleteRequestHeaderOption(param, authorization),
  );
};

export const apiDeleteCategoryData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/category/delete"),
    apiDeleteRequestHeaderOption(param, authorization),
  );
};

export const apiDeleteTopnewsData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/ad_popup/delete"),
    apiDeleteRequestHeaderOption(param, authorization),
  );
};

export const apiDeleteNewsData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/news/delete"),
    apiDeleteRequestHeaderOption(param, authorization),
  );
};

export const apiDeleteEventData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/event/delete"),
    apiDeleteRequestHeaderOption(param, authorization),
  );
};

export const apiDeleteContactUsData = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), "/contactus/delete"),
    apiDeleteRequestHeaderOption(param, authorization),
  );
};

export const apiDeleteImage = (param = {}, authorization = "") => {
  return fetch(
    apidomains(envHost(), `/image/delete`),
    apiDeleteRequestHeaderOption(param, authorization),
  );
};

// get
export const apiGetCounterVisit = (authorization = "", lang = "cn") => {
  // export const apiGetCounterVisit = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/counter_visit", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({ today: 0, total: 0 });
};

export const apiGetAdminUserInfo = (authorization = "") => {
  // export const apiGetAdminUserInfo = (authorization = "") => {
  //   return fetch(
  //     apidomains(envHost(), "/admin/user_info"),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockAdminUserInfo);
};

export const apiGetAdminList = (authorization = "") => {
  // export const apiGetAdminList = (authorization = "") => {
  //   return fetch(
  //     apidomains(envHost(), "/admin/list"),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockList);
};

export const apiGetHeaderList = (authorization = "", lang = "cn") => {
  // export const apiGetHeaderList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/header/header_list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetHomePageList = (authorization = "", lang = "cn") => {
  // export const apiGetHomePageList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/homepage/list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetAboutList = (authorization = "", lang = "cn") => {
  // export const apiGetAboutList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/about/list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetServiceList = (authorization = "", lang = "cn") => {
  // export const apiGetServiceList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/service/service_list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockList);
};

export const apiGetServiceDetail = (authorization = "", lang = "", id = 0) => {
  // export const apiGetServiceDetail = (authorization = "", lang = "", id = 0) => {
  //   return fetch(
  //     apidomains(envHost(), "/service/service_detail", "", id),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetContactusList = (authorization = "", lang = "cn") => {
  // export const apiGetContactusList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/contactus/set_list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetContactusMailList = (authorization = "", lang = "cn") => {
  // export const apiGetContactusMailList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/contactus/list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockList);
};

export const apiGetContactusMailDetail = (
  authorization = "",
  lang = "cn",
  id = "",
) => {
  // export const apiGetContactusMailDetail = (
  //   authorization = "",
  //   lang = "cn",
  //   id = "",
  // ) => {
  //   return fetch(
  //     apidomains(envHost(), "/contactus/detail", lang, id),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetPartnersList = (authorization = "", lang = "cn") => {
  // export const apiGetPartnersList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/partners/list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockPartnersList);
};

export const apiGetCategory = (authorization = "", lang = "cn") => {
  // export const apiGetCategory = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/category/category_list", lang, "", `&class=news`),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockCategoryList);
};

export const apiGetTopNewsList = (authorization = "", lang = "cn") => {
  // export const apiGetTopNewsList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/ad_popup/list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockList);
};

export const apiGetEventList = (authorization = "", lang = "cn") => {
  // export const apiGetEventList = (authorization = "", lang = "cn") => {
  //   return fetch(
  //     apidomains(envHost(), "/event/event_list", lang),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockEventList);
};

export const apiGetTopNewsDetail = (
  authorization = "",
  lang = "cn",
  id = 0,
) => {
  // export const apiGetTopNewsDetail = (
  //   authorization = "",
  //   lang = "cn",
  //   id = 0,
  // ) => {
  //   return fetch(
  //     apidomains(envHost(), "/ad_popup/detail", lang, id),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetEventDetail = (authorization = "", lang = "cn", id = 0) => {
  // export const apiGetEventDetail = (authorization = "", lang = "cn", id = 0) => {
  //   return fetch(
  //     apidomains(envHost(), "/event/event_detail", lang, id),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetNewsList = (
  authorization = "",
  lang = "cn",
  unique = "",
) => {
  // export const apiGetNewsList = (
  //   authorization = "",
  //   lang = "cn",
  //   unique = "",
  // ) => {
  //   return fetch(
  //     apidomains(envHost(), "/news/news_list", lang, "", unique),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockNewsList);
};

export const apiGetNewsDetail = (
  authorization = "",
  lang = "cn",
  unique = 0,
) => {
  // export const apiGetNewsDetail = (
  //   authorization = "",
  //   lang = "cn",
  //   unique = 0,
  // ) => {
  //   return fetch(
  //     apidomains(envHost(), "/news/news_detail", lang, "", unique),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse({});
};

export const apiGetImageList = (
  authorization = "",
  lang = "cn",
  unique = "",
) => {
  // export const apiGetImageList = (
  //   authorization = "",
  //   lang = "cn",
  //   unique = "",
  // ) => {
  //   return fetch(
  //     apidomains(envHost(), "/image/list", lang, "", unique),
  //     apiGetRequestHeaderOption(authorization),
  //   );
  // };
  return mockFetchResponse(mockList);
};

export const FetchGetHook = ({
  defaultDataType = "",
  lang = "",
  query = "",
  pushPath = "/login",
  promise = new Promise(),
  isUserInfo = false,
  resquestStoppen = false,
  success = noop,
  unsuccessfully = noop,
}) => {
  const authorization = useSelector((state) => state.props.authorization);
  const router = useRouter();
  const [isMutate, setIsMutate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(defaultDataType);
  useEffect(() => {
    if (isMutate || resquestStoppen) {
      return;
    }
    setIsLoading(true);
    promise(authorization, lang, query)
      .then((response) => response.json())
      .then((data) => {
        const error_msg = getData(data, ["error_msg"]);
        if (error_msg !== "SUCCESS") {
          storageItemRemove(["authorization"]);
          console.error(`<ERROR ${error_msg}>`);
          if (!isUserInfo) {
            const confrim = confirm(
              error_msg === "Undefined Error (SESSION_NOT_EXIST)"
                ? "登入驗證已失效，請嘗試重新登入"
                : error_msg,
            );
            if (confrim || !confrim) {
              setIsLoading(false);
              unsuccessfully();
              router.push(pushPath);
            }
          } else {
            // isUserInfo
            setIsLoading(false);
            unsuccessfully();
          }
        } else {
          setIsLoading(false);
          setData(getData(data, ["result"], defaultDataType));
          success(getData(data, ["result"], defaultDataType));
        }
      })
      .catch((error) => {
        storageItemRemove(["authorization"]);
        console.error(`<ERROR ${error}>`);
        const confrim = confirm(error);
        if (confrim || !confrim) {
          setIsLoading(false);
          unsuccessfully();
          router.push(pushPath);
        }
      });
  }, [isMutate, resquestStoppen, lang]);
  useEffect(() => {
    setIsMutate(false);
  }, [isMutate]);
  return {
    isLoading,
    data,
    mutate: () => setIsMutate(true),
  };
};

export const FetchGetCustomHook = ({
  defaultDataType = "",
  lang = "",
  pushPath = "/login",
  promise = new Promise(),
  resquestStoppen = true,
  // params
  categoryId = "",
  success = noop,
  unsuccessfully = noop,
}) => {
  const authorization = useSelector((state) => state.props.authorization);
  const router = useRouter();
  const [isMutate, setIsMutate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(defaultDataType);
  useEffect(() => {
    if (isMutate || resquestStoppen) {
      return;
    }
    setIsLoading(true);
    promise(authorization, lang, `&category_id=${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        const error_msg = getData(data, ["error_msg"]);
        if (error_msg !== "SUCCESS") {
          storageItemRemove(["authorization"]);
          console.error(`<ERROR ${error_msg}>`);
          const confrim = confirm(error_msg);
          if (confrim || !confrim) {
            setIsLoading(false);
            unsuccessfully();
            router.push(pushPath);
          }
        } else {
          setIsLoading(false);
          setData(getData(data, ["result"], defaultDataType));
          success(getData(data, ["result"], defaultDataType));
        }
      })
      .catch((error) => {
        storageItemRemove(["authorization"]);
        console.error(`<ERROR ${error}>`);
        const confrim = confirm(error);
        if (confrim || !confrim) {
          setIsLoading(false);
          unsuccessfully();
          router.push(pushPath);
        }
      });
  }, [isMutate, resquestStoppen, lang, categoryId]);
  useEffect(() => {
    setIsMutate(false);
  }, [isMutate]);
  return {
    isLoading,
    data,
    mutate: () => setIsMutate(true),
  };
};
