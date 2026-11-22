import { useId, useState } from "react";
import { useI18n } from "../i18n/LanguageProvider";

export function ServicePhoto({ file, alt, caption }) {
  return (
    <figure className="service-photo">
      <img src={`/images/services/${file}.jpg`} alt={alt} loading="lazy" decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function ServiceVideo({ id, title, source, resource }) {
  const { t } = useI18n();
  const [loaded, setLoaded] = useState(false);
  const playerId = useId();

  return (
    <section className="service-video service-panel">
      <h2>{t(title)}</h2>
      <p>{t("Source:")} {t(source)}</p>
      <button className="btn btn-outline-success" type="button" aria-expanded={loaded} aria-controls={playerId} onClick={() => setLoaded(current => !current)}>
        {loaded ? t("Hide video player") : t("Load video player")}
      </button>
      <div id={playerId} hidden={!loaded}>
        {loaded && <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={t(title)}
          allow="encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />}
      </div>
      <p className="service-video-links">
        <a href={`https://www.youtube.com/watch?v=${id}`}>{t("Watch on YouTube")}</a>
        {resource && <a href={resource}>{t("Read the source resource")}</a>}
      </p>
    </section>
  );
}
