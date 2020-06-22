import React from 'react';

import './Messenger.scss';
import SearchTop from '../../components/MessengerPage/SearchTop/SearchTop';
import ChatData from '../../components/MessengerPage/ChatData/ChatData';
import ChatList from '../../components/MessengerPage/ChatList/ChatList';

//! TODO: Remove following data in deploy
const dummyData = [
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  },
  {
    photo: 'https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg',
    name: 'Eternal Eagle',
    lastPhoto:
      'https://i.mycdn.me/image?id=870730950837&ts=00000000200020023e&plc=API&aid=1251240704&tkn=*wu2NzgKVj1ilrFyv4XXQcFKiTws&fn=sqr_32',
    lastMessage: 'Привет',
    lastTime: '19:30',
    count: 5
  }
];

const Messenger = () => {
  return (
    <div className="messenger">
      <SearchTop />
      <ChatData
        contact="Eternal Eagle"
        imageUrl="https://i.simpalsmedia.com/forum.md/avatars/200x200/7a2a3285220f8881c3055d28873dd58f.jpg"
        suplimentData="123456"
      />
      <ChatList chats={dummyData} />
      {/*
    
    <Chat />
    <SendMessage /> */}
    </div>
  );
};

export default Messenger;
