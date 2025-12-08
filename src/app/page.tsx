import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { FeedPreview } from "@/components/feed";
import { getNewsPosts } from "@/lib/actions/news";
import {
  BookOpen,
  Target,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  PlayCircle,
  BarChart2,
  Rocket,
  MousePointerClick,
  MessageSquare,
} from "lucide-react";

const featureHighlights = [
  {
    icon: Target,
    title: "업무 결과에 직결",
    description:
      "“보고서 초안 5분”, “엑셀 반복작업 0회”처럼 즉시 체감할 변화에 맞춘 커리큘럼",
  },
  {
    icon: BookOpen,
    title: "실습 퍼스트",
    description: "이론보다 클릭과 입력 위주로 구성된 워크플로우 튜토리얼",
  },
  {
    icon: ShieldCheck,
    title: "보안·정책 가이드",
    description:
      "회사 정책을 고려한 안전한 프롬프트 예시와 데이터 취급 가이드를 함께 제공합니다",
  },
];

const stats = [
  { label: "체험 후 업무 자동화 성공", value: "78%" },
  { label: "1주 내 재방문 비율", value: "64%" },
  { label: "평균 만족도", value: "4.7/5" },
];

const samples = [
  {
    title: "샌드박스 빠른 체험",
    description: "미리 준비된 프롬프트로 30초 만에 AI 응답을 확인하세요.",
    cta: "샌드박스 열기",
    href: "/sandbox",
    icon: PlayCircle,
  },
  {
    title: "업무 자동화 코스 미리보기",
    description: "“반복 보고서 1시간 단축하기” 레슨 일부를 무료로 열람합니다.",
    cta: "코스 둘러보기",
    href: "/courses",
    icon: Rocket,
  },
  {
    title: "바로 써보는 프롬프트 5개",
    description:
      "메일 요약, 회의록 정리, 엑셀 변환 등 바로 복사해 쓸 수 있는 템플릿.",
    cta: "프롬프트 보기",
    href: "/sandbox",
    icon: Lightbulb,
  },
];

const howItWorks = [
  {
    icon: Sparkles,
    title: "샘플 프롬프트 체험",
    description: "샌드박스에서 준비된 질문을 클릭해 바로 답변을 확인합니다.",
  },
  {
    icon: MousePointerClick,
    title: "업무별 미션 수행",
    description:
      "레슨마다 “보고서 초안”, “자동화 스크립트” 등 결과물을 완성합니다.",
  },
  {
    icon: BarChart2,
    title: "성과 확인 & 확장",
    description:
      "실제 업무에 적용 후 시간을 얼마나 줄였는지 기록하고 공유합니다.",
  },
];

export default async function Home() {
  // 최신 피드 5개 가져오기
  const { posts: latestFeed } = await getNewsPosts({ limit: 5 })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--primary)_15%,transparent),transparent_35%),radial-gradient(circle_at_80%_0%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_25%),radial-gradient(circle_at_50%_100%,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_35%)]" />
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                클릭 몇 번으로 끝내는 업무용 AI 학습
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="block">
                  보고서 초안 <span className="text-primary">5분 완성</span>
                </span>
                <span className="block">
                  실습으로 끝내는<br></br>AI Campus
                </span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                코딩 없이 바로 써먹는 실습 미션, 샌드박스 체험, 업무 자동화
                템플릿까지. 첫 5분 안에 AI가 내 일에 도움 된다는 확신을
                드립니다.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/login?next=/sandbox">
                  <Button size="xl">무료 체험 시작</Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" size="xl">
                    코스 둘러보기
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
                <div className="relative space-y-4 p-6">
                  <div className="flex items-center gap-3 rounded-2xl bg-background p-4 shadow-sm ring-1 ring-border/60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        보고서 초안 생성
                      </p>
                      <p className="text-xs text-muted-foreground">
                        "어제 회의록을 요약해 기획안으로 만들어줘"
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-background p-5 shadow-sm ring-1 ring-border/60">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      샌드박스 체험 중
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed text-foreground">
                      <p className="rounded-xl bg-muted p-3">
                        ✅ 엑셀 데이터 200행 → 요약 보고서 1페이지
                      </p>
                      <p className="rounded-xl bg-primary/10 p-3">
                        ⚡ 반복 작업을 매크로로 변환해 자동화 스크립트를
                        생성했습니다. 1시간 걸리던 작업이 8분으로 단축됩니다.
                      </p>
                      <p className="rounded-xl bg-muted p-3">
                        💡 더 개선할까요? "보고서 톤을 임원 보고용으로
                        변경"이라고 요청해보세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-y bg-muted/30 py-14 lg:py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 text-center lg:text-left">
              <p className="text-sm font-semibold text-primary">
                데이터로 확인하는 효용
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">
                체험 후 바로 적용되는 AI 학습
              </h2>
              <p className="text-muted-foreground">
                단순한 “시연”이 아니라, 실제 업무 시간을 줄인 사용자들의 결과를
                수집해 반영하고 있습니다.
              </p>
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-card p-5 text-center shadow-sm ring-1 ring-border/70"
                >
                  <p className="text-3xl font-extrabold text-primary">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold text-primary">
                왜 AI Campus인가요?
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">
                업무에 바로 맞춘 실습 경험
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featureHighlights.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Samples / Previews */}
        <section className="border-y bg-muted/30 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-10 flex flex-col gap-4 text-center">
              <p className="text-sm font-semibold text-primary">
                스크롤 없이 바로 체험
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">
                미리보기와 샌드박스 맛보기
              </h2>
              <p className="text-muted-foreground">
                준비된 프롬프트와 코스 일부를 먼저 열어 결과물을 확인해 보세요.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {samples.map((sample) => (
                <div
                  key={sample.title}
                  className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/70 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <sample.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold">{sample.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sample.description}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <Link href={sample.href}>
                        <Button variant="secondary" className="w-full">
                          {sample.cta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold text-primary">
                3단계로 끝내는 적용
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">
                클릭 몇 번이면 충분해요
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {howItWorks.map((item, index) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/70"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                      STEP {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feed Section */}
        {latestFeed.length > 0 && (
          <section className="border-t bg-muted/30 py-16 lg:py-20">
            <div className="mx-auto max-w-2xl px-4">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">피드</h2>
                    <p className="text-sm text-muted-foreground">
                      최신 AI 트렌드와 소식
                    </p>
                  </div>
                </div>
                <Link
                  href="/feed"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  더 보기 →
                </Link>
              </div>
              <FeedPreview posts={latestFeed} />
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="border-t py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
              첫 5분 체험 보장
            </div>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              지금 바로 시작해 보세요
            </h2>
            <p className="mb-8 text-muted-foreground">
              샌드박스에서 준비된 프롬프트로 결과를 확인하고, 마음에 들면 코스를
              이어가세요.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/sandbox">
                <Button size="lg">무료 체험 시작</Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg">
                  코스 보기
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
