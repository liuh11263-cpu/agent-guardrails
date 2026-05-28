import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm text-blue-200">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">
        没找到这个 Debug Case
      </h1>
      <p className="mt-3 text-sm leading-7 text-slate-400">
        可能是 slug 还没有导出到本地 Markdown，或者内容工厂尚未审核通过。
      </p>
      <Link
        href="/debug"
        className="mt-6 inline-flex rounded-md border border-blue-400/40 px-4 py-2 text-sm text-blue-100 hover:bg-blue-500/10"
      >
        返回 Debug 列表
      </Link>
    </main>
  );
}
