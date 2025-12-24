import { Header } from '@/components/layout/Header'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: '서비스 이용약관 | AI Campus',
  description: 'AI Campus 서비스 이용약관',
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* 뒤로가기 */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>

          {/* 제목 */}
          <h1 className="mb-8 text-3xl font-bold text-foreground">
            서비스 이용약관
          </h1>

          {/* 내용 */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              최종 수정일: 2024년 11월 30일
            </p>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제1조 (목적)</h2>
              <p className="mt-2 text-foreground/80">
                이 약관은 AI Campus(이하 &quot;서비스&quot;)가 제공하는 온라인 교육 서비스의
                이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제2조 (정의)</h2>
              <p className="mt-2 text-foreground/80">
                이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-foreground/80">
                <li>&quot;서비스&quot;란 AI Campus가 제공하는 AI 활용 교육 콘텐츠 및 관련 서비스를 말합니다.</li>
                <li>&quot;회원&quot;이란 서비스에 가입하여 이용계약을 체결한 자를 말합니다.</li>
                <li>&quot;콘텐츠&quot;란 서비스에서 제공하는 강의, 자료, AI 샌드박스 등을 말합니다.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제3조 (회원가입)</h2>
              <p className="mt-2 text-foreground/80">
                서비스 이용을 희망하는 자는 서비스가 정한 가입 절차에 따라 회원가입을 신청하며,
                서비스는 이를 승낙함으로써 회원가입이 완료됩니다.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제4조 (서비스 이용)</h2>
              <p className="mt-2 text-foreground/80">
                회원은 서비스가 제공하는 콘텐츠를 이용할 수 있으며,
                일부 콘텐츠는 유료 결제 또는 특정 조건을 충족해야 이용할 수 있습니다.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제5조 (AI 서비스 이용 안내)</h2>
              <div className="mt-4 rounded border border-primary/20 bg-primary/5 p-4">
                <p className="font-medium text-primary">
                  중요 안내사항
                </p>
                <p className="mt-2 text-foreground/80">
                  AI 샌드박스에서 제공하는 AI 응답은 참고용 정보이며,
                  그 정확성이나 완전성을 보장하지 않습니다.
                  AI 응답을 활용하여 발생하는 결과에 대한 책임은 사용자에게 있습니다.
                </p>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제6조 (지적재산권)</h2>
              <p className="mt-2 text-foreground/80">
                서비스에서 제공하는 모든 콘텐츠의 저작권 및 지적재산권은 서비스에 귀속됩니다.
                회원은 개인 학습 목적으로만 콘텐츠를 이용할 수 있으며,
                무단 복제, 배포, 전송 등은 금지됩니다.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제7조 (회원 탈퇴)</h2>
              <p className="mt-2 text-foreground/80">
                회원은 언제든지 마이페이지에서 회원 탈퇴를 요청할 수 있으며,
                서비스는 관련 법령이 정하는 바에 따라 회원 정보를 처리합니다.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제8조 (면책 조항)</h2>
              <p className="mt-2 text-foreground/80">
                서비스는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등
                불가항력적인 사유로 서비스를 제공할 수 없는 경우에는
                서비스 제공에 대한 책임이 면제됩니다.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">제9조 (분쟁 해결)</h2>
              <p className="mt-2 text-foreground/80">
                서비스와 회원 간에 발생한 분쟁에 관한 소송은
                대한민국 법률을 준거법으로 하며,
                서비스 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
              </p>
            </section>

            <section className="mt-8 border-t border-border pt-8">
              <p className="text-sm text-muted-foreground">
                본 약관은 2024년 11월 30일부터 시행됩니다.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
