> [!IMPORTANT]
> Im still updating this.

# 🗣 Chat Application

_Relying primarily on WebSockets, JWT for auth and Postgresql as my DB._

There's nothing to add since it's just a Real Time Chat on your browser, you can upload photos, talk and create/join rooms.

![image of one of the chats](wireframes/preview.png)

- 👎 **Downsides**:

  - Loads all images immediately after login making the **Interaction to Next Paint (INP)** be huge
  - There's some UI bugs with **Firefox engine (Gecko)**
  - Project structure is just a mess and it gets worse and worse
  - If there's a ton of messages in a room, it will take a notable time to load in
  - **And probably a lot of minor bugs that require time to fix**.

- ⌛ **Pending Fixes/Features**:
  - [See all users in the room](https://github.com/shadcn-ui/ui/issues/1011#issuecomment-1930103090)
  - Optimize server logic and prevent more react updates
  - Finish roles & grant permissions (Admin, User & Moderator)
  - Cache react renders...? (useMemo or simply activate the compiler)

#### What went wrong:

I learnt a ton with this project, but at this point it's just tiring & frustrating to continue because of my:

- **horrible project structure** (im trying to improve that)
- **bad decision making** (caused by not knowing what i wanted)
- **the feeling of getting stuck** (i can't continue other projects cuz of this)
- and **lack of knowledge** which thats the main reason i made this in the first place.

## ℹ **Install guide:**

> [!CAUTION]
> I don't recommend this project for learning or use it in real life scenarios since it wasn't tested properly and could have potential security risks.

## 📚 **What i've used:**

- General

  - TypeScript

- Server

  - NestJS
  - TypeORM
  - Socket.io (@nestjs/websockets & @nestjs/platform-socket.io)
  - Postgresql

- Client
  - NextJS
  - Radix UI
  - Tailwind CSS

## Commits information

- 🔰 **Initial commit** = :beginner:
- **Updates:**
  - 🚀 Big update = :rocket:
  - 💥 Medium update = :boom:
  - ⭐ Small update = :star:
  - 🔨 Bug fix = :hammer:
- **Extras:**
  - 💻 Added new technology = :computer:
  - 🌈 UI Update = :rainbow:
