import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";
import CatalogDescription from "../Com_Medications/CatalogDescription";
import { catalogById } from "../data/catalogDescriptions";
import { data1 } from "../data/data1";
import { formatMessage } from "./LanguageProvider";
import en from "./en.json";
import fr from "./fr.json";
import ar from "./ar.json";

const languageNames = { en: "English", fr: "Français", ar: "العربية" };

function chooseLanguage(trigger, language) {
  fireEvent.click(trigger);
  fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitemradio", { name: languageNames[language] }));
}

beforeEach(() => {
  localStorage.clear();
  window.scrollTo = jest.fn();
  window.history.replaceState({}, "", "/Products?search=Doliprane");
});

test("translations have equal coverage and support fallback, interpolation and plurals", () => {
  expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort());
  expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort());
  expect(formatMessage("fr", "Account menu for {0}", ["Sara"])).toBe("Menu du compte de Sara");
  expect(formatMessage("fr", "{0} products found", [1])).toBe("1 produit trouvé");
  expect(formatMessage("ar", "{0} products found", [2])).toBe(ar["{0} products found"].two);
  expect(formatMessage("constructor", "{0} products found", [1])).toBe("1 product found");
  expect(formatMessage("ar", "Untranslated source text")).toBe("Untranslated source text");
});

test("keeps the active news filter while localizing the expanded article in French and Arabic", () => {
  window.history.replaceState({}, "", "/Medical_News");
  render(<App />);
  const selector = screen.getByRole("button", { name: /Language.*English/ });
  chooseLanguage(selector, "fr");
  fireEvent.change(screen.getByRole("combobox", { name: fr.Topic }), { target: { value: "Public health" } });
  const article = screen.getByRole("article");
  fireEvent.click(within(article).getByText(fr["Read example"]));
  expect(within(article).getByText(/Ouvrez la publication d’origine/)).toBeVisible();

  chooseLanguage(selector, "ar");
  expect(screen.getByRole("combobox", { name: ar.Topic })).toHaveValue("Public health");
  expect(within(article).getByText(/افتح المنشور الأصلي/)).toBeVisible();
});

test.each([
  ["/Health_Alerts", "Check the organization that issued the notice, the area it covers and the groups it applies to. Read the original announcement for instructions and subsequent updates."],
  ["/Herbal", "Look for the amount per serving and any other active ingredients."],
  ["/Mental", "Take a quiet moment to notice how sleep, energy, concentration and daily routines have been going. Write down what feels harder and what has helped you get through the day."],
  ["/Professional", "Keep your visit summary and follow-up details together. If instructions seem unclear or differ from what you remember, check with the clinic or pharmacist before making changes."],
  ["/Slep", "If sleep problems keep recurring or disrupt your daytime activities, discuss them with a healthcare professional. Bring any notes about your sleep pattern."],
  ["/Sports", "Look for movements you can adapt to a stable chair. A qualified instructor or physiotherapist can help tailor exercises when you need an adaptation."],
])("localizes the body copy on %s in all three languages", (route, passage) => {
  window.history.replaceState({}, "", route);
  render(<App />);
  const selector = screen.getByRole("button", { name: /Language.*English/ });
  if (route === "/Slep") fireEvent.click(screen.getByText("When should I ask for support?"));
  expect(screen.getByText(passage)).toBeVisible();

  chooseLanguage(selector, "fr");
  expect(screen.getByText(fr[passage])).toBeVisible();
  chooseLanguage(selector, "ar");
  expect(screen.getByText(ar[passage])).toBeVisible();
  expect(screen.queryByText(passage)).toBeNull();
});

test.each([1, 3, 8, 11, 13, 14, 17, 44, 47, 65, 80, 144, 149, 151, 153, 155, 157, 162, 173, 177, 178, 180, 186, 188, 194, 196, 210])("localizes catalog product %s without changing its name or price", (id) => {
  const product = data1.find((entry) => entry.id === id);
  window.history.replaceState({}, "", `/Produit/${id}`);
  render(<App />);
  const selector = screen.getByRole("button", { name: /Language.*English/ });
  for (const [language, locale] of [["en", en], ["fr", fr], ["ar", ar]]) {
    chooseLanguage(selector, language);
    const heading = screen.getByRole("heading", { name: product.title.trim().replace(/\s+/g, " ") });
    expect(heading).toBeVisible();
    expect(heading.textContent).toBe(product.title);
    const { profile } = catalogById.get(id);
    expect(screen.getByText(locale[`catalog.${profile}.shortDescription`])).toBeVisible();
    expect(screen.getByText(locale[`catalog.${profile}.fullDescription`])).toBeVisible();
    expect(screen.queryByText(product.fullDescription)).not.toBeInTheDocument();
    expect(document.documentElement.dir).toBe(language === "ar" ? "rtl" : "ltr");
    expect(screen.getByText(product.price.toFixed(2))).toBeVisible();
  }
});

test("every seed ID has a review status and both description fields in all three languages", () => {
  expect([...catalogById.keys()].sort()).toEqual(data1.map(({ id }) => id).sort());
  const expectedKeys = new Set();
  for (const { profile, status } of catalogById.values()) {
    expect(["complete", "needs-review"]).toContain(status);
    expect(profile === "unavailable" && status === "complete").toBe(false);
    for (const field of ["shortDescription", "fullDescription"]) {
      expectedKeys.add(`catalog.${profile}.${field}`);
    }
  }
  for (const locale of [en, fr, ar]) {
    expect(Object.keys(locale).filter((key) => key.startsWith("catalog.")).sort())
      .toEqual([...expectedKeys].sort());
    for (const key of expectedKeys) expect(locale[key].trim()).not.toBe("");
    for (const { profile } of catalogById.values()) {
      expect(locale[`catalog.${profile}.shortDescription`]).not.toBe(locale[`catalog.${profile}.fullDescription`]);
    }
  }
  for (const key of expectedKeys) expect(ar[key]).toMatch(/[\u0600-\u06FF]/);
});

test("keeps verified package facts with the matching listings", () => {
  expect(catalogById.get(17)).toEqual({ profile: "wheyStrawberry", status: "complete" });
  expect(catalogById.get(214)).toEqual(catalogById.get(17));
  expect(catalogById.get(47)).toEqual({ profile: "whey", status: "needs-review" });
  expect(catalogById.get(1)).toEqual({ profile: "unavailable", status: "needs-review" });
  expect(catalogById.get(180)).toEqual(catalogById.get(1));
  expect(catalogById.get(151)).toEqual({ profile: "etolFort", status: "complete" });
  expect(catalogById.get(162)).toEqual(catalogById.get(1));
  expect(catalogById.get(65)).toEqual(catalogById.get(1));
  expect(catalogById.get(153)).toEqual(catalogById.get(1));
  expect(catalogById.get(13).profile).toBe("pediakidSpray");
  expect(catalogById.get(210).profile).toBe("pediakidD3");
  expect(catalogById.get(44).profile).toBe("surfaceGel");
  expect(catalogById.get(157)).toEqual({ profile: "toplexil", status: "complete" });
  expect([80, 149, 173, 178].map((id) => catalogById.get(id)?.profile))
    .toEqual(["omega3Capsules", "curcuminCapsules", "bandageRoll", "footSleeve"]);
});

test("keeps an edited description and leaves an empty field blank", () => {
  render(
    <>
      <CatalogDescription product={{ id: 194, shortDescription: "Edited catalog copy." }} />
      <p data-testid="empty-description">
        <CatalogDescription product={{ id: 999, shortDescription: " " }} />
      </p>
    </>
  );
  expect(screen.getByText("Edited catalog copy.")).toBeVisible();
  expect(screen.getByTestId("empty-description")).toBeEmptyDOMElement();
});

test("shows localized sign-in field errors and clears each error when corrected", () => {
  window.history.replaceState({}, "", "/signin");
  render(<App />);
  const selector = screen.getByRole("button", { name: /Language.*English/ });
  const message = "This field is required.";
  chooseLanguage(selector, "fr");
  const email = screen.getByLabelText(fr["Email address"]);
  const toggle = screen.getByRole("button", { name: fr["Show password"] });
  expect(email.form).toHaveAttribute("novalidate");
  expect(email).not.toHaveAttribute("aria-invalid");
  fireEvent.submit(email.form);
  expect(email).toHaveFocus();
  expect(screen.getAllByText(fr[message])).toHaveLength(2);
  expect(email).toHaveAccessibleDescription(fr[message]);

  chooseLanguage(selector, "ar");
  expect(toggle).toHaveAccessibleName(ar["Show password"]);
  fireEvent.click(toggle);
  expect(toggle).toHaveAccessibleName(ar["Hide password"]);
  expect(document.documentElement.dir).toBe("rtl");
  expect(screen.getAllByText(ar[message])).toHaveLength(2);
  fireEvent.change(email, { target: { value: "invalid-email" } });
  expect(email).toHaveAccessibleDescription(ar["Enter a valid email address."]);
  chooseLanguage(selector, "en");
  expect(email).toHaveValue("invalid-email");
  expect(email).toHaveAccessibleDescription("Enter a valid email address.");
  fireEvent.change(email, { target: { value: "valid@example.com" } });
  expect(email).not.toHaveAttribute("aria-invalid");
  expect(screen.getByLabelText("Password")).toHaveAttribute("aria-invalid", "true");
});

test("French and Arabic keep the search route and cart, persist on reload, and restore English direction", () => {
  const { unmount } = render(<App />);
  expect(document.documentElement.lang).toBe("en");
  const navigation = screen.getByRole("navigation");
  const selector = within(navigation).getByRole("button", { name: /Language.*English/ });
  fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);

  chooseLanguage(selector, "fr");
  expect(screen.getByRole("searchbox", { name: fr["Search products by name"] })).toHaveValue("Doliprane");
  expect(within(navigation).getByRole("link", { name: formatMessage("fr", "Shopping cart, {0} products", [1]) })).toBeInTheDocument();
  expect(document.documentElement.dir).toBe("ltr");
  chooseLanguage(selector, "ar");
  expect(document.documentElement.lang).toBe("ar");
  expect(document.documentElement.dir).toBe("rtl");
  expect(window.location.search).toBe("?search=Doliprane");
  expect(screen.getByRole("searchbox", { name: ar["Search products by name"] })).toHaveValue("Doliprane");
  unmount();

  render(<App />);
  const restored = within(screen.getByRole("navigation")).getByRole("button", { name: `${ar.Language} · ${languageNames.ar}` });
  expect(restored).toHaveTextContent("ع");
  chooseLanguage(restored, "en");
  expect(document.documentElement.dir).toBe("ltr");
  expect(document.documentElement.lang).toBe("en");
});

test("shows the current abbreviation and supports menu keyboard navigation", () => {
  render(<App />);
  const trigger = screen.getByRole("button", { name: /Language.*English/ });
  expect(trigger).toHaveTextContent("ENG");
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  const [arabic, french, english] = screen.getAllByRole("menuitemradio");
  expect(arabic).toHaveFocus();
  expect(english).toHaveAttribute("aria-checked", "true");
  fireEvent.keyDown(arabic, { key: "ArrowUp" });
  expect(english).toHaveFocus();
  fireEvent.keyDown(english, { key: "Home" });
  expect(arabic).toHaveFocus();
  fireEvent.keyDown(arabic, { key: "ArrowDown" });
  expect(french).toHaveFocus();
  fireEvent.click(french);
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveTextContent("FR");
  expect(trigger).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(trigger);
  expect(french).toHaveFocus();
  fireEvent.keyDown(french, { key: "Escape" });
  expect(trigger).toHaveFocus();
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  chooseLanguage(trigger, "ar");
  expect(trigger).toHaveTextContent("ع");
});

test("shares the desktop menu state and closes the language menu on outside pointer input", () => {
  render(<App />);
  const trigger = screen.getByRole("button", { name: /Language.*English/ });
  const medications = screen.getByRole("button", { name: "Medications" });
  const services = screen.getByRole("button", { name: "Services" });
  fireEvent.click(medications);
  fireEvent.click(trigger);
  expect(medications).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(services);
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(services).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(trigger);
  fireEvent.pointerDown(screen.getByRole("searchbox"));
  expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("switches language from the responsive drawer without closing the drawer", () => {
  render(<App />);
  const drawer = screen.getByRole("dialog", { hidden: true });
  drawer.showModal = () => { drawer.open = true; };
  fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
  const trigger = within(drawer).getByRole("button", { name: /Language.*English/ });
  chooseLanguage(trigger, "ar");
  expect(drawer.open).toBe(true);
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(document.documentElement.dir).toBe("rtl");
});
