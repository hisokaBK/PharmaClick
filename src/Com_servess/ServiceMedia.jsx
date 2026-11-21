import { useState } from "react";

export function ServicePhoto({ file, alt, caption }) {
  return (
    <figure className="service-photo">
      <img src={`/images/services/${file}.jpg`} alt={alt} loading="lazy" decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function ServiceVideo({ id, title, source, resource }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="service-video service-panel">
      <h2>{title}</h2>
      <p>Source: {source}</p>
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          allow="encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button className="btn btn-outline-success" type="button" onClick={() => setLoaded(true)}>
          Load video player
        </button>
      )}
      <p className="service-video-links">
        <a href={`https://www.youtube.com/watch?v=${id}`}>Watch on YouTube</a>
        {resource && <a href={resource}>Read the source resource</a>}
      </p>
    </section>
  );
}
