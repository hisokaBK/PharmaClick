import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export default function NavMegaMenu({ name, columns, active, setActive }) {
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const panel = useRef(null);
  const hoverClose = useRef(null);
  const focusFirst = useRef(false);
  const open = active?.name === name;

  function close() {
    setActive((current) => current?.name === name ? null : current);
  }

  useLayoutEffect(() => {
    if (!open) return;
    const navbar = root.current.closest(".nav-layout");
    const triggerElement = trigger.current;
    const menuElement = panel.current;
    const position = () => {
      const gutter = 12;
      const anchor = triggerElement.getBoundingClientRect();
      const menu = menuElement.getBoundingClientRect();
      const centeredLeft = anchor.left + (anchor.width - menu.width) / 2;
      const rightmostLeft = document.documentElement.clientWidth - gutter - menu.width;
      const left = Math.max(gutter, Math.min(centeredLeft, rightmostLeft));
      menuElement.style.setProperty("--mega-left", `${left - navbar.getBoundingClientRect().left}px`);
      menuElement.style.setProperty("--mega-height", `${Math.max(0, window.innerHeight - menu.top - gutter)}px`);
    };
    position();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(position);
    observer?.observe(navbar);
    observer?.observe(triggerElement);
    observer?.observe(menuElement);
    // The account controls can shift the flex-aligned triggers without resizing the navbar.
    let accountControls = navbar.lastElementChild;
    if (accountControls) observer?.observe(accountControls);
    const controlsObserver = new MutationObserver(() => {
      if (accountControls) observer?.unobserve(accountControls);
      accountControls = navbar.lastElementChild;
      if (accountControls) observer?.observe(accountControls);
      position();
    });
    controlsObserver.observe(navbar, { childList: true });
    window.addEventListener("resize", position);
    if (focusFirst.current) {
      focusFirst.current = false;
      menuElement.querySelector("a")?.focus();
    }
    return () => {
      clearTimeout(hoverClose.current);
      observer?.disconnect();
      controlsObserver.disconnect();
      window.removeEventListener("resize", position);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!root.current.contains(event.target)) setActive((current) => current?.name === name ? null : current);
    };
    const escape = (event) => {
      if (event.key !== "Escape") return;
      const hadFocus = root.current.contains(document.activeElement);
      setActive((current) => current?.name === name ? null : current);
      if (hadFocus) trigger.current.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [name, open, setActive]);

  return (
    <li className="nav-desktop-item nav-mega" ref={root}
      onPointerEnter={(event) => {
        clearTimeout(hoverClose.current);
        if (event.pointerType === "mouse" && !open) setActive({ name, pinned: false });
      }}
      onPointerLeave={() => {
        if (open && !active.pinned && !root.current.contains(document.activeElement)) {
          // Keep the panel open while the pointer crosses the gap below the navbar.
          hoverClose.current = setTimeout(() => {
            setActive((current) => current?.name === name && !current.pinned ? null : current);
          }, 320);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}>
      <button type="button" className="listA services-trigger" ref={trigger} aria-expanded={open} aria-controls={id}
        onClick={(event) => {
          if (open && (active.pinned || event.detail === 0)) close();
          else setActive({ name, pinned: true });
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;
          event.preventDefault();
          if (open) panel.current.querySelector("a")?.focus();
          else {
            focusFirst.current = true;
            setActive({ name, pinned: true });
          }
        }}>
        {name} <FiChevronDown className="dropdown-icon" aria-hidden="true" />
      </button>
      <div className="dropdown-menu nav-mega-panel" id={id} hidden={!open} ref={panel}>
        <div className="nav-mega-columns">
          {columns.map((sections) => (
            <div key={sections[0].title}>
              {sections.map(({ title, links }) => (
                <div className="nav-mega-section" key={title}>
                  <h6 className="h4_Services">{title}</h6>
                  {links.map(([label, route, Icon]) => (
                    <Link className="a_Services" key={route} to={route} onClick={close}>
                      <Icon className="me-2" aria-hidden="true" /> {label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}
