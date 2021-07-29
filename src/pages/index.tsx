import Head from "next/head";
import Image from "next/image";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import { blurPlaceholder } from "../lib/placeholders";
import { UnsplashResponseData } from "./api/unsplash";

const Results: React.FC<{
  query: string;
}> = ({ query }) => {
  const { data, error } = useSWR<UnsplashResponseData>(
    `/api/unsplash?q=${query}`
  );

  if (error) return <p>failed to load</p>;
  if (!data) return <p>loading...</p>;

  return data.results ? (
    <ul
      className="mx-auto grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))" }}
    >
      {data.results.map((result) => (
        <li
          key={result.id}
          className="flex justify-center items-center relative"
        >
          <a
            href={result.link}
            target="_blank"
            rel="noreferrer"
            title={result.description ?? undefined}
          >
            <Image
              src={result.url}
              alt={result.description ?? " "}
              title={result.description ?? undefined}
              layout="fill"
              placeholder="blur"
              blurDataURL={blurPlaceholder}
            />
          </a>
        </li>
      ))}
      <style jsx>{`
        li::before {
          content: "";
          padding-top: 100%;
        }
        :global(img) {
          object-fit: cover;
        }
      `}</style>
    </ul>
  ) : (
    <p>No results.</p>
  );
};

export default function Home() {
  const [queryVal, setQueryVal] = useState("");
  const [submitted, setSubmitted] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-10 mx-auto text-center text-3xl">
      <Head>
        <title>Unsplash Micro</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          setSubmitted(inputRef.current?.value ?? "");
        }}
        className="w-full max-w-sm mb-8 mx-auto flex"
      >
        <input
          ref={inputRef}
          name="query"
          value={queryVal}
          onInput={(ev) => setQueryVal(ev.currentTarget.value)}
          className="text-xxl w-full border-2 border-black p-2 px-4 rounded-full flex-grow flex-shrink relative z-10"
        />
        <button
          type="submit"
          className="bg-black text-white p-2 px-5 pl-16 -ml-14 rounded-full flex-grow-0 flex-shrink-0"
        >
          Search
        </button>
      </form>

      {submitted && <Results query={submitted} />}
    </div>
  );
}
