import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Paper } from "@/components/brand";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { getBulletins } from "@/lib/data";
import { koDate } from "@/lib/format";
import { MENU } from "@/lib/site";

export const metadata: Metadata = { title: "교회주보" };

export default async function BulletinListPage({ searchParams }: PageProps<"/news/bulletin">) {
  const { year: yearParam } = await searchParams;
  const all = await getBulletins(undefined, 400);
  const years = [...new Set(all.map((b) => Number(b.sunday_date.slice(0, 4))))];
  const year = Number(yearParam) || years[0];
  const list = all.filter((b) => b.sunday_date.startsWith(String(year)));
  const newestId = all[0]?.id;

  return (
    <>
      <PageHeader section={MENU[3]} title="교회주보" />
      <Container className="grid max-w-[960px] gap-4 py-6 lg:gap-6 lg:py-14">
        {years.length > 1 && (
          <nav aria-label="연도" className="flex gap-1.5">
            {years.map((y) => (
              <Link
                key={y}
                href={`/news/bulletin?year=${y}`}
                aria-current={y === year ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 font-en text-xs font-semibold lg:text-sm ${
                  y === year ? "bg-navy text-cream" : "bg-white text-sub ring-1 ring-line"
                }`}
              >
                {y}
              </Link>
            ))}
          </nav>
        )}

        {list.length === 0 ? (
          <p className="rounded-[22px] bg-white p-10 text-center text-sub shadow-card">아직 등록된 주보가 없습니다.</p>
        ) : (
          <ul>
            {list.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/news/bulletin/${b.id}`}
                  className="group grid grid-cols-[64px_1fr_auto] items-center gap-3.5 border-b border-line py-3.5 lg:grid-cols-[84px_1fr_auto] lg:gap-6 lg:py-5"
                >
                  {b.cover_url ? (
                    <Image src={b.cover_url} alt="" width={168} height={224} className="aspect-[3/4] rounded-md object-cover shadow-card" />
                  ) : (
                    <Paper small />
                  )}
                  <div>
                    <b className="block text-[15px] tracking-tight group-hover:text-brand-blue lg:text-lg">
                      {koDate(b.sunday_date)} 주보
                      {b.id === newestId && (
                        <span className="ml-1.5 rounded-full bg-brand-yellow px-[7px] py-px align-[2px] font-en text-[10px] font-bold text-navy">
                          NEW
                        </span>
                      )}
                    </b>
                    <small className="text-xs text-sub lg:text-sm">
                      {b.images.length > 0 ? `이미지 ${b.images.length}장` : b.pdf_url ? "PDF" : "준비 중"} · {b.title}
                    </small>
                  </div>
                  <span className="grid size-[30px] place-items-center rounded-full text-sub ring-1 ring-line" aria-hidden="true">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
