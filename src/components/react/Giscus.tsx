import GiscusComponent from '@giscus/react';

export default function Giscus() {
  return (
    <div className="mt-12 pt-8 border-t border-slate-700">
      <h2 className="text-xl font-bold text-white mb-6">Comments</h2>
      <GiscusComponent
        repo="briang7/contentforge"
        repoId="R_kgDORfjZ8w"
        category="General"
        categoryId="DIC_kwDORfjZ884C3xXv"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark_dimmed"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
