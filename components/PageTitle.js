export function PageTitle({ eyebrow, title, description, children }) {
  return <section className="page-title"><div className="container page-title-inner"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</div></section>;
}
