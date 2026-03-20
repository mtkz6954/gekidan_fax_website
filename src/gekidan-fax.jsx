export default function GekidanFAXHomepage() {
  const mobileNav = [
    { label: "公演", href: "#next", icon: "🎭" },
    { label: "劇団", href: "#about", icon: "📖" },
    { label: "活動", href: "#activity", icon: "✨" },
    { label: "人", href: "#members", icon: "👤" },
    { label: "知らせ", href: "#news", icon: "📢" },
  ];

  const news = [
    {
      date: "2026.03.12",
      title: "次回公演『キルギスのやつ』情報を公開しました",
      body: "7月17日〜19日、神奈川県立青少年センタースタジオHIKARIにて上演します。",
    },
    {
      date: "2026.02.20",
      title: "劇団紹介ページを更新しました",
      body: "主催・玉井秀和の紹介を中心に、劇団FAXの情報を整理しました。",
    },
    {
      date: "2026.01.28",
      title: "チケット情報掲載のお知らせ",
      body: "前売り2,000円、当日3,000円でご案内しています。",
    },
  ];

  const card =
    "rounded-3xl border border-sky-100 bg-white shadow-sm shadow-slate-200/60 transition-shadow duration-300 hover:shadow-md hover:shadow-slate-200/80";
  const sectionTitle = "text-2xl md:text-3xl font-black tracking-tight text-slate-900";
  const sectionLead = "mt-3 text-slate-500 leading-7 text-sm md:text-base";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fcff_0%,#ffffff_20%,#fffaf3_100%)] text-slate-800 scroll-smooth">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-sky-100/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <a href="#" className="flex items-center gap-3 md:gap-4 group">
            <div className="flex h-12 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black tracking-[0.18em] text-slate-900 transition-colors group-hover:border-sky-300 group-hover:text-sky-600 md:h-14 md:w-20">
              FAX
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-500 md:text-xs">
                Theater Company
              </div>
              <div className="text-lg font-black text-slate-900 md:text-xl">劇団FAX</div>
            </div>
          </a>
          <nav className="hidden gap-7 text-sm font-bold text-slate-600 md:flex">
            <a href="#next" className="transition-colors hover:text-sky-600">次回公演</a>
            <a href="#about" className="transition-colors hover:text-sky-600">劇団について</a>
            <a href="#activity" className="transition-colors hover:text-sky-600">活動内容</a>
            <a href="#members" className="transition-colors hover:text-sky-600">メンバー</a>
            <a href="#news" className="transition-colors hover:text-sky-600">お知らせ</a>
          </nav>
          <a
            href="https://example.com/ticket"
            className="hidden rounded-full bg-orange-400 px-5 py-2.5 text-xs font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-md md:inline-flex"
          >
            チケット購入
          </a>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        {/* ── Hero ── */}
        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 pt-8 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:px-8 md:pb-20 md:pt-16">
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 md:mb-4 md:px-4 md:text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
              次回公演情報
            </div>
            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
              劇団FAX 公演
              <span className="mt-1 block text-sky-600">『キルギスのやつ』</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:mt-6 md:text-base md:leading-8">
              キルギス共和国を題材にした、演劇をつかった多文化・多分野交流イベント。
              多様な背景を持つ人々が緩やかに出会い、つながることを目指しています。
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-700 md:mt-6 md:gap-3 md:text-sm">
              <span className="rounded-full border border-sky-100 bg-sky-50/60 px-3 py-2">7/17 19:00</span>
              <span className="rounded-full border border-sky-100 bg-sky-50/60 px-3 py-2">7/18 12:00・19:00</span>
              <span className="rounded-full border border-sky-100 bg-sky-50/60 px-3 py-2">7/19 12:00</span>
              <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-2 text-orange-700">
                前売 2,000円 / 当日 3,000円
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
              <a
                href="https://example.com/ticket"
                className="rounded-full bg-orange-400 px-6 py-3 text-sm font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-md"
              >
                チケットを購入する
              </a>
              <a
                href="#about"
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition-colors hover:border-sky-200 hover:text-sky-700"
              >
                劇団について
              </a>
            </div>
          </div>

          {/* 公演カード */}
          <div className={`${card} overflow-hidden md:ml-auto`}>
            <div className="bg-gradient-to-br from-sky-50 via-white to-orange-50/60 p-5 md:p-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-black text-white">NEXT STAGE</span>
              </div>
              <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="text-sm font-black text-orange-500">次回公演</div>
                <div className="mt-2 text-xl font-black text-slate-900 md:text-2xl">キルギスのやつ</div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex gap-2">
                    <span className="shrink-0 text-sky-400">📅</span>
                    7/17 19:00 / 7/18 12:00・19:00 / 7/19 12:00
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-sky-400">📍</span>
                    神奈川県立青少年センタースタジオHIKARI
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-sky-400">🎫</span>
                    前売り 2,000円 / 当日 3,000円
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://example.com/ticket"
                    className="inline-flex items-center justify-center rounded-full bg-orange-400 px-5 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-orange-500"
                  >
                    チケット購入
                  </a>
                  <a
                    href="#next"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700 transition-colors hover:border-sky-200 hover:text-sky-600"
                  >
                    詳細を見る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 公演詳細 ── */}
        <section id="next" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
          <div className="mb-6">
            <h2 className={sectionTitle}>次回公演情報</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <article className={`${card} p-7`}>
              <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-600">
                マグカルシアター公募事業
              </div>
              <h3 className="mt-3 text-3xl font-black text-slate-900">キルギスのやつ</h3>
              <p className="mt-4 leading-8 text-slate-600">
                今回の企画は、神奈川県のマグカルシアターという公募事業として実施する、キルギス共和国を題材にした、演劇をつかった多文化・多分野交流イベントです。ストイックに舞台作品だけを作り上げる事を目指すのではなくて、多様な背景を持つ人々が緩やかに出会い、つながることを目指しています。
              </p>
              <div className="mt-6 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                <div className="rounded-2xl bg-sky-50/70 p-4">
                  <div className="text-xs font-bold text-sky-500 uppercase tracking-wider">日程</div>
                  <div className="mt-2 font-bold text-slate-900">
                    7/17 19:00
                    <br />
                    7/18 12:00・19:00
                    <br />
                    7/19 12:00
                  </div>
                </div>
                <div className="rounded-2xl bg-sky-50/70 p-4">
                  <div className="text-xs font-bold text-sky-500 uppercase tracking-wider">会場</div>
                  <div className="mt-2 font-bold text-slate-900">
                    神奈川県立青少年センター
                    <br />
                    スタジオHIKARI
                  </div>
                </div>
                <div className="rounded-2xl bg-orange-50/70 p-4">
                  <div className="text-xs font-bold text-orange-500 uppercase tracking-wider">チケット</div>
                  <div className="mt-2 font-bold text-slate-900">
                    前売り 2,000円
                    <br />
                    当日 3,000円
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href="https://example.com/ticket"
                  className="inline-flex items-center justify-center rounded-full bg-orange-400 px-6 py-3 text-sm font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-md"
                >
                  チケットを購入する →
                </a>
              </div>
            </article>

            <article className={`${card} p-7`}>
              <div className="text-sm font-black text-orange-500">会場アクセス</div>
              <div className="mt-3 rounded-[24px] bg-gradient-to-br from-sky-50 via-white to-orange-50/40 p-6">
                <h4 className="text-lg font-black text-slate-900">
                  神奈川県立青少年センター
                  <br />
                  スタジオHIKARI
                </h4>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  <p>〒220-0044 神奈川県横浜市西区紅葉ケ丘9-1</p>
                  <p>JR「桜木町駅」より徒歩8分</p>
                  <p>みなとみらい線「日本大通り駅」より徒歩10分</p>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-center text-xs font-bold text-slate-500">
                  Google Map（公開時に埋め込み予定）
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── 劇団紹介 ── */}
        <section id="about" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
          <div className="mb-6">
            <h2 className={sectionTitle}>劇団FAXとは</h2>
            <p className={sectionLead}>2016年、京都にて旗揚げ。公演ごとに異なる顔を見せる新時代演劇集団。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`${card} p-6 md:col-span-2`}>
              <p className="leading-8 text-slate-600">
                主催・玉井秀和が2016年に京都で旗揚げした演劇集団。
              </p>
              <p className="mt-3 leading-8 text-slate-600">
                公演によって脚本の担当が異なるためその作品スタイルは、見世物小屋風からエンタメ会話劇まで多岐に渡るが、主に脚本を担当するのは主催の玉井と、脚本の高矢。
              </p>
              <p className="mt-3 leading-8 text-slate-600">
                民俗/寓話的に夢と現を行き来する少年少女の物語が特徴の玉井脚本。緻密な会話に引き込まれ次が気になるサスペンスをベースに、スリルと笑いが交錯する長編作品を得意とする高矢脚本。
              </p>
              <p className="mt-3 leading-8 text-slate-700 font-medium">
                公演によってメンバーの様々な顔が楽しめる新時代演劇集団。
              </p>
            </div>

            <div className={`${card} p-6 md:col-span-2`}>
              <h3 className="text-xl font-black text-slate-900">受賞歴・経歴</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-sky-50/60 p-5">
                  <div className="text-sm font-black text-sky-600">玉井秀和</div>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                    <li>2025　BIPAM・KEX「shifting point」選出アーティスト</li>
                    <li>2025　日本演出者協会「日本の戯曲研修セミナーin大阪2025」登壇</li>
                    <li>2020　「如月小春プロジェクト2020」登壇パネラー</li>
                    <li>2020　『まばたき』京都学生演劇祭【E9賞】受賞</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-orange-50/60 p-5">
                  <div className="text-sm font-black text-orange-500">高矢航志</div>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                    <li>2023　『追想せる住人』関西演劇祭【脚本賞】受賞</li>
                    <li>2021　第40回シナリオS1グランプリ佳作受賞</li>
                    <li>2021　第46回創作テレビドラマ大賞ファイナリスト</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 活動内容 ── */}
        <section id="activity" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
          <div className="mb-6">
            <h2 className={sectionTitle}>活動内容</h2>
            <p className={sectionLead}>舞台公演にとどまらない、演劇を通じた交流と創造の場。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className={`${card} p-6 group`}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl transition-transform group-hover:scale-110">
                🌍
              </div>
              <h3 className="text-lg font-black text-slate-900">多文化交流</h3>
              <p className="mt-3 leading-7 text-slate-600">
                キルギス共和国を題材に、異なる背景を持つ人々が緩やかに出会える場をつくる企画です。
              </p>
            </div>
            <div className={`${card} p-6 group`}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-xl transition-transform group-hover:scale-110">
                🎭
              </div>
              <h3 className="text-lg font-black text-slate-900">演劇を使った企画</h3>
              <p className="mt-3 leading-7 text-slate-600">
                作品上演に閉じず、演劇という手法を通じて交流そのものをデザインする取り組みです。
              </p>
            </div>
            <div className={`${card} p-6 group`}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl transition-transform group-hover:scale-110">
                🏛️
              </div>
              <h3 className="text-lg font-black text-slate-900">マグカルシアター事業</h3>
              <p className="mt-3 leading-7 text-slate-600">
                神奈川県の公募事業として実施。行政との連携のもとで活動しています。
              </p>
            </div>
          </div>
        </section>

        {/* ── メンバー ── */}
        <section id="members" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
          <div className="mb-6">
            <h2 className={sectionTitle}>メンバー</h2>
          </div>
          <div className="max-w-2xl">
            <article className={`${card} p-6 md:p-8`}>
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-orange-50 text-2xl">
                  👤
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-orange-500">主催</div>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">玉井秀和</h3>
                  <p className="mt-1 text-sm text-slate-500">Hidekazu Tamai</p>
                </div>
              </div>
              <p className="mt-5 leading-8 text-slate-600">
                1994年東京生まれ。私立武蔵高等学校を卒業後、京都大学法学部に入学。大学入学と同時に京都大学公認サークル劇団ケッペキにて演劇活動を始める。主に演出を行うが、演出というよりはチームマネジメントに興味がありグループ作りに勤しんでいる。大学3年の時に、自らの団体、劇団FAXをたちあげ年間4-6本の公演をプロデュースしている。フリーランスの舞台監督としても活動中。
              </p>
            </article>
          </div>
        </section>

        {/* ── チケット ── */}
        <section id="ticket" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
          <div className="rounded-[32px] bg-gradient-to-r from-orange-400 to-orange-500 p-8 text-white shadow-lg shadow-orange-100 md:p-12">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black md:text-3xl">チケット購入</h2>
                <p className="mt-2 text-orange-100 text-sm md:text-base">
                  『キルギスのやつ』前売り 2,000円 / 当日 3,000円
                </p>
              </div>
              <a
                href="https://example.com/ticket"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-black text-orange-500 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                チケット購入フォームへ →
              </a>
            </div>
          </div>
        </section>

        {/* ── お知らせ ── */}
        <section id="news" className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
          <div className="mb-6">
            <h2 className={sectionTitle}>お知らせ</h2>
          </div>
          <div className="space-y-3">
            {news.map((item) => (
              <article
                key={item.title}
                className="group flex items-start gap-4 rounded-2xl border border-sky-50 bg-white p-5 transition-all hover:border-sky-100 hover:shadow-sm md:p-6"
              >
                <div className="shrink-0 rounded-xl bg-sky-50 px-3 py-2 text-center">
                  <div className="text-xs font-black text-sky-600">{item.date.split(".")[0]}</div>
                  <div className="text-lg font-black text-slate-900">
                    {item.date.split(".")[1]}.{item.date.split(".")[2]}
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-slate-900 md:text-lg">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── お問い合わせ ── */}
        <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
          <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] bg-sky-500 p-8 text-white shadow-lg shadow-sky-100 md:p-10">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-sky-200">Contact</div>
              <h2 className="mt-3 text-2xl font-black md:text-3xl">お問い合わせ</h2>
              <p className="mt-4 max-w-xl leading-8 text-sky-50">
                出演に関するご相談、公演の詳細、取材のご依頼など、お気軽にお問い合わせください。
              </p>
              <div className="mt-6 space-y-3">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-bold backdrop-blur-sm">
                  ✉️ メールアドレス（公開時に掲載）
                </div>
              </div>
            </div>
            <div className={`${card} p-8`}>
              <div className="text-sm font-black text-orange-500">ご来場前の確認</div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <div className="flex gap-3 items-start">
                  <span className="shrink-0 mt-0.5">📍</span>
                  <span>神奈川県立青少年センタースタジオHIKARI</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="shrink-0 mt-0.5">📅</span>
                  <span>7/17 19:00 / 7/18 12:00・19:00 / 7/19 12:00</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="shrink-0 mt-0.5">🎫</span>
                  <span>前売り 2,000円 / 当日 3,000円</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="shrink-0 mt-0.5">🚃</span>
                  <span>JR桜木町駅より徒歩8分</span>
                </div>
              </div>
              <div className="mt-5">
                <a
                  href="https://example.com/ticket"
                  className="inline-flex rounded-full bg-orange-400 px-5 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-orange-500"
                >
                  チケット購入
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-sky-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-14 items-center justify-center rounded-xl border border-slate-200 text-xs font-black tracking-[0.18em] text-slate-900">
                  FAX
                </div>
                <div className="text-lg font-black text-slate-900">劇団FAX</div>
              </div>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                2016年京都にて旗揚げ。公演ごとに異なる顔を見せる新時代演劇集団。
              </p>
            </div>
            <div className="flex gap-10 text-sm">
              <div>
                <div className="font-black text-slate-900">サイトマップ</div>
                <div className="mt-3 space-y-2 text-slate-500">
                  <a href="#next" className="block hover:text-sky-600 transition-colors">次回公演</a>
                  <a href="#about" className="block hover:text-sky-600 transition-colors">劇団について</a>
                  <a href="#activity" className="block hover:text-sky-600 transition-colors">活動内容</a>
                  <a href="#members" className="block hover:text-sky-600 transition-colors">メンバー</a>
                  <a href="#news" className="block hover:text-sky-600 transition-colors">お知らせ</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
            © 2026 劇団FAX. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── Mobile Nav ── */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-sky-100 bg-white/95 px-2 py-2 backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileNav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-bold text-slate-500 transition-colors active:bg-sky-50 active:text-sky-700"
            >
              <span className="mb-1 text-base">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
