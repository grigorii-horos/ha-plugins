import type { CustomCardEntry, HomeAssistant } from "./types";
import { languageOf } from "./i18n";

/**
 * Регистрация карточек и редакторов, переживающая вторую загрузку бандла.
 *
 * `customElements.define` на уже занятое имя бросает исключение, и модуль
 * умирает целиком. Случается это буднично: dev-ресурс остался в дашборде, а
 * рядом появился установленный через HACS. Работать будет тот, что загрузился
 * первым, — то есть можно смотреть на старый код, думая, что обновился.
 *
 * Поэтому вторая копия молча уступает первой и говорит об этом в консоль.
 */

let warned = false;

function alreadyLoaded(tag: string): void {
  if (warned) return;
  warned = true;
  // eslint-disable-next-line no-console
  console.warn(
    `horos-cards: карточка ${tag} уже зарегистрирована. Похоже, бандл ` +
      `подключён к дашборду дважды — работает копия, загруженная первой. ` +
      `Проверьте ресурсы дашборда.`
  );
}

/**
 * Язык пользователя в момент, когда список карточек читают.
 *
 * Список заполняется при загрузке бандла, когда `hass` ещё нет ни у одной
 * карточки. Поэтому название и описание — не строки, а геттеры: HA спрашивает
 * их, когда открывает окно добавления, и к этому моменту приложение уже на
 * странице.
 */
function currentLanguage(): string {
  const app = document.querySelector("home-assistant") as
    | { hass?: HomeAssistant }
    | null;
  return languageOf(app?.hass);
}

export interface CardTexts {
  ru: string;
  en: string;
}

export function registerCard(
  tag: string,
  ctor: CustomElementConstructor,
  entry: {
    type: string;
    name: CardTexts;
    description: CardTexts;
    preview?: boolean;
  }
): void {
  if (customElements.get(tag)) {
    alreadyLoaded(tag);
    return;
  }
  customElements.define(tag, ctor);
  window.customCards = window.customCards ?? [];
  window.customCards.push({
    type: entry.type,
    preview: entry.preview,
    get name() {
      return entry.name[currentLanguage() === "ru" ? "ru" : "en"];
    },
    get description() {
      return entry.description[currentLanguage() === "ru" ? "ru" : "en"];
    },
  } as CustomCardEntry);
}

export function registerEditor(
  tag: string,
  ctor: CustomElementConstructor
): void {
  if (customElements.get(tag)) return;
  customElements.define(tag, ctor);
}
