import { Header } from '@/components/layout/Header'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: '개인정보 처리방침 | AI Campus',
  description: 'AI Campus 개인정보 처리방침',
}

export default function PrivacyPage() {
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
            개인정보 처리방침
          </h1>

          {/* 내용 */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              최종 수정일: 2024년 11월 30일
            </p>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">1. 개인정보의 수집 및 이용 목적</h2>
              <p className="mt-2 text-foreground/80">
                AI Campus(이하 &quot;서비스&quot;)는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-foreground/80">
                <li>회원 가입 및 관리: 회원 식별, 서비스 이용</li>
                <li>서비스 제공: 교육 콘텐츠 제공, 학습 진도 관리</li>
                <li>고객 지원: 문의 응대, 공지사항 전달</li>
                <li>서비스 개선: 이용 통계 분석, 서비스 품질 향상</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">2. 수집하는 개인정보 항목</h2>
              <div className="mt-4 overflow-hidden rounded border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-foreground">구분</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">수집 항목</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">필수</td>
                      <td className="px-4 py-3 text-foreground/80">이메일, 이름(닉네임), 프로필 사진</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">자동 수집</td>
                      <td className="px-4 py-3 text-foreground/80">접속 로그, 기기 정보, 학습 기록</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">선택</td>
                      <td className="px-4 py-3 text-foreground/80">마케팅 수신 동의 여부</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">3. 개인정보의 보유 및 이용 기간</h2>
              <p className="mt-2 text-foreground/80">
                회원의 개인정보는 회원 탈퇴 시까지 보유하며,
                탈퇴 후에는 관련 법령에 따라 일정 기간 보관 후 파기합니다.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-foreground/80">
                <li>계약 또는 청약철회에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
                <li>접속에 관한 기록: 3개월</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">4. 개인정보의 제3자 제공</h2>
              <p className="mt-2 text-foreground/80">
                서비스는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-foreground/80">
                <li>회원이 사전에 동의한 경우</li>
                <li>법령에 의해 요구되는 경우</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">5. AI 서비스 관련 안내</h2>
              <div className="mt-4 rounded border border-primary/20 bg-primary/5 p-4">
                <p className="font-medium text-primary">
                  AI 샌드박스 이용 시 주의사항
                </p>
                <p className="mt-2 text-foreground/80">
                  AI 샌드박스에서 입력하시는 내용은 AI 모델 응답 생성에 사용됩니다.
                  민감한 개인정보나 기밀 정보의 입력을 자제해 주시기 바랍니다.
                  AI 응답은 참고용이며, 결과에 대한 책임은 사용자에게 있습니다.
                </p>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">6. 개인정보의 파기</h2>
              <p className="mt-2 text-foreground/80">
                회원 탈퇴 시 개인정보는 지체 없이 파기됩니다.
                전자적 파일 형태의 정보는 복구가 불가능한 방법으로 삭제하며,
                종이에 출력된 정보는 분쇄기로 파기합니다.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">7. 회원의 권리와 행사 방법</h2>
              <p className="mt-2 text-foreground/80">
                회원은 언제든지 다음의 권리를 행사할 수 있습니다.
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-foreground/80">
                <li>개인정보 열람 요청</li>
                <li>개인정보 수정 요청 (마이페이지에서 직접 수정 가능)</li>
                <li>개인정보 삭제 요청 (회원 탈퇴)</li>
                <li>개인정보 처리 정지 요청</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">8. 개인정보 보호책임자</h2>
              <p className="mt-2 text-foreground/80">
                개인정보 처리에 관한 문의사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
              </p>
              <div className="mt-4 rounded border border-border bg-muted/50 p-4">
                <p className="text-foreground/80">
                  이메일: privacy@aicampus.com
                </p>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-semibold text-foreground">9. 쿠키의 사용</h2>
              <p className="mt-2 text-foreground/80">
                서비스는 사용자 경험 향상을 위해 쿠키를 사용합니다.
                브라우저 설정에서 쿠키 사용을 거부할 수 있으나,
                일부 서비스 이용에 제한이 있을 수 있습니다.
              </p>
            </section>

            <section className="mt-8 border-t border-border pt-8">
              <p className="text-sm text-muted-foreground">
                본 개인정보 처리방침은 2024년 11월 30일부터 시행됩니다.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
