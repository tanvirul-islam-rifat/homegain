import Link from "next/link";

export default function NotFound() {
  return (
    <div className="stack center">
      <h1 className="page-title">Page not found</h1>
      <Link href="/" className="btn btn-primary">
        Back to the plan
      </Link>
    </div>
  );
}
